import { describe, it, expect } from 'vitest';
import { calcularFrequencia, calcularLimiteFaltas } from '../../../utils/calculos';

describe('Unidade: Cálculos de Frequência', () => {
  // Casos Normais
  it('deve calcular frequência parcial corretamente (60h, 12 faltas = 80%)', () => {
    expect(calcularFrequencia(60, 12)).toBe(80);
  });

  // Valores-Limite (PDF)
  it('deve retornar 100% com 0 faltas', () => {
    expect(calcularFrequencia(60, 0)).toBe(100);
  });

  it('deve retornar 0% com todas as aulas faltadas', () => {
    expect(calcularFrequencia(60, 60)).toBe(0);
  });

  it('deve calcular exatamente o limite de 75%', () => {
    // 15 faltas em 60h é exato 25% de ausência
    expect(calcularFrequencia(60, 15)).toBe(75); 
  });

  // Casos de Erro e Robustez
  it('deve lançar erro se faltas negativas', () => {
    expect(() => calcularFrequencia(60, -5)).toThrow();
  });

  it('deve tratar carga horária zero como 100% de presença (defensivo)', () => {
    expect(calcularFrequencia(0, 0)).toBe(100);
  });

  // Função Auxiliar: Limite de Faltas
  describe('calcularLimiteFaltas', () => {
    it('deve ser 25% da carga horária arredondado para baixo', () => {
      expect(calcularLimiteFaltas(60)).toBe(15);
      expect(calcularLimiteFaltas(45)).toBe(11); // 11.25 -> 11
    });
  });
});