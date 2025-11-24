import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useComposition } from '@/hooks/useComposition';

// --- MOCK DO usePersistFn ---
// Como é uma dependência interna, mockamos para ela apenas retornar a função original
// Isso isola o teste apenas na lógica do useComposition
vi.mock('@/hooks/usePersistFn', () => ({
  usePersistFn: (fn: any) => fn,
}));

describe('Hook: useComposition', () => {
  beforeEach(() => {
    // Assume o controle do relógio do sistema para testar os setTimeouts
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // Helper para criar eventos falsos
  const createEvent = (key: string, shiftKey = false) => ({
    key,
    shiftKey,
    stopPropagation: vi.fn(),
    // Adicione outras props se o TS reclamar
  } as unknown as React.KeyboardEvent<HTMLInputElement>);

  it('deve iniciar com isComposing = false', () => {
    const { result } = renderHook(() => useComposition());
    expect(result.current.isComposing()).toBe(false);
  });

  it('deve alterar para true ao disparar onCompositionStart', () => {
    const { result } = renderHook(() => useComposition());
    
    // Simula o início da composição (digitação de acento/IME)
    result.current.onCompositionStart({} as any);
    
    expect(result.current.isComposing()).toBe(true);
  });

  it('deve executar os callbacks originais passados nas opções', () => {
    const onStart = vi.fn();
    const onEnd = vi.fn();
    const onKey = vi.fn();

    const { result } = renderHook(() => useComposition({
      onCompositionStart: onStart,
      onCompositionEnd: onEnd,
      onKeyDown: onKey
    }));

    // Executa os handlers do hook
    result.current.onCompositionStart({} as any);
    result.current.onCompositionEnd({} as any);
    result.current.onKeyDown(createEvent('a'));

    expect(onStart).toHaveBeenCalled();
    expect(onEnd).toHaveBeenCalled();
    expect(onKey).toHaveBeenCalled();
  });

  describe('Bloqueio de Teclas (Enter/Escape)', () => {
    it('DEVE bloquear "Enter" se estiver compondo (stopPropagation)', () => {
      const { result } = renderHook(() => useComposition());
      const event = createEvent('Enter');

      // 1. Inicia composição
      result.current.onCompositionStart({} as any);

      // 2. Pressiona Enter
      result.current.onKeyDown(event);

      // 3. Deve ter bloqueado a propagação (para não enviar formulário)
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('NÃO deve bloquear "Enter" se NÃO estiver compondo', () => {
      const { result } = renderHook(() => useComposition());
      const event = createEvent('Enter');

      // Não chamamos onCompositionStart

      result.current.onKeyDown(event);

      expect(event.stopPropagation).not.toHaveBeenCalled();
    });

    it('NÃO deve bloquear "Shift+Enter" mesmo compondo', () => {
      const { result } = renderHook(() => useComposition());
      const event = createEvent('Enter', true); // Shift = true

      result.current.onCompositionStart({} as any);
      result.current.onKeyDown(event);

      expect(event.stopPropagation).not.toHaveBeenCalled();
    });
  });

  describe('Lógica de Timeout (Safari Fix)', () => {
    it('deve aguardar os timeouts antes de definir isComposing = false', () => {
      const { result } = renderHook(() => useComposition());

      // 1. Inicia
      result.current.onCompositionStart({} as any);
      expect(result.current.isComposing()).toBe(true);

      // 2. Encerra (Isso dispara os setTimeouts aninhados)
      result.current.onCompositionEnd({} as any);

      // 3. Imediatamente após encerrar, AINDA deve ser true (por causa do Safari fix)
      expect(result.current.isComposing()).toBe(true);

      // 4. Avança o tempo (executa os timers pendentes)
      vi.runAllTimers();

      // 5. Agora sim deve ser false
      expect(result.current.isComposing()).toBe(false);
    });
  });
});