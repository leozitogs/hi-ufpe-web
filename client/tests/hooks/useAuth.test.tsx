import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuth } from '@/_core/hooks/useAuth';

// --- 1. MOCKS DO TRPC (HOISTED) ---
const { mockUseQuery, mockUseMutation, mockUseUtils, mockMutateAsync } = vi.hoisted(() => {
  const mutateAsync = vi.fn();
  return {
    mockUseQuery: vi.fn(),
    mockUseMutation: vi.fn(() => ({
      mutateAsync,
      isPending: false,
      error: null,
    })),
    mockUseUtils: vi.fn(),
    mockMutateAsync: mutateAsync,
  };
});

// Mock da biblioteca TRPC
vi.mock('@/lib/trpc', () => ({
  trpc: {
    useUtils: mockUseUtils,
    auth: {
      me: { useQuery: mockUseQuery },
      logout: { useMutation: mockUseMutation },
    },
  },
}));

// Mock das constantes (URL de login)
vi.mock('@/const', () => ({
  getLoginUrl: () => '/login-page',
}));

// SEU ARQUIVO PRECISA TER ESTE BLOCO 'DESCRIBE' PARA O TESTE SER ENCONTRADO
describe('Hook: useAuth', () => {
  const originalLocation = window.location;
  
  const mockSetData = vi.fn();
  const mockInvalidate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseUtils.mockReturnValue({
      auth: {
        me: {
          setData: mockSetData,
          invalidate: mockInvalidate,
        },
      },
    });

    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    // Mock de navegação seguro
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, href: '', pathname: '/dashboard' },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  describe('Estado Inicial', () => {
    it('deve retornar isAuthenticated = false se não houver usuário', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('deve retornar isAuthenticated = true se houver usuário', () => {
      mockUseQuery.mockReturnValue({
        data: { id: '1', name: 'Aluno' },
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('deve combinar estado de loading', () => {
      mockUseQuery.mockReturnValue({ data: null, isLoading: true });
      const { result } = renderHook(() => useAuth());
      expect(result.current.loading).toBe(true);
    });
  });

  describe('Redirecionamento (Proteção de Rota)', () => {
    it('NÃO deve redirecionar se a opção redirectOnUnauthenticated for false', () => {
      const { result } = renderHook(() => useAuth({ redirectOnUnauthenticated: false }));
      expect(window.location.href).toBe('');
    });

    it('DEVE redirecionar para login se não autenticado e opção for true', () => {
      mockUseQuery.mockReturnValue({ data: null, isLoading: false });
      renderHook(() => useAuth({ redirectOnUnauthenticated: true }));
      expect(window.location.href).toBe('/login-page');
    });

    it('NÃO deve redirecionar enquanto estiver carregando', () => {
      mockUseQuery.mockReturnValue({ data: null, isLoading: true });
      renderHook(() => useAuth({ redirectOnUnauthenticated: true }));
      expect(window.location.href).toBe('');
    });
  });

  describe('Logout', () => {
    it('deve chamar a mutação de logout e limpar o cache', async () => {
      const { result } = renderHook(() => useAuth());
      await result.current.logout();
      
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(mockSetData).toHaveBeenCalledWith(undefined, null);
    });
  });
});