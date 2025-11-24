import { describe, it, expect } from 'vitest';
// Adicione calcularMediaSimples na importação
import { calcularMediaPonderada, calcularMediaSimples, calcularProjecao } from '../../../utils/calculos';

describe('Unidade: Cálculos de Notas', () => {
  // ... (Testes de Média Ponderada existentes mantêm-se iguais) ...

  // NOVO BLOCO DE TESTE
  describe('Média Simples', () => {
    it('deve calcular a média aritmética simples corretamente', () => {
      // (8 + 6 + 10) / 3 = 24 / 3 = 8.0
      const notas = [
        { peso: 10, notaObtida: 8.0 }, // Peso deve ser ignorado
        { peso: 1, notaObtida: 6.0 },
        { peso: 1, notaObtida: 10.0 }
      ];
      expect(calcularMediaSimples(notas)).toBe(8.0);
    });

    it('deve ignorar notas nulas (não contar no divisor)', () => {
      // (8 + 10) / 2 = 9.0 (ignora o null)
      const notas = [
        { notaObtida: 8.0, peso: 1 },
        { notaObtida: null, peso: 1 },
        { notaObtida: 10.0, peso: 1 }
      ];
      expect(calcularMediaSimples(notas)).toBe(9.0);
    });
  });

  describe('Projeção de Nota', () => {
    // ... (Testes de Projeção Ponderada existentes) ...

    // NOVO CENÁRIO: Projeção com Média Simples
    it('deve calcular projeção para média simples (pesos ignorados)', () => {
      // Cenário: 3 Provas no total.
      // Fez 1 prova: Nota 4.0.
      // Faltam 2 provas.
      // Quer média 6.0.
      // Cálculo: (SomaAtual + X*Restantes) / Total = 6
      // (4 + 2X) / 3 = 6  => 4 + 2X = 18 => 2X = 14 => X = 7
      
      const atuais = [{ peso: 100, notaObtida: 4.0 }]; // Peso absurdo para provar que é ignorado
      const pendentes = [
        { peso: 1, notaObtida: null },
        { peso: 1, notaObtida: null }
      ];

      const res = calcularProjecao(atuais, pendentes, 6.0, 'media_simples');
      
      expect(res.notaNecessaria).toBe(7.0);
      expect(res.atingivel).toBe(true);
    });
  });
});