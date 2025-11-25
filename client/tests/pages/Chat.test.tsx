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
    
    // CORREÇÃO: Como agora tem botão de voltar, pegamos todos e selecionamos o último (Enviar)
    const botoes = screen.getAllByRole('button');
    const botaoEnviar = botoes[botoes.length - 1];

    // 1. O botão deve começar desabilitado (input vazio)
    expect(botaoEnviar).toBeDisabled();

    // 2. Usuário digita
    fireEvent.change(input, { target: { value: 'Olá bot' } });
    
    // 3. Input deve ter o valor e botão deve habilitar
    expect(input).toHaveValue('Olá bot');
    expect(botaoEnviar).not.toBeDisabled();

    // 4. Usuário clica em enviar
    fireEvent.click(botaoEnviar);

    // 5. Verifica se a função de mutação (TRPC) foi chamada com o texto correto
    expect(mockEnviarMensagem).toHaveBeenCalledWith(
      expect.objectContaining({
        mensagem: 'Olá bot'
      })
    );
  });
});