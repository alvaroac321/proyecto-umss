import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Función auxiliar para contar frecuencias de ítems separados por punto y coma (;)
function contarFrecuenciasTexto(
  registros: any[],
  campo: string,
): Record<string, number> {
  const conteo: Record<string, number> = {};

  for (const r of registros) {
    const valor = r[campo];
    if (!valor || typeof valor !== "string") continue;

    const items = valor
      .split(";")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    for (const item of items) {
      conteo[item] = (conteo[item] || 0) + 1;
    }
  }

  return conteo;
}

export async function GET() {
  try {
    const titulados =
      (await (prisma as any).graduateSurvey?.findMany()) ||
      (await (prisma as any).titulado?.findMany()) ||
      [];

    const totalTitulados = titulados.length;

    if (totalTitulados === 0) {
      return NextResponse.json({
        ok: true,
        totalTitulados: 0,
        asignaturasUtiles: {},
        asignaturasInutiles: {},
        aspectosUtiles: {},
        aspectosMejorar: {},
      });
    }

    // Procesar conteos de texto estructurado y respuestas múltiples
    const asignaturasUtiles = contarFrecuenciasTexto(
      titulados,
      "asignaturasUtiles",
    );
    const asignaturasInutiles = contarFrecuenciasTexto(
      titulados,
      "asignaturasInutiles",
    );
    const aspectosUtiles = contarFrecuenciasTexto(titulados, "aspectosUtiles");
    const aspectosMejorar = contarFrecuenciasTexto(
      titulados,
      "aspectosMejorar",
    );

    return NextResponse.json({
      ok: true,
      totalTitulados,
      asignaturasUtiles,
      asignaturasInutiles,
      aspectosUtiles,
      aspectosMejorar,
    });
  } catch (error) {
    console.error("Error en API HU4:", error);
    return NextResponse.json(
      { ok: false, error: "Error al evaluar la pertinencia curricular" },
      { status: 500 },
    );
  }
}
