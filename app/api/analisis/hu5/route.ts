import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tablaContingencia } from "@/lib/analisis/estadisticas";

export async function GET() {
  try {
    const titulados = await prisma.graduateSurvey.findMany();
    const empleadores = await prisma.employerSurvey.findMany();

    // ============ CRUCE 1: Área de interés × Fuente de financiamiento ============
    const conInteres = titulados.filter(
      (t) => t.areaInteresPosgrado && t.fuenteFinanciamiento,
    );

    let cruceAreaFinanciamiento = null;
    if (conInteres.length > 0) {
      const tabla = tablaContingencia(
        conInteres.map((t) => t.areaInteresPosgrado!),
        conInteres.map((t) => t.fuenteFinanciamiento!),
      );
      cruceAreaFinanciamiento = tabla;
    }

    // ============ CRUCE 2: Situación laboral × Sector (empleadores) ============
    let cruceSituacionSector = null;
    if (titulados.length > 0 && empleadores.length > 0) {
      // Agrupamos por situación laboral y contamos
      const situaciones = Array.from(
        new Set(titulados.map((t) => t.situacionLaboral)),
      );
      const sectores = Array.from(
        new Set(empleadores.map((e) => e.rubroSector)),
      );

      const matriz: number[][] = situaciones.map(() =>
        sectores.map(() => 0),
      );

      // Como no hay relación directa, mostramos la distribución de titulados por situación
      // y la distribución de empleadores por sector
      const distribucionTitulados = situaciones.map((s) =>
        titulados.filter((t) => t.situacionLaboral === s).length,
      );
      const distribucionEmpleadores = sectores.map((s) =>
        empleadores.filter((e) => e.rubroSector === s).length,
      );

      cruceSituacionSector = {
        situaciones,
        sectores,
        distribucionTitulados,
        distribucionEmpleadores,
      };
    }

    // ============ Distribuciones generales ============
    const distribucionGenero: Record<string, number> = {};
    const distribucionEdad: Record<string, number> = {};
    const distribucionSituacion: Record<string, number> = {};
    const distribucionSectorEmpleador: Record<string, number> = {};
    const distribucionTipoOrg: Record<string, number> = {};

    for (const t of titulados) {
      distribucionGenero[t.genero] = (distribucionGenero[t.genero] || 0) + 1;
      distribucionEdad[t.edad] = (distribucionEdad[t.edad] || 0) + 1;
      distribucionSituacion[t.situacionLaboral] =
        (distribucionSituacion[t.situacionLaboral] || 0) + 1;
    }

    for (const e of empleadores) {
      distribucionSectorEmpleador[e.rubroSector] =
        (distribucionSectorEmpleador[e.rubroSector] || 0) + 1;
      distribucionTipoOrg[e.tipoOrganizacion] =
        (distribucionTipoOrg[e.tipoOrganizacion] || 0) + 1;
    }

    // ============ Datos de competencias para radar ============
    const competencias = await prisma.competenciaTitulado.findMany();
    const agrupadas: Record<
      string,
      { adquirido: number[]; requerido: number[] }
    > = {};

    for (const c of competencias) {
      if (!agrupadas[c.nombreCompetencia]) {
        agrupadas[c.nombreCompetencia] = { adquirido: [], requerido: [] };
      }
      agrupadas[c.nombreCompetencia].adquirido.push(c.nivelAdquirido);
      agrupadas[c.nombreCompetencia].requerido.push(c.nivelRequerido);
    }

    const radarCompetencias = Object.entries(agrupadas).map(
      ([nombre, datos]) => ({
        competencia:
          nombre.length > 18 ? nombre.slice(0, 18) + "..." : nombre,
        adquirido:
          datos.adquirido.reduce((a, b) => a + b, 0) / datos.adquirido.length,
        requerido:
          datos.requerido.reduce((a, b) => a + b, 0) / datos.requerido.length,
      }),
    );

    return NextResponse.json({
      ok: true,
      totales: {
        titulados: titulados.length,
        empleadores: empleadores.length,
        competencias: competencias.length,
      },
      cruceAreaFinanciamiento,
      cruceSituacionSector,
      distribuciones: {
        genero: distribucionGenero,
        edad: distribucionEdad,
        situacion: distribucionSituacion,
        sectorEmpleador: distribucionSectorEmpleador,
        tipoOrg: distribucionTipoOrg,
      },
      radarCompetencias,
    });
  } catch (error) {
    console.error("Error en HU5:", error);
    return NextResponse.json(
      { ok: false, error: "Error al generar el dashboard" },
      { status: 500 },
    );
  }
}