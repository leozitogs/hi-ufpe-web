import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Chat from '@/pages/Chat';

// --- MOCKS ELEGANTES COM VI.HOISTED ---
// O método hoisted executa antes de tudo, garantindo que as variáveis
// existam quando o vi.mock lá embaixo tentar usá-las.
const { mockGetConversa, mockEnviarMensagem, mockInvalidate } = vi.hoisted(() => {
  return {
    mockGetConversa: vi.fn(),
    mockEnviarMensagem: vi.fn(),
    mockInvalidate: vi.fn(),
  };
});

// 1. Fix para JSDOM (que não tem scroll nativo)
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// 2. Mock de Autenticação
vi.mock('@/_core/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: '123', name: 'Aluno' },
  }),
}));

// 3. Mock do TRPC (Usando as variáveis hoisted seguras)
vi.mock('@/lib/trpc', () => ({
  trpc: {
    useContext: () => ({
      chat: { getConversa: { invalidate: mockInvalidate } }
    }),
    chat: {
      getConversa: { useQuery: mockGetConversa },
      enviarMensagem: { useMutation: () => ({ 
        mutate: mockEnviarMensagem, 
        status: 'idle' 
      }) }
    }
  }
}));

describe('Página: Chat (Hi Assistant)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Configura o retorno padrão (limpo) para cada teste
    mockGetConversa.mockReturnValue({ data: { mensagens: [] }, isFetching: false });
  });

  it('deve renderizar o estado vazio inicial corretamente', () => {
    render(<Chat />);
    
    expect(screen.getByText(/Olá! Sou o Hi Assistant/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite sua mensagem/i)).toBeInTheDocument();
  });

  it('deve renderizar mensagens quando existirem', () => {
    // Simulamos dados retornados pelo "Backend"
    mockGetConversa.mockReturnValue({
      data: {
        mensagens: [
          { id: '1', role: 'user', conteudo: 'Qual minha nota?', createdAt: new Date() },
          { id: '2', role: 'assistant', conteudo: 'Sua nota é 10!', createdAt: new Date() }
        ]
      },
      isFetching: false
    });

    render(<Chat />);

    expect(screen.getByText('Qual minha nota?')).toBeInTheDocument();
    expect(screen.getByText('Sua nota é 10!')).toBeInTheDocument();
  });

  it('deve permitir digitar e enviar uma mensagem', () => {
    render(<Chat />);

    const input = screen.getByPlaceholderText(/Digite sua mensagem/i);
    const botaoEnviar = screen.getByRole('button'); // Busca genérica pois só há um botão

    // 1. Estado inicial
    expect(botaoEnviar).toBeDisabled();

    // 2. Interação de digitação
    fireEvent.change(input, { target: { value: 'Olá bot' } });
    
    // 3. Validação de estado pós-digitação
    expect(input).toHaveValue('Olá bot');
    expect(botaoEnviar).not.toBeDisabled();

    // 4. Interação de envio
    fireEvent.click(botaoEnviar);

    // 5. Verificação da chamada da função mockada
    expect(mockEnviarMensagem).toHaveBeenCalledWith(
      expect.objectContaining({
        mensagem: 'Olá bot'
      })
    );
  });
});