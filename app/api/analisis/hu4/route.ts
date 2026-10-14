import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { media, desviacionEstandar } from "@/lib/analisis/estadisticas";

export async function GET() {
  try {
    const competencias = await prisma.competenciaTitulado.findMany();

    if (competencias.length === 0) {
      return NextResponse.json({
        ok: true,
        totalRegistros: 0,
        competencias: [],
        resumen: {
          brechaPromedio: 0,
          competenciaMayorBrecha: null,
          competenciaMenorBrecha: null,
        },
      });
    }

    // Agrupar por nombre de competencia
    const agrupadas: Record<
      string,
      {
        tipo: string;
        adquirido: number[];
        requerido: number[];
        brecha: number[];
      }
    > = {};

    for (const c of competencias) {
      if (!agrupadas[c.nombreCompetencia]) {
        agrupadas[c.nombreCompetencia] = {
          tipo: c.tipo,
          adquirido: [],
          requerido: [],
          brecha: [],
        };
      }
      agrupadas[c.nombreCompetencia].adquirido.push(c.nivelAdquirido);
      agrupadas[c.nombreCompetencia].requerido.push(c.nivelRequerido);
      agrupadas[c.nombreCompetencia].brecha.push(c.brecha);
    }

    // Calcular medias y desviaciones por competencia
    const resultado = Object.entries(agrupadas).map(([nombre, datos]) => ({
      nombre,
      tipo: datos.tipo,
      mediaAdquirido: Number(media(datos.adquirido).toFixed(2)),
      mediaRequerido: Number(media(datos.requerido).toFixed(2)),
      desviacionAdquirido: Number(
        desviacionEstandar(datos.adquirido).toFixed(2),
      ),
      desviacionRequerido: Number(
        desviacionEstandar(datos.requerido).toFixed(2),
      ),
      brechaPromedio: Number(media(datos.brecha).toFixed(2)),
      muestras: datos.adquirido.length,
    }));

    // Ordenar por brecha descendente
    resultado.sort((a, b) => b.brechaPromedio - a.brechaPromedio);

    // Resumen
    const brechaPromedio =
      resultado.reduce((acc, c) => acc + c.brechaPromedio, 0) /
      resultado.length;

    const mayorBrecha = resultado[0];
    const menorBrecha = resultado[resultado.length - 1];

    return NextResponse.json({
      ok: true,
      totalRegistros: competencias.length,
      competencias: resultado,
      resumen: {
        brechaPromedio: Number(brechaPromedio.toFixed(2)),
        competenciaMayorBrecha: mayorBrecha
          ? {
              nombre: mayorBrecha.nombre,
              brecha: mayorBrecha.brechaPromedio,
            }
          : null,
        competenciaMenorBrecha: menorBrecha
          ? {
              nombre: menorBrecha.nombre,
              brecha: menorBrecha.brechaPromedio,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error en HU4:", error);
    return NextResponse.json(
      { ok: false, error: "Error al calcular estadísticas" },
      { status: 500 },
    );
  }
}