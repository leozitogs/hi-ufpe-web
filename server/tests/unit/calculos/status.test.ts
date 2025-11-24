import { describe, it, expect } from 'vitest';
import { determinarStatus } from '../../../utils/calculos';

describe('Unidade: Status do Aluno (Tabela de Decisão)', () => {
  // Legenda: Media | Freq | TodasLancadas -> Resultado
  
  it('T T T -> Aprovado', () => {
    expect(determinarStatus(7.0, 80, 5.0, 75, true)).toBe('aprovado');
  });

  it('T T F -> Cursando', () => {
    expect(determinarStatus(7.0, 80, 5.0, 75, false)).toBe('cursando');
  });

  it('T F T -> Reprovado (Frequência)', () => {
    expect(determinarStatus(7.0, 70, 5.0, 75, true)).toBe('reprovado');
  });

  it('F T T -> Reprovado (Nota)', () => {
    expect(determinarStatus(4.0, 80, 5.0, 75, true)).toBe('reprovado');
  });

  it('F F F -> Cursando (Tudo ruim mas não acabou)', () => {
    expect(determinarStatus(4.0, 70, 5.0, 75, false)).toBe('cursando');
  });
  
  // Valor limite
  it('deve aprovar exatamente na média e frequência mínimas', () => {
    expect(determinarStatus(5.0, 75, 5.0, 75, true)).toBe('aprovado');
  });
});