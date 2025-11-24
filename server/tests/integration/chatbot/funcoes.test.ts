import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as db from '../../../db'; // Ajuste o caminho conforme sua pasta
import { consultarMedia } from '../../../_core/chatbot-functions';

// Mock do módulo db completo
vi.mock('../../../db');

describe('Integração: Funções do Chatbot', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('deve consultar média integrando dados do banco', async () => {
    // 1. Configurar Mock do Banco
    vi.mocked(db.getMatriculasByAluno).mockResolvedValue([{
      matricula: { id: 'm1', mediaCalculada: '7.5', status: 'cursando' },
      disciplina: { nome: 'Desenvolvimento de Software' }
    }] as any);

    vi.mocked(db.getMetodoAvaliacaoByMatricula).mockResolvedValue({
      id: 'met1', nome: 'Padrão', tipo: 'media_ponderada'
    } as any);

    vi.mocked(db.getAvaliacoesByMetodo).mockResolvedValue([
      { nome: 'P1', notaObtida: '8.0' },
      { nome: 'P2', notaObtida: '7.0' }
    ] as any);

    // 2. Executar função do Chatbot
    const result = await consultarMedia('aluno_123', 'Desenvolvimento de Software');

    // 3. Verificar se a estrutura retornada está correta para a IA ler
    expect(result).toEqual({
      disciplina: 'Desenvolvimento de Software',
      media: '7.5',
      status: 'cursando',
      metodo: 'Padrão',
      avaliacoes: expect.any(Array)
    });
  });

  it('deve retornar erro amigável se disciplina não encontrada', async () => {
    vi.mocked(db.getMatriculasByAluno).mockResolvedValue([]);
    
    const result = await consultarMedia('aluno_123', 'Física Quântica');
    
    expect(result).toHaveProperty('error');
    expect(result.error).toContain('não encontrada');
  });
});