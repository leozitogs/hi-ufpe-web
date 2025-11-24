// server/tests/unit/calculos/horarios.test.ts
import { describe, it, expect } from 'vitest';
import { encontrarProximaAula, horaParaDecimal, type HorarioInput } from '../../../utils/horarios';

describe('Unidade: Lógica de Horários', () => {
  
  // Mock de um horário semanal comum
  const gradeHoraria: HorarioInput[] = [
    { disciplina: 'Segunda Manhã', diaSemana: 'Segunda-feira', horaInicio: '08:00' },
    { disciplina: 'Segunda Tarde', diaSemana: 'Segunda-feira', horaInicio: '14:00' },
    { disciplina: 'Quarta Manhã', diaSemana: 'Quarta-feira', horaInicio: '10:00' },
    { disciplina: 'Sexta Noite', diaSemana: 'Sexta-feira', horaInicio: '18:30' },
  ];

  describe('horaParaDecimal', () => {
    it('deve converter horas corretamente', () => {
      expect(horaParaDecimal('08:00')).toBe(8);
      expect(horaParaDecimal('08:30')).toBe(8.5);
      expect(horaParaDecimal('18:45')).toBe(18.75);
    });
  });

  describe('encontrarProximaAula', () => {
    it('deve encontrar aula no mesmo dia se for mais tarde', () => {
      // Simulando: Segunda-feira às 07:00
      const dataSimulada = new Date('2025-03-10T07:00:00'); // 10/03/2025 é Segunda
      
      const proxima = encontrarProximaAula(gradeHoraria, dataSimulada);
      expect(proxima?.disciplina).toBe('Segunda Manhã');
    });

    it('deve pular aula que já passou hoje e pegar a próxima', () => {
      // Simulando: Segunda-feira às 09:00 (Manhã já passou, deve pegar Tarde)
      const dataSimulada = new Date('2025-03-10T09:00:00'); 
      
      const proxima = encontrarProximaAula(gradeHoraria, dataSimulada);
      expect(proxima?.disciplina).toBe('Segunda Tarde');
    });

    it('deve encontrar aula amanhã (ou depois) se hoje acabou', () => {
      // Simulando: Segunda-feira às 20:00 (Acabou tudo hoje)
      // Próxima deve ser Quarta-feira
      const dataSimulada = new Date('2025-03-10T20:00:00');
      
      const proxima = encontrarProximaAula(gradeHoraria, dataSimulada);
      expect(proxima?.disciplina).toBe('Quarta Manhã');
    });

    it('deve fazer o loop da semana (Domingo -> Segunda)', () => {
      // Simulando: Domingo
      const dataSimulada = new Date('2025-03-09T12:00:00'); // 09/03 é Domingo
      
      const proxima = encontrarProximaAula(gradeHoraria, dataSimulada);
      expect(proxima?.disciplina).toBe('Segunda Manhã');
    });

    it('deve funcionar com dia numérico (0-6) se o banco retornar int', () => {
      const gradeNumerica = [
        { disciplina: 'Terça', diaSemana: 2, horaInicio: '10:00' }
      ];
      // Segunda-feira
      const dataSimulada = new Date('2025-03-10T10:00:00'); 
      
      const proxima = encontrarProximaAula(gradeNumerica, dataSimulada);
      expect(proxima?.disciplina).toBe('Terça');
    });
  });
});