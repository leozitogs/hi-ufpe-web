import { describe, it, expect } from 'vitest';
import { cn } from '../../src/lib/utils';

describe('Frontend Utils: cn()', () => {
  
  // Teste Básico: Junta strings simples
  it('deve combinar múltiplas classes em uma string única', () => {
    const resultado = cn('flex', 'items-center', 'justify-center');
    expect(resultado).toBe('flex items-center justify-center');
  });

  // Teste de Condicionais: A "mágica" do React
  it('deve aplicar classes condicionalmente (ignora false/null/undefined)', () => {
    const temErro = true;
    const estaCarregando = false;
    const usuario = undefined;

    const resultado = cn(
      'base-class',
      temErro && 'text-red-500',       // Deve entrar
      estaCarregando && 'opacity-50',  // Não deve entrar
      usuario && 'hidden'              // Não deve entrar
    );

    expect(resultado).toContain('base-class');
    expect(resultado).toContain('text-red-500');
    expect(resultado).not.toContain('opacity-50');
    expect(resultado).not.toContain('hidden');
  });

  // Teste do Tailwind Merge: A parte mais importante para o shadcn/ui
  it('deve resolver conflitos do Tailwind corretamente (último ganha)', () => {
    // Cenário: Um botão padrão tem padding 2 (p-2), mas nesta tela quero padding 4 (p-4).
    // O twMerge deve remover o p-2 e manter apenas o p-4.
    
    const resultado = cn('p-2 bg-blue-500', 'p-4'); 
    
    // Se fosse apenas concatenação, ficaria "p-2 bg-blue-500 p-4" (o CSS aplicaria o último, mas a string fica suja)
    // O twMerge limpa: "bg-blue-500 p-4"
    
    expect(resultado).toContain('p-4');
    expect(resultado).toContain('bg-blue-500');
    expect(resultado).not.toContain('p-2'); // O conflito foi resolvido
  });

  it('deve lidar com arrays e objetos aninhados (comportamento do clsx)', () => {
    const resultado = cn(['flex', 'grow'], { 'bg-red-500': true, 'hidden': false });
    expect(resultado).toBe('flex grow bg-red-500');
  });
});