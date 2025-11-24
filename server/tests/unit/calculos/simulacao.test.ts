import { describe, it, expect } from 'vitest';
import { simularMediaComNota, type AvaliacaoData } from '../../../utils/calculos';

/**
 * RELATÓRIO DE ESTRATÉGIAS DE TESTE (Conforme padrão Equipe 6)
 * * 1. Teste Baseado em Requisitos:
 * - Validar a funcionalidade principal: "O sistema deve permitir que o aluno 
 * veja como sua média ficaria se tirasse nota X em uma prova futura."
 * * 2. Partição de Equivalência:
 * - Classe 1: Simulação por Nome (Case-insensitive) - Ex: "Prova 2" == "prova 2".
 * - Classe 2: Simulação por ID - Identificação exata.
 * - Classe 3: Simulação de nota pendente (null -> nota).
 * - Classe 4: Re-simulação de nota existente (nota antiga -> nova nota).
 * * 3. Análise de Valores-Limite:
 * - Nota simulada mínima (0.0).
 * - Nota simulada máxima (10.0).
 * - Lista com apenas 1 avaliação.
 */

describe('Unidade: Simulação de Nota (Lógica Pura)', () => {

  describe('Partição: Identificação da Avaliação', () => {
    it('deve simular nota buscando pelo NOME (case-insensitive)', () => {
      // Cenário: Aluno tem 8.0 na Prova 1 (Peso 1). Vai simular 6.0 na Prova 2 (Peso 1).
      // Média esperada: (8 + 6) / 2 = 7.0
      const avaliacoes: AvaliacaoData[] = [
        { nome: 'Prova 1', peso: 1, notaObtida: 8.0 },
        { nome: 'Prova 2', peso: 1, notaObtida: null } // Alvo
      ];

      const media = simularMediaComNota(avaliacoes, 'prova 2', 6.0);
      expect(media).toBe(7.0);
    });

    it('deve simular nota buscando pelo ID', () => {
      // Cenário: Usando ID único para garantir que altera a prova certa
      const avaliacoes: AvaliacaoData[] = [
        { id: 'a1', nome: 'Prova A', peso: 2, notaObtida: 5.0 },
        { id: 'a2', nome: 'Prova B', peso: 3, notaObtida: null } // Alvo
      ];

      // Simula tirar 10 na prova de peso 3.
      // (5*2 + 10*3) / 5 = (10 + 30) / 5 = 40 / 5 = 8.0
      const media = simularMediaComNota(avaliacoes, 'a2', 10.0);
      expect(media).toBe(8.0);
    });
  });

  describe('Partição: Estado da Avaliação', () => {
    it('deve simular preenchimento de nota pendente (null -> valor)', () => {
      const avaliacoes: AvaliacaoData[] = [
        { nome: 'P1', peso: 5, notaObtida: 6.0 },
        { nome: 'P2', peso: 5, notaObtida: null }
      ];

      // Se tirar 8 na P2 -> (6*5 + 8*5)/10 = 7.0
      expect(simularMediaComNota(avaliacoes, 'P2', 8.0)).toBe(7.0);
    });

    it('deve permitir substituir uma nota já existente (valor -> novo valor)', () => {
      // Cenário: "E se eu tivesse tirado 10 em vez de 5 na P1?"
      const avaliacoes: AvaliacaoData[] = [
        { nome: 'P1', peso: 1, notaObtida: 5.0 }, // Alvo
        { nome: 'P2', peso: 1, notaObtida: 6.0 }
      ];

      // Original: 5.5. Simulada (10 e 6): 8.0
      expect(simularMediaComNota(avaliacoes, 'P1', 10.0)).toBe(8.0);
    });
  });

  describe('Análise de Valores-Limite', () => {
    it('deve calcular corretamente simulando nota 0 (Mínimo)', () => {
      const avaliacoes: AvaliacaoData[] = [
        { nome: 'P1', peso: 1, notaObtida: 10.0 },
        { nome: 'P2', peso: 1, notaObtida: null }
      ];
      // (10 + 0) / 2 = 5.0
      expect(simularMediaComNota(avaliacoes, 'P2', 0)).toBe(5.0);
    });

    it('deve calcular corretamente simulando nota 10 (Máximo)', () => {
      const avaliacoes: AvaliacaoData[] = [
        { nome: 'P1', peso: 9, notaObtida: 5.0 }, // 45 pts
        { nome: 'P2', peso: 1, notaObtida: null } // Simula 10 -> 10 pts
      ];
      // (45 + 10) / 10 = 5.5
      expect(simularMediaComNota(avaliacoes, 'P2', 10)).toBe(5.5);
    });
  });

  describe('Casos de Borda e Robustez', () => {
    it('não deve alterar a média se a avaliação não for encontrada', () => {
      // Se passar um nome errado, ele deve calcular a média do que já existe
      const avaliacoes: AvaliacaoData[] = [
        { nome: 'P1', peso: 1, notaObtida: 8.0 },
        { nome: 'P2', peso: 1, notaObtida: null }
      ];

      // Tenta simular 'P3' (não existe). Média deve ser apenas P1 (8.0)
      const media = simularMediaComNota(avaliacoes, 'Prova Inexistente', 10);
      expect(media).toBe(8.0);
    });
  });
});