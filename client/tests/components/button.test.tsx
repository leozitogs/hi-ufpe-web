import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Componente: Button', () => {
  it('deve renderizar o texto corretamente', () => {
    render(<Button>Clique Aqui</Button>);
    
    // Verifica se existe um botão com este texto
    const botao = screen.getByRole('button', { name: /clique aqui/i });
    expect(botao).toBeInTheDocument();
  });

  it('deve disparar o evento onClick quando clicado', () => {
    // Criamos uma função "espiã" (Mock)
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Ação</Button>);
    
    const botao = screen.getByRole('button');
    fireEvent.click(botao); // Simula o clique do usuário

    // Verifica se a função foi chamada 1 vez
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve aplicar a classe de variante "destructive" (vermelho)', () => {
    render(<Button variant="destructive">Deletar</Button>);
    
    const botao = screen.getByRole('button');
    
    // Verifica se a classe do Tailwind correspondente foi aplicada
    // (Baseado no seu código: "bg-destructive")
    expect(botao).toHaveClass('bg-destructive');
  });

  it('deve estar desabilitado quando a prop disabled é passada', () => {
    render(<Button disabled>Bloqueado</Button>);
    
    const botao = screen.getByRole('button');
    expect(botao).toBeDisabled();
  });
});