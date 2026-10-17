import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Obtener encuestas base
    const titulados =
      (await (prisma as any).graduateSurvey?.findMany()) ||
      (await (prisma as any).titulado?.findMany()) ||
      [];

    const empleadores =
      (await (prisma as any).employerSurvey?.findMany()) ||
      (await (prisma as any).empleador?.findMany()) ||
      [];

    // 2. Obtener los registros de la tabla independiente CompetenciaTitulado
    const competenciasBD =
      (await (prisma as any).competenciaTitulado?.findMany()) ||
      (await (prisma as any).competencia_titulado?.findMany()) ||
      [];

    const totalTitulados = titulados.length;
    const totalEmpleadores = empleadores.length;

    if (totalTitulados === 0 || competenciasBD.length === 0) {
      return NextResponse.json({
        ok: true,
        totalTitulados,
        totalEmpleadores,
        promedioBrechaGlobal: 0,
        competenciaMayorBrecha: null,
        percepcionEmpleadores: {
          promedioLikertCompetencias: 0,
          habilidadesDemandedas: [],
        },
        competencias: [],
      });
    }

    // 3. Agrupar los datos por nombreCompetencia desde la tabla CompetenciaTitulado
    const mapaCompetencias: Record<
      string,
      {
        nombre: string;
        tipo: "Técnica" | "Transversal";
        sumaAdquirido: number;
        sumaRequerido: number;
        conteo: number;
      }
    > = {};

    for (const c of competenciasBD) {
      const nombre = c.nombreCompetencia;
      if (!nombre) continue;

      if (!mapaCompetencias[nombre]) {
        mapaCompetencias[nombre] = {
          nombre: String(nombre),
          tipo: c.tipo === "Transversal" ? "Transversal" : "Técnica",
          sumaAdquirido: 0,
          sumaRequerido: 0,
          conteo: 0,
        };
      }

      mapaCompetencias[nombre].sumaAdquirido += Number(c.nivelAdquirido) || 0;
      mapaCompetencias[nombre].sumaRequerido += Number(c.nivelRequerido) || 0;
      mapaCompetencias[nombre].conteo += 1;
    }

    // 4. Formatear la lista de competencias con promedios y brechas
    const competencias = Object.values(mapaCompetencias).map((item) => {
      const promedioAdquirido =
        item.conteo > 0 ? item.sumaAdquirido / item.conteo : 0;
      const promedioRequerido =
        item.conteo > 0 ? item.sumaRequerido / item.conteo : 0;
      const brecha = promedioRequerido - promedioAdquirido;

      return {
        nombre: item.nombre,
        tipo: item.tipo,
        promedioAdquirido: Number(promedioAdquirido.toFixed(2)),
        promedioRequerido: Number(promedioRequerido.toFixed(2)),
        brecha: Number(brecha.toFixed(2)),
      };
    });

    // 5. Ordenar para identificar el punto crítico y calcular el promedio global
    competencias.sort((a, b) => b.brecha - a.brecha);

    const competenciaMayorBrecha =
      competencias.length > 0
        ? {
            nombre: competencias[0].nombre,
            brecha: competencias[0].brecha,
          }
        : null;

    const sumaBrechasGlobal = competencias.reduce(
      (acc, curr) => acc + curr.brecha,
      0,
    );
    const promedioBrechaGlobal =
      competencias.length > 0 ? sumaBrechasGlobal / competencias.length : 0;

    // 6. Procesar variables de Empleadores
    let sumaLikertCompetencias = 0;
    const habilidadesDemandedas: string[] = [];

    for (const emp of empleadores) {
      sumaLikertCompetencias += Number(emp.likertCompetencias) || 0;
      if (
        emp.habilidadesRequeridas &&
        String(emp.habilidadesRequeridas).trim() !== ""
      ) {
        habilidadesDemandedas.push(String(emp.habilidadesRequeridas).trim());
      }
    }

    const promedioLikertCompetencias =
      totalEmpleadores > 0 ? sumaLikertCompetencias / totalEmpleadores : 0;

    return NextResponse.json({
      ok: true,
      totalTitulados,
      totalEmpleadores,
      promedioBrechaGlobal: Number(promedioBrechaGlobal.toFixed(2)),
      competenciaMayorBrecha,
      percepcionEmpleadores: {
        promedioLikertCompetencias: Number(
          promedioLikertCompetencias.toFixed(2),
        ),
        habilidadesDemandedas: habilidadesDemandedas.slice(0, 5),
      },
      competencias,
    });
  } catch (error) {
    console.error("Error en API HU1:", error);
    return NextResponse.json(
      { ok: false, error: "Error al calcular el análisis de brechas" },
      { status: 500 },
    );
  }
}
