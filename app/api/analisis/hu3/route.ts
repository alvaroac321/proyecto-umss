import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Función auxiliar para calcular la prueba Chi-Cuadrada (Chi-Square Test)
function calcularChiCuadrada(
  observados: Record<string, Record<string, number>>,
) {
  const filas = Object.keys(observados);
  if (filas.length === 0)
    return { chiCuadrada: 0, gradosLibertad: 0, esSignificativo: false };

  // Obtener todas las columnas únicas
  const columnasSet = new Set<string>();
  filas.forEach((f) => {
    Object.keys(observados[f]).forEach((c) => columnasSet.add(c));
  });
  const columnas = Array.from(columnasSet);

  if (columnas.length === 0)
    return { chiCuadrada: 0, gradosLibertad: 0, esSignificativo: false };

  // Totales por fila y columna
  const totalesFila: Record<string, number> = {};
  const totalesColumna: Record<string, number> = {};
  let grandTotal = 0;

  filas.forEach((f) => {
    totalesFila[f] = 0;
    columnas.forEach((c) => {
      const val = observados[f][c] || 0;
      totalesFila[f] += val;
      totalesColumna[c] = (totalesColumna[c] || 0) + val;
      grandTotal += val;
    });
  });

  if (grandTotal === 0)
    return { chiCuadrada: 0, gradosLibertad: 0, esSignificativo: false };

  // Calcular estadístico Chi-Cuadrada
  let chiCuadrada = 0;
  filas.forEach((f) => {
    columnas.forEach((c) => {
      const obs = observados[f][c] || 0;
      const esperada = (totalesFila[f] * totalesColumna[c]) / grandTotal;
      if (esperada > 0) {
        chiCuadrada += Math.pow(obs - esperada, 2) / esperada;
      }
    });
  });

  const gradosLibertad = (filas.length - 1) * (columnas.length - 1);
  // Criterio de significancia aproximado para alpha = 0.05
  const esSignificativo = chiCuadrada > 3.841;

  return {
    chiCuadrada: Number(chiCuadrada.toFixed(2)),
    gradosLibertad: Math.max(0, gradosLibertad),
    esSignificativo,
  };
}

export async function GET() {
  try {
    const titulados =
      (await (prisma as any).graduateSurvey?.findMany()) ||
      (await (prisma as any).titulado?.findMany()) ||
      [];

    const empleadores =
      (await (prisma as any).employerSurvey?.findMany()) ||
      (await (prisma as any).empleador?.findMany()) ||
      [];

    const totalTitulados = titulados.length;
    const totalEmpleadores = empleadores.length;

    // 1. Demanda de Niveles de Posgrado (Titulados)
    const nivelPosgradoMap: Record<string, number> = {};
    const fuenteFinanciamientoMap: Record<string, number> = {};

    // Tabla Contingencia: areaInteresPosgrado vs fuenteFinanciamiento
    const tablaContingencia: Record<string, Record<string, number>> = {};

    for (const t of titulados) {
      const nivel = t.nivelPosgrado || "Ninguno / Sin preferencia";
      nivelPosgradoMap[nivel] = (nivelPosgradoMap[nivel] || 0) + 1;

      const fuente = t.fuenteFinanciamiento || "No especificado";
      fuenteFinanciamientoMap[fuente] =
        (fuenteFinanciamientoMap[fuente] || 0) + 1;

      const area = t.areaInteresPosgrado || "Otras Áreas";
      if (!tablaContingencia[area]) {
        tablaContingencia[area] = {};
      }
      tablaContingencia[area][fuente] =
        (tablaContingencia[area][fuente] || 0) + 1;
    }

    // 2. Demanda del Sector Empleador
    const nivelFormacionDemandaMap: Record<string, number> = {};
    const areasEmergentesList: string[] = [];

    for (const e of empleadores) {
      const nivel = e.nivelFormacionDemanda || "Grado Universitario";
      nivelFormacionDemandaMap[nivel] =
        (nivelFormacionDemandaMap[nivel] || 0) + 1;

      if (e.areasEmergentes && String(e.areasEmergentes).trim() !== "") {
        areasEmergentesList.push(String(e.areasEmergentes).trim());
      }
    }

    // 3. Resultado prueba Chi-Cuadrada
    const resultadoChi = calcularChiCuadrada(tablaContingencia);

    return NextResponse.json({
      ok: true,
      totalTitulados,
      totalEmpleadores,
      nivelPosgradoMap,
      fuenteFinanciamientoMap,
      tablaContingencia,
      nivelFormacionDemandaMap,
      areasEmergentesList: areasEmergentesList.slice(0, 5),
      estadisticaChi: resultadoChi,
    });
  } catch (error) {
    console.error("Error en API HU3:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Error al procesar la demanda de formación continua",
      },
      { status: 500 },
    );
  }
}
