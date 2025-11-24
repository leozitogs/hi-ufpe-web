import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFound from '../../src/pages/NotFound';

// --- MOCK DO WOUTER ---
// Interceptamos a biblioteca de rotas para controlar a navegação no teste
const mockSetLocation = vi.fn();

vi.mock('wouter', () => ({
  // useLocation retorna [location, setLocation]
  useLocation: () => ['/rota-inexistente', mockSetLocation],
}));

describe('Página: NotFound (404)', () => {
  it('deve exibir a mensagem de erro 404', () => {
    render(<NotFound />);

    // Verifica se os textos principais estão na tela
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('deve redirecionar para a Home ("/") ao clicar no botão', () => {
    render(<NotFound />);

    // Encontra o botão "Go Home"
    const botaoHome = screen.getByRole('button', { name: /go home/i });
    
    // Clica nele
    fireEvent.click(botaoHome);

    // Verifica se a função setLocation foi chamada com "/"
    expect(mockSetLocation).toHaveBeenCalledWith('/');
  });
});