import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// --- MOCK GLOBAL: window.matchMedia ---
// O JSDOM não implementa matchMedia nativamente.
// Precisamos definir isso aqui para que componentes como Dashboard e Hooks funcionem.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Depreciado
    removeListener: vi.fn(), // Depreciado
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Limpeza automática após cada teste
afterEach(() => {
  cleanup();
});