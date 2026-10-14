import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { media, mediana, desviacionEstandar } from "@/lib/analisis/estadisticas";

export async function GET() {
  try {
    const titulados = await prisma.graduateSurvey.findMany();

    const anios = titulados.map((t) => t.aniosVidaProfesional);

    const estadisticas = {
      total: anios.length,
      media: Number(media(anios).toFixed(2)),
      mediana: Number(mediana(anios).toFixed(2)),
      desviacion: Number(desviacionEstandar(anios).toFixed(2)),
      minimo: anios.length ? Math.min(...anios) : 0,
      maximo: anios.length ? Math.max(...anios) : 0,
    };

    // Segmentación junior vs consolidado
    const junior = titulados.filter((t) => t.aniosVidaProfesional < 5).length;
    const consolidado = titulados.filter(
      (t) => t.aniosVidaProfesional >= 5,
    ).length;

    // Distribución por situación laboral
    const porSituacion: Record<string, number> = {};
    for (const t of titulados) {
      porSituacion[t.situacionLaboral] =
        (porSituacion[t.situacionLaboral] || 0) + 1;
    }

    // Distribución por años (para histograma)
    const porAnios: Record<string, number> = {};
    for (const a of anios) {
      const rango =
        a < 2 ? "0-1" : a < 5 ? "2-4" : a < 10 ? "5-9" : "10+";
      porAnios[rango] = (porAnios[rango] || 0) + 1;
    }

    return NextResponse.json({
      ok: true,
      estadisticas,
      segmentacion: { junior, consolidado },
      porSituacion,
      porAnios,
    });
  } catch (error) {
    console.error("Error en HU1:", error);
    return NextResponse.json(
      { ok: false, error: "Error al calcular estadísticas" },
      { status: 500 },
    );
  }
}