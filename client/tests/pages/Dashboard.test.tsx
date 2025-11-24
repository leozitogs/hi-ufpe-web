import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '@/pages/Dashboard';

// --- MOCKS COM VI.HOISTED (Para evitar erro de inicialização) ---
const { mockUseQuery } = vi.hoisted(() => {
  return {
    mockUseQuery: vi.fn(),
  };
});

// --- MOCK 1: Autenticação ---
vi.mock('@/_core/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: '123', name: 'Aluno Teste', periodo: '2025.1' },
    logout: vi.fn(),
  }),
}));

// --- MOCK 2: Navegação (Wouter) ---
vi.mock('wouter', () => ({
  useLocation: () => ['/dashboard', vi.fn()],
}));

// --- MOCK 3: Dados do Servidor (TRPC) ---
vi.mock('@/lib/trpc', () => ({
  trpc: {
    comunicados: { list: { useQuery: mockUseQuery } },
    matriculas: { list: { useQuery: mockUseQuery } },
    horarios: { listByAluno: { useQuery: mockUseQuery } },
  },
}));

describe('Página: Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Define retorno padrão para evitar quebrar o .map
    mockUseQuery.mockReturnValue({ data: [] }); 
  });

  it('deve renderizar a saudação ao usuário', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Olá, Aluno Teste/i)).toBeInTheDocument();
    expect(screen.getByText(/Bem-vindo de volta/i)).toBeInTheDocument();
  });

  it('deve renderizar os 4 cards de estatísticas principais', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Disciplinas')).toBeInTheDocument();
    expect(screen.getByText('Período')).toBeInTheDocument();
    expect(screen.getAllByText('Comunicados').length).toBeGreaterThan(0);
    expect(screen.getByText('Próxima Aula')).toBeInTheDocument();
  });

  it('deve renderizar a lista de Ações Rápidas corretamente', () => {
    render(<Dashboard />);

    expect(screen.getByText('Chatbot')).toBeInTheDocument();
    expect(screen.getByText('Horários')).toBeInTheDocument();
    expect(screen.getByText('Notas')).toBeInTheDocument();
    
    // O Dashboard tem botões para abrir as ações
    const botoesAcao = screen.getAllByRole('button', { name: /abrir/i });
    // Esperamos 4 ações rápidas (Chatbot, Horários, Notas, Comunicados)
    expect(botoesAcao.length).toBeGreaterThanOrEqual(4);
  });
});