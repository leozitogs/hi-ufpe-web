import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useIsMobile } from '@/hooks/useMobile';

// --- MOCK DO MATCHMEDIA ---
// O JSDOM não tem matchMedia, então criamos um falso.
const mockMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Depreciado
    removeListener: vi.fn(), // Depreciado
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe('Hook: useIsMobile', () => {
  // Salva o window.innerWidth original para restaurar depois
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    // Reseta mocks antes de cada teste
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restaura o tamanho original da janela
    window.innerWidth = originalInnerWidth;
  });

  it('deve retornar true quando a largura for menor que 768px (Mobile)', () => {
    // 1. Simula largura de celular (ex: 500px)
    window.innerWidth = 500;
    
    // 2. Mocka o matchMedia para dizer "Sim, a media query bateu"
    window.matchMedia = mockMatchMedia(true);

    // 3. Renderiza o hook
    const { result } = renderHook(() => useIsMobile());

    // 4. Verifica o valor retornado
    expect(result.current).toBe(true);
  });

  it('deve retornar false quando a largura for maior ou igual a 768px (Desktop)', () => {
    // 1. Simula largura de desktop (ex: 1024px)
    window.innerWidth = 1024;
    
    // 2. Mocka o matchMedia para dizer "Não, a media query não bateu"
    window.matchMedia = mockMatchMedia(false);

    // 3. Renderiza o hook
    const { result } = renderHook(() => useIsMobile());

    // 4. Verifica o valor retornado
    expect(result.current).toBe(false);
  });

  it('deve retornar false no breakpoint exato (768px)', () => {
    // Edge Case: O breakpoint exato geralmente conta como Desktop no seu código
    // (window.innerWidth < MOBILE_BREAKPOINT) -> 768 < 768 é Falso.
    window.innerWidth = 768;
    window.matchMedia = mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });
});