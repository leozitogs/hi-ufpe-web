// server/utils/calculos.ts

export type AvaliacaoData = {
  peso: number | string;
  notaObtida: number | string | null;
  id?: string;
  nome?: string;
};

// --- 1. CÁLCULOS DE FREQUÊNCIA ---

export function calcularLimiteFaltas(cargaHoraria: number): number {
  if (cargaHoraria <= 0) return 0;
  return Math.floor(cargaHoraria * 0.25);
}

export function calcularFrequencia(cargaHoraria: number, faltas: number): number {
  if (faltas < 0) throw new Error('Número de faltas não pode ser negativo');
  if (cargaHoraria <= 0) return 100; 
  if (faltas >= cargaHoraria) return 0;

  const frequencia = ((cargaHoraria - faltas) / cargaHoraria) * 100;
  return Math.round(frequencia);
}

// --- 2. CÁLCULOS DE NOTAS ---

export function calcularMediaPonderada(avaliacoes: AvaliacaoData[]): number {
  if (!avaliacoes || avaliacoes.length === 0) return 0;

  let somaNotas = 0;
  let somaPesos = 0;

  for (const aval of avaliacoes) {
    const peso = Number(aval.peso);
    const nota = aval.notaObtida !== null ? Number(aval.notaObtida) : null;

    if (isNaN(peso) || peso <= 0) continue;
    
    if (nota !== null && !isNaN(nota)) {
      somaNotas += nota * peso;
      somaPesos += peso;
    }
  }

  if (somaPesos === 0) return 0;
  
  const media = somaNotas / somaPesos;
  return Math.round(media * 100) / 100;
}

// Função de Média Simples
export function calcularMediaSimples(avaliacoes: AvaliacaoData[]): number {
  if (!avaliacoes || avaliacoes.length === 0) return 0;

  let somaNotas = 0;
  let contador = 0;

  for (const aval of avaliacoes) {
    const nota = aval.notaObtida !== null ? Number(aval.notaObtida) : null;
    
    // Ignora notas nulas (não lançadas)
    if (nota !== null && !isNaN(nota)) {
      somaNotas += nota;
      contador++;
    }
  }

  if (contador === 0) return 0;

  const media = somaNotas / contador;
  return Math.round(media * 100) / 100;
}

export function calcularProjecao(
  avaliacoesLancadas: AvaliacaoData[], 
  avaliacoesPendentes: AvaliacaoData[], 
  mediaDesejada: number,
  tipo: 'media_ponderada' | 'media_simples' = 'media_ponderada'
) {
  // Se for média simples, tratamos tudo como peso 1
  const usarPeso1 = tipo === 'media_simples';

  let somaNotasAtuais = 0;
  let somaPesosAtuais = 0;

  for (const aval of avaliacoesLancadas) {
    const p = usarPeso1 ? 1 : Number(aval.peso);
    const n = Number(aval.notaObtida);
    if (!isNaN(p) && !isNaN(n)) {
      somaNotasAtuais += n * p;
      somaPesosAtuais += p;
    }
  }

  let pesoRestante = 0;
  for (const pend of avaliacoesPendentes) {
    const p = usarPeso1 ? 1 : Number(pend.peso);
    if (!isNaN(p)) pesoRestante += p;
  }

  if (pesoRestante === 0) {
    const divisor = somaPesosAtuais || 1;
    return {
      notaNecessaria: 0,
      atingivel: false,
      pesoRestante: 0,
      mediaFinalCalculada: (somaNotasAtuais / divisor).toFixed(2)
    };
  }

  const pesoTotal = somaPesosAtuais + pesoRestante;
  const notaNecessaria = (mediaDesejada * pesoTotal - somaNotasAtuais) / pesoRestante;
  const notaFinal = Math.round(notaNecessaria * 100) / 100;

  return {
    notaNecessaria: notaFinal,
    atingivel: notaFinal <= 10 && notaFinal >= 0,
    pesoRestante
  };
}

export function simularMediaComNota(
  avaliacoesAtuais: AvaliacaoData[],
  identificadorAvaliacao: string,
  notaSimulada: number,
  tipo: 'media_ponderada' | 'media_simples' = 'media_ponderada'
): number {
  const avaliacoesSimuladas = avaliacoesAtuais.map(aval => {
    const ehAlvoPorId = aval.id && aval.id === identificadorAvaliacao;
    const ehAlvoPorNome = aval.nome && aval.nome.toLowerCase() === identificadorAvaliacao.toLowerCase();

    if (ehAlvoPorId || ehAlvoPorNome) {
      return { ...aval, notaObtida: notaSimulada };
    }
    return aval;
  });

  if (tipo === 'media_simples') {
    return calcularMediaSimples(avaliacoesSimuladas);
  }
  return calcularMediaPonderada(avaliacoesSimuladas);
}

// --- 3. STATUS DO ALUNO ---

export function determinarStatus(
  media: number, 
  frequencia: number, 
  mediaMinima = 5.0, 
  frequenciaMinima = 75,
  todasAvaliacoesLancadas = false
): 'aprovado' | 'reprovado' | 'cursando' {
  
  const mediaOk = media >= mediaMinima;
  const freqOk = frequencia >= frequenciaMinima;

  if (todasAvaliacoesLancadas) {
    if (mediaOk && freqOk) return 'aprovado';
    return 'reprovado';
  } else {
    return 'cursando';
  }
}