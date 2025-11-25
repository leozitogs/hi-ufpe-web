import { describe, it, expect, beforeEach, vi } from 'vitest';
import { consultarMedia } from '../../../_core/chatbot-functions';

// --- IMPORTAÇÕES DOS NOVOS MÓDULOS ---
import * as MatriculasDB from '../../../database/academic/matriculas';
import * as AvaliacoesDB from '../../../database/academic/avaliacoes';

// --- MOCKS ESPECÍFICOS ---
// Mockamos apenas os arquivos que a função 'consultarMedia' usa
vi.mock('../../../database/academic/matriculas');
vi.mock('../../../database/academic/avaliacoes');

describe('Integração: Funções do Chatbot', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('deve consultar média integrando dados do banco', async () => {
    // 1. Configurar Mocks nos módulos corretos
    vi.mocked(MatriculasDB.getMatriculasByAluno).mockResolvedValue([{
      matricula: { id: 'm1', mediaCalculada: '7.5', status: 'cursando' },
      disciplina: { nome: 'Desenvolvimento de Software' }
    }] as any);

    vi.mocked(AvaliacoesDB.getMetodoAvaliacaoByMatricula).mockResolvedValue({
      id: 'met1', nome: 'Padrão', tipo: 'media_ponderada'
    } as any);

    vi.mocked(AvaliacoesDB.getAvaliacoesByMetodo).mockResolvedValue([
      { nome: 'P1', notaObtida: '8.0' },
      { nome: 'P2', notaObtida: '7.0' }
    ] as any);

    // 2. Executar função do Chatbot
    const result = await consultarMedia('aluno_123', 'Desenvolvimento de Software');

    // 3. Verificar se a estrutura retornada está correta
    expect(result).toEqual({
      disciplina: 'Desenvolvimento de Software',
      media: '7.5',
      status: 'cursando',
      metodo: 'Padrão',
      avaliacoes: expect.any(Array)
    });
  });

  it('deve retornar erro amigável se disciplina não encontrada', async () => {
    vi.mocked(MatriculasDB.getMatriculasByAluno).mockResolvedValue([]);
    
    const result = await consultarMedia('aluno_123', 'Física Quântica');
    
    expect(result).toHaveProperty('error');
    expect(result.error).toContain('não encontrada');
  });
});