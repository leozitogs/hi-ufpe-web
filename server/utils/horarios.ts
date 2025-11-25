// server/utils/horarios.ts

export type HorarioInput = {
  diaSemana: string | number; // Aceita "Segunda-feira" ou 1
  horaInicio: string;         // "08:00" ou "14:30"
  disciplina: string;
  sala?: string;
  [key: string]: any; 
};

const DIAS_PARA_NUMERO: Record<string, number> = {
  "Domingo": 0,
  "Segunda-feira": 1,
  "Terça-feira": 2,
  "Quarta-feira": 3,
  "Quinta-feira": 4,
  "Sexta-feira": 5,
  "Sábado": 6
};

/**
 * Converte "08:30" para 8.5 para facilitar comparação matemática
 */
export function horaParaDecimal(hora: string): number {
  if (!hora) return 0;
  const [h, m] = hora.split(':').map(Number);
  if (isNaN(m)) return parseFloat(hora); 
  return h + (m / 60);
}

export function normalizarDia(dia: string | number): number {
  if (typeof dia === 'number') return dia;
  return DIAS_PARA_NUMERO[dia] ?? -1;
}

/**
 * Lógica Pura: Encontra a próxima aula baseada em uma data de referência
 */
export function encontrarProximaAula(
  listaHorarios: HorarioInput[], 
  dataReferencia: Date = new Date()
): HorarioInput | null {
  
  if (!listaHorarios || listaHorarios.length === 0) return null;

  const diaHoje = dataReferencia.getDay();
  const horaAtualDecimal = dataReferencia.getHours() + (dataReferencia.getMinutes() / 60);

  // 1. Tenta encontrar aula HOJE que comece depois de agora
  const aulasHoje = listaHorarios
    .filter(h => normalizarDia(h.diaSemana) === diaHoje)
    .map(h => ({ ...h, horaDecimal: horaParaDecimal(h.horaInicio) }))
    .filter(h => h.horaDecimal > horaAtualDecimal)
    .sort((a, b) => a.horaDecimal - b.horaDecimal);

  if (aulasHoje.length > 0) {
    return aulasHoje[0];
  }

  // 2. Se não tem hoje, procura nos próximos dias (Loop de 7 dias)
  for (let i = 1; i <= 7; i++) {
    const proximoDia = (diaHoje + i) % 7;
    
    const aulasDoDia = listaHorarios
      .filter(h => normalizarDia(h.diaSemana) === proximoDia)
      .map(h => ({ ...h, horaDecimal: horaParaDecimal(h.horaInicio) }))
      .sort((a, b) => a.horaDecimal - b.horaDecimal);

    if (aulasDoDia.length > 0) {
      return aulasDoDia[0];
    }
  }

  return null;
}