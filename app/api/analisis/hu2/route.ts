import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    if (totalTitulados === 0 && totalEmpleadores === 0) {
      return NextResponse.json({
        ok: true,
        totalTitulados: 0,
        totalEmpleadores: 0,
        tiempoPrimerEmpleo: {},
        situacionLaboral: {},
        contratacionPorRubro: {},
        tamanoEmpresas: {},
        proyeccionContratacion: {},
        haContratado5Anios: { si: 0, no: 0 },
      });
    }

    // 1. Analizar tiempo para conseguir el primer empleo (Titulados)
    const tiempoPrimerEmpleo: Record<string, number> = {};
    const situacionLaboral: Record<string, number> = {};

    for (const t of titulados) {
      const tiempo = t.tiempoPrimerEmpleo || "No especificado";
      tiempoPrimerEmpleo[tiempo] = (tiempoPrimerEmpleo[tiempo] || 0) + 1;

      const situacion = t.situacionLaboral || "Sin registro";
      situacionLaboral[situacion] = (situacionLaboral[situacion] || 0) + 1;
    }

    // 2. Analizar perfil de contratantes (Empleadores)
    const contratacionPorRubro: Record<string, number> = {};
    const tamanoEmpresas: Record<string, number> = {};
    const proyeccionContratacion: Record<string, number> = {};
    let haContratadoSi = 0;
    let haContratadoNo = 0;

    for (const e of empleadores) {
      const rubro = e.rubroSector || "Otros";
      contratacionPorRubro[rubro] = (contratacionPorRubro[rubro] || 0) + 1;

      const tamano = e.tamano || "No especificado";
      tamanoEmpresas[tamano] = (tamanoEmpresas[tamano] || 0) + 1;

      const proyeccion = e.proyeccionContratacion || "Sin proyeccion";
      proyeccionContratacion[proyeccion] =
        (proyeccionContratacion[proyeccion] || 0) + 1;

      if (
        e.haContratado5Anios === true ||
        String(e.haContratado5Anios).toLowerCase() === "sí" ||
        String(e.haContratado5Anios) === "true"
      ) {
        haContratadoSi++;
      } else {
        haContratadoNo++;
      }
    }

    return NextResponse.json({
      ok: true,
      totalTitulados,
      totalEmpleadores,
      tiempoPrimerEmpleo,
      situacionLaboral,
      contratacionPorRubro,
      tamanoEmpresas,
      proyeccionContratacion,
      haContratado5Anios: {
        si: haContratadoSi,
        no: haContratadoNo,
      },
    });
  } catch (error) {
    console.error("Error en API HU2:", error);
    return NextResponse.json(
      { ok: false, error: "Error al calcular el mapa de inserción laboral" },
      { status: 500 },
    );
  }
}
