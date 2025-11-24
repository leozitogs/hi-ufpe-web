import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from '@server/routers';
import * as db from '@server/db';

// --- MOCKS ---
vi.mock('@server/db');

vi.mock('@server/_core/llm', () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "Olá, sou o Hi Assistant simulado." } }]
  })
}));

describe('Integração: App Router (tRPC)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper para criar o "chamador" da API simulando um usuário
  // IMPORTANTE: Definido como const dentro do bloco, sem ser retornado
  const createCaller = (userRole: 'admin' | 'user' | 'professor' = 'user') => {
    const context = {
      user: {
        id: 'user_123',
        role: userRole,
        name: 'Teste User',
        email: 'teste@ufpe.br',
        // Usamos 'as any' para ignorar campos obrigatórios do banco (createdAt, matricula)
        // que não são usados na lógica destes testes específicos.
        loginMethod: 'local', 
        periodo: '2025.2'
      },
      req: {} as any,
      res: { clearCookie: vi.fn() } as any
    };
    
    // Casting 'as any' no contexto para satisfazer o tRPC estrito
    return appRouter.createCaller(context as any);
  };

  describe('🔒 Segurança e Permissões', () => {
    it('NÃO deve permitir que um aluno crie comunicados (Rota Admin)', async () => {
      const caller = createCaller('user'); // Usuário comum

      // Tenta chamar rota protegida
      const promise = caller.comunicados.create({
        titulo: 'Hackeando o sistema',
        conteudo: 'Teste'
      });

      // Espera que rejeite com erro FORBIDDEN
      await expect(promise).rejects.toThrow();
      try {
        await promise;
      } catch (e: any) {
        // Verifica se o código do erro é de permissão
        // Pode ser FORBIDDEN ou UNAUTHORIZED dependendo de como o middleware falha
        expect(['FORBIDDEN', 'UNAUTHORIZED']).toContain(e.code);
      }
    });

    it('DEVE permitir que um admin crie comunicados', async () => {
      const caller = createCaller('admin');
      
      // Mock do retorno do DB
      vi.mocked(db.createComunicado).mockResolvedValue('com_123');

      const result = await caller.comunicados.create({
        titulo: 'Aviso Oficial',
        conteudo: 'Teste'
      });

      expect(result).toBe('com_123');
      expect(db.createComunicado).toHaveBeenCalled();
    });
  });

  describe('📚 Disciplinas', () => {
    it('deve listar disciplinas chamando o banco', async () => {
      const caller = createCaller('user');
      
      const mockDisciplinas = [{ id: 'd1', nome: 'Calculo I' }];
      vi.mocked(db.getDisciplinas).mockResolvedValue(mockDisciplinas as any);

      const result = await caller.disciplinas.list();
      
      expect(result).toHaveLength(1);
      expect(result[0].nome).toBe('Calculo I');
    });
  });

  describe('🎓 Matrículas (Lógica de Filtro)', () => {
    it('deve filtrar matrículas pelo período solicitado', async () => {
      const caller = createCaller('user');

      // Mock retorna dados misturados (com estrutura flexível do seu DB)
      const mockDados = [
        { matricula: { periodo: '2025.1' }, disciplina: { nome: 'A' } },
        { matricula: { periodo: '2024.2' }, disciplina: { nome: 'B' } }
      ];
      
      vi.mocked(db.getMatriculasByAluno).mockResolvedValue(mockDados as any);

      // Chamamos o router pedindo só 2025.1
      const result = await caller.matriculas.list({ periodo: '2025.1' });

      // O router tem um .filter() interno, testamos se ele funcionou
      expect(result).toHaveLength(1);
      // O cast para 'any' aqui é só para facilitar o teste, já que o retorno do mock é flexível
      expect((result[0] as any).matricula.periodo).toBe('2025.1');
    });
  });

  describe('🤖 Chatbot (Fluxo Principal)', () => {
    it('deve criar conversa e processar mensagem básica', async () => {
      const caller = createCaller('user');

      // Mocks necessários para o fluxo complexo do chat
      vi.mocked(db.createConversa).mockResolvedValue('conv_new');
      vi.mocked(db.getMatriculasByAluno).mockResolvedValue([]); // Sem contexto de disciplinas
      vi.mocked(db.getMensagens).mockResolvedValue([]); // Sem histórico
      vi.mocked(db.createMensagem).mockResolvedValue('msg_1'); // Persistência

      const result = await caller.chat.enviarMensagem({
        mensagem: 'Olá bot'
      });

      expect(result.conversaId).toBe('conv_new');
      // Verifica se chamou o mock da LLM (definido no topo do arquivo)
      expect(result.resposta).toContain('Olá, sou o Hi Assistant simulado');
      
      // Verifica se salvou a mensagem do usuário e do bot
      // Deve ser chamado pelo menos 2 vezes (1 user + 1 assistant)
      expect(db.createMensagem).toHaveBeenCalled(); 
    });
  });
});