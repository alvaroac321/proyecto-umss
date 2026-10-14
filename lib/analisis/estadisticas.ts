// Media aritmética
export function media(valores: number[]): number {
  if (valores.length === 0) return 0;
  const suma = valores.reduce((a, b) => a + b, 0);
  return suma / valores.length;
}

// Mediana
export function mediana(valores: number[]): number {
  if (valores.length === 0) return 0;
  const ordenados = [...valores].sort((a, b) => a - b);
  const mitad = Math.floor(ordenados.length / 2);
  if (ordenados.length % 2 === 0) {
    return (ordenados[mitad - 1] + ordenados[mitad]) / 2;
  }
  return ordenados[mitad];
}

// Desviación estándar (poblacional)
export function desviacionEstandar(valores: number[]): number {
  if (valores.length === 0) return 0;
  const m = media(valores);
  const sumaCuadrados = valores.reduce((acc, v) => acc + Math.pow(v - m, 2), 0);
  return Math.sqrt(sumaCuadrados / valores.length);
}

// Frecuencias absolutas
export function frecuencias(valores: string[]): Record<string, number> {
  const resultado: Record<string, number> = {};
  for (const v of valores) {
    resultado[v] = (resultado[v] || 0) + 1;
  }
  return resultado;
}

// Frecuencias relativas (porcentajes)
export function frecuenciasRelativas(
  valores: string[],
): Record<string, number> {
  const abs = frecuencias(valores);
  const total = valores.length;
  const resultado: Record<string, number> = {};
  for (const [k, v] of Object.entries(abs)) {
    resultado[k] = total > 0 ? (v / total) * 100 : 0;
  }
  return resultado;
}

// Tabla de contingencia (cruce de dos variables)
export function tablaContingencia(
  variableA: string[],
  variableB: string[],
): {
  filas: string[];
  columnas: string[];
  matriz: number[][];
  totalesFila: number[];
  totalesColumna: number[];
  total: number;
} {
  const filas = Array.from(new Set(variableA)).sort();
  const columnas = Array.from(new Set(variableB)).sort();

  const matriz: number[][] = filas.map(() => columnas.map(() => 0));

  for (let i = 0; i < variableA.length; i++) {
    const f = filas.indexOf(variableA[i]);
    const c = columnas.indexOf(variableB[i]);
    if (f >= 0 && c >= 0) {
      matriz[f][c]++;
    }
  }

  const totalesFila = matriz.map((fila) => fila.reduce((a, b) => a + b, 0));
  const totalesColumna = columnas.map((_, c) =>
    matriz.reduce((acc, fila) => acc + fila[c], 0),
  );
  const total = totalesFila.reduce((a, b) => a + b, 0);

  return { filas, columnas, matriz, totalesFila, totalesColumna, total };
}

// Chi-cuadrado
export function chiCuadrado(matriz: number[][]): {
  chi2: number;
  gl: number;
  pValor: number;
} {
  const filas = matriz.length;
  const columnas = matriz[0]?.length || 0;

  const totalesFila = matriz.map((f) => f.reduce((a, b) => a + b, 0));
  const totalesColumna = Array.from({ length: columnas }, (_, c) =>
    matriz.reduce((acc, fila) => acc + fila[c], 0),
  );
  const total = totalesFila.reduce((a, b) => a + b, 0);

  let chi2 = 0;
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      const observado = matriz[i][j];
      const esperado = (totalesFila[i] * totalesColumna[j]) / total;
      if (esperado > 0) {
        chi2 += Math.pow(observado - esperado, 2) / esperado;
      }
    }
  }

  const gl = (filas - 1) * (columnas - 1);
  const pValor = pValorChi2(chi2, gl);

  return { chi2: Number(chi2.toFixed(4)), gl, pValor };
}

// Aproximación al p-valor de Chi-cuadrado
// (usamos una aproximación simple con la función gamma incompleta)
function pValorChi2(chi2: number, gl: number): number {
  // Aproximación usando la función de distribución de Wilson-Hilferty
  if (gl <= 0) return 1;
  const z = Math.pow(chi2 / gl, 1 / 3) - (1 - 2 / (9 * gl));
  const denominador = Math.sqrt(2 / (9 * gl));
  const zNorm = z / denominador;
  return 1 - normalCDF(zNorm);
}

// Función de distribución acumulada normal
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}