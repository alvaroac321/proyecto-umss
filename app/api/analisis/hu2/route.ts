import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  frecuencias,
  frecuenciasRelativas,
} from "@/lib/analisis/estadisticas";

export async function GET() {
  try {
    const titulados = await prisma.graduateSurvey.findMany();

    // Nivel de posgrado alcanzado (solo quienes tienen formación complementaria)
    const conFormacion = titulados.filter((t) => t.formacionComplementaria);
    const nivelesPosgrado = conFormacion
      .map((t) => t.nivelPosgrado)
      .filter((n): n is string => !!n);

    // Áreas de interés (solo quienes están interesados)
    const interesados = titulados.filter((t) => t.interesPosgrado);
    const areasInteres = interesados
      .map((t) => t.areaInteresPosgrado)
      .filter((a): a is string => !!a);

    // Frecuencias de nivel de posgrado
    const freqNivel = frecuencias(nivelesPosgrado);
    const freqNivelRel = frecuenciasRelativas(nivelesPosgrado);

    // Frecuencias de áreas de interés
    const freqAreas = frecuencias(areasInteres);
    const freqAreasRel = frecuenciasRelativas(areasInteres);

    // Detección de concentración crítica (> 70%)
    const areasConcentradas = Object.entries(freqAreasRel)
      .filter(([_, porcentaje]) => porcentaje > 70)
      .map(([area, porcentaje]) => ({
        area,
        porcentaje: Number(porcentaje.toFixed(2)),
      }));

    // Top 2 áreas combinadas
    const areasOrdenadas = Object.entries(freqAreasRel)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);
    const concentracionTop2 = areasOrdenadas.reduce(
      (acc, [_, p]) => acc + p,
      0,
    );

    return NextResponse.json({
      ok: true,
      totales: {
        totalTitulados: titulados.length,
        conFormacionComplementaria: conFormacion.length,
        interesadosEnPosgrado: interesados.length,
      },
      nivelPosgrado: {
        absolutas: freqNivel,
        relativas: Object.fromEntries(
          Object.entries(freqNivelRel).map(([k, v]) => [
            k,
            Number(v.toFixed(2)),
          ]),
        ),
      },
      areasInteres: {
        absolutas: freqAreas,
        relativas: Object.fromEntries(
          Object.entries(freqAreasRel).map(([k, v]) => [
            k,
            Number(v.toFixed(2)),
          ]),
        ),
      },
      alertas: {
        areasConcentradas,
        concentracionTop2: Number(concentracionTop2.toFixed(2)),
        top2: areasOrdenadas.map(([area, p]) => ({
          area,
          porcentaje: Number(p.toFixed(2)),
        })),
      },
    });
  } catch (error) {
    console.error("Error en HU2:", error);
    return NextResponse.json(
      { ok: false, error: "Error al calcular estadísticas" },
      { status: 500 },
    );
  }
}