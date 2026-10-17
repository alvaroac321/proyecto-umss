import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Consultar todos los registros de encuestas almacenados
    const titulados =
      (await (prisma as any).graduateSurvey?.findMany({
        orderBy: { createdAt: "desc" },
      })) ||
      (await (prisma as any).titulado?.findMany({
        orderBy: { createdAt: "desc" },
      })) ||
      [];

    const empleadores =
      (await (prisma as any).employerSurvey?.findMany({
        orderBy: { createdAt: "desc" },
      })) ||
      (await (prisma as any).empleador?.findMany({
        orderBy: { createdAt: "desc" },
      })) ||
      [];

    const competencias =
      (await (prisma as any).competenciaTitulado?.findMany()) ||
      (await (prisma as any).competencia_titulado?.findMany()) ||
      [];

    return NextResponse.json({
      ok: true,
      resumen: {
        totalTitulados: titulados.length,
        totalEmpleadores: empleadores.length,
        totalCompetenciasEvaluadas: competencias.length,
      },
      titulados,
      empleadores,
    });
  } catch (error) {
    console.error("Error en API HU6:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Error al obtener registros de gestión para reportes",
      },
      { status: 500 },
    );
  }
}
