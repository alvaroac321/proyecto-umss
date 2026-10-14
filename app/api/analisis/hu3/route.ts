import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  tablaContingencia,
  chiCuadrado,
  frecuencias,
  frecuenciasRelativas,
} from "@/lib/analisis/estadisticas";

export async function GET() {
  try {
    const titulados = await prisma.graduateSurvey.findMany();

    // Filtrar los que tienen fuente de financiamiento registrada
    const conFinanciamiento = titulados.filter(
      (t) => t.fuenteFinanciamiento && t.nivelPosgrado,
    );

    if (conFinanciamiento.length === 0) {
      return NextResponse.json({
        ok: true,
        totales: {
          totalTitulados: titulados.length,
          conFinanciamiento: 0,
        },
        financiamiento: { absolutas: {}, relativas: {} },
        tabla: null,
        chiCuadrado: null,
        interpretacion: "No hay datos suficientes para el análisis.",
      });
    }

    // Frecuencias de fuente de financiamiento
    const fuentes = conFinanciamiento
      .map((t) => t.fuenteFinanciamiento)
      .filter((f): f is string => !!f);
    const freqFuentes = frecuencias(fuentes);
    const freqFuentesRel = frecuenciasRelativas(fuentes);

    // Tabla de contingencia: Financiamiento × Nivel de posgrado
    const variableA = conFinanciamiento.map((t) => t.fuenteFinanciamiento!);
    const variableB = conFinanciamiento.map((t) => t.nivelPosgrado!);

    const tabla = tablaContingencia(variableA, variableB);

    // Prueba Chi-cuadrado (solo si hay al menos 2 filas y 2 columnas)
    let pruebaChi = null;
    if (tabla.filas.length >= 2 && tabla.columnas.length >= 2) {
      const resultado = chiCuadrado(tabla.matriz);

      // Interpretación según el p-valor
      let conclusion: string;
      if (resultado.pValor < 0.05) {
        conclusion =
          "Existe dependencia significativa entre la fuente de financiamiento y el nivel de posgrado (p < 0.05).";
      } else {
        conclusion =
          "No se encontró evidencia suficiente de dependencia entre la fuente de financiamiento y el nivel de posgrado (p ≥ 0.05).";
      }

      pruebaChi = {
        chi2: resultado.chi2,
        gl: resultado.gl,
        pValor: Number(resultado.pValor.toFixed(4)),
        significativo: resultado.pValor < 0.05,
        conclusion,
      };
    }

    return NextResponse.json({
      ok: true,
      totales: {
        totalTitulados: titulados.length,
        conFinanciamiento: conFinanciamiento.length,
      },
      financiamiento: {
        absolutas: freqFuentes,
        relativas: Object.fromEntries(
          Object.entries(freqFuentesRel).map(([k, v]) => [
            k,
            Number(v.toFixed(2)),
          ]),
        ),
      },
      tabla,
      chiCuadrado: pruebaChi,
    });
  } catch (error) {
    console.error("Error en HU3:", error);
    return NextResponse.json(
      { ok: false, error: "Error al calcular estadísticas" },
      { status: 500 },
    );
  }
}