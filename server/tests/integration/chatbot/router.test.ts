import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from '@server/routers';

// --- IMPORTAÇÕES DOS MÓDULOS REFATORADOS ---
import * as ComunicadosDB from '@server/database/communication/comunicados';
import * as DisciplinasDB from '@server/database/academic/disciplinas';
import * as MatriculasDB from '@server/database/academic/matriculas';
import * as ChatDB from '@server/database/communication/chatbot';

// --- MOCKS INDIVIDUAIS ---
// Precisamos mockar cada arquivo que o router usa
vi.mock('@server/database/communication/comunicados');
vi.mock('@server/database/academic/disciplinas');
vi.mock('@server/database/academic/matriculas');
vi.mock('@server/database/communication/chatbot');

// Mock da LLM
vi.mock('@server/_core/llm', () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "Olá, sou o Hi Assistant simulado." } }]
  })
}));

describe('Integração: App Router (tRPC)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createCaller = (userRole: 'admin' | 'user' | 'professor' = 'user') => {
    const context = {
      user: {
        id: 'user_123',
        role: userRole,
        name: 'Teste User',
        email: 'teste@ufpe.br',
        loginMethod: 'local', 
        periodo: '2025.2'
      },
      req: {} as any,
      res: { clearCookie: vi.fn() } as any
    };
    return appRouter.createCaller(context as any);
  };

  describe('🔒 Segurança e Permissões', () => {
    it('NÃO deve permitir que um aluno crie comunicados (Rota Admin)', async () => {
      const caller = createCaller('user');

      const promise = caller.comunicados.create({
        titulo: 'Hackeando o sistema',
        conteudo: 'Teste'
      });

      await expect(promise).rejects.toThrow();
      try {
        await promise;
      } catch (e: any) {
        expect(['FORBIDDEN', 'UNAUTHORIZED']).toContain(e.code);
      }
    });

    it('DEVE permitir que um admin crie comunicados', async () => {
      const caller = createCaller('admin');
      
      // Mock do módulo específico
      vi.mocked(ComunicadosDB.createComunicado).mockResolvedValue('com_123');

      const result = await caller.comunicados.create({
        titulo: 'Aviso Oficial',
        conteudo: 'Teste'
      });

      expect(result).toBe('com_123');
      expect(ComunicadosDB.createComunicado).toHaveBeenCalled();
    });
  });

  describe('📚 Disciplinas', () => {
    it('deve listar disciplinas chamando o banco', async () => {
      const caller = createCaller('user');
      
      const mockDisciplinas = [{ id: 'd1', nome: 'Calculo I' }];
      vi.mocked(DisciplinasDB.getDisciplinas).mockResolvedValue(mockDisciplinas as any);

      const result = await caller.disciplinas.list();
      
      expect(result).toHaveLength(1);
      expect(result[0].nome).toBe('Calculo I');
    });
  });

  describe('🎓 Matrículas', () => {
    it('deve filtrar matrículas pelo período solicitado', async () => {
      const caller = createCaller('user');

      const mockDados = [
        { matricula: { periodo: '2025.1' }, disciplina: { nome: 'A' } },
        { matricula: { periodo: '2024.2' }, disciplina: { nome: 'B' } }
      ];
      
      vi.mocked(MatriculasDB.getMatriculasByAluno).mockResolvedValue(mockDados as any);

      const result = await caller.matriculas.list({ periodo: '2025.1' });

      expect(result).toHaveLength(1);
      expect((result[0] as any).matricula.periodo).toBe('2025.1');
    });
  });

  describe('🤖 Chatbot', () => {
    it('deve criar conversa e processar mensagem básica', async () => {
      const caller = createCaller('user');

      vi.mocked(ChatDB.createConversa).mockResolvedValue('conv_new');
      // Note que o router chama MatriculasDB para pegar contexto
      vi.mocked(MatriculasDB.getMatriculasByAluno).mockResolvedValue([]); 
      vi.mocked(ChatDB.getMensagens).mockResolvedValue([]);
      vi.mocked(ChatDB.createMensagem).mockResolvedValue('msg_1');

      const result = await caller.chat.enviarMensagem({
        mensagem: 'Olá bot'
      });

      expect(result.conversaId).toBe('conv_new');
      expect(result.resposta).toContain('Olá, sou o Hi Assistant simulado');
      expect(ChatDB.createMensagem).toHaveBeenCalled(); 
    });
  });
});