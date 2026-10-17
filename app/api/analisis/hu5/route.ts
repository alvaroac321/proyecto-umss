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
        satisfaccionPromedioTitulados: 0,
        concordanciaPromedioTitulados: 0,
        metricasLikertEmpleadores: {},
      });
    }

    // 1. Procesar métricas de Titulados
    let sumaSatisfaccion = 0;
    let sumaConcordancia = 0;

    for (const t of titulados) {
      sumaSatisfaccion += Number(t.satisfaccionCarrera) || 0;
      sumaConcordancia += Number(t.concordanciaMercado) || 0;
    }

    const satisfaccionPromedioTitulados =
      totalTitulados > 0 ? sumaSatisfaccion / totalTitulados : 0;
    const concordanciaPromedioTitulados =
      totalTitulados > 0 ? sumaConcordancia / totalTitulados : 0;

    // 2. Procesar métricas Likert de Empleadores
    const clavesLikert = [
      { key: "likertConfianza", label: "Confianza Institucional" },
      { key: "likertTituloConsistente", label: "Consistencia del Título" },
      { key: "likertConocePerfil", label: "Conocimiento del Perfil" },
      { key: "likertPerfilCoherente", label: "Coherencia del Perfil" },
      { key: "likertDesempenoDestacado", label: "Desempeño Destacado" },
      { key: "likertValores", label: "Valores y Ética" },
      { key: "likertParticipacion", label: "Participación / Responsabilidad" },
    ];

    const acumuladorLikert: Record<
      string,
      { label: string; suma: number; conteo: number }
    > = {};

    for (const item of clavesLikert) {
      acumuladorLikert[item.key] = { label: item.label, suma: 0, conteo: 0 };
    }

    for (const emp of empleadores) {
      for (const item of clavesLikert) {
        const val = Number(emp[item.key]);
        if (!isNaN(val) && val > 0) {
          acumuladorLikert[item.key].suma += val;
          acumuladorLikert[item.key].conteo += 1;
        }
      }
    }

    const metricasLikertEmpleadores: Record<
      string,
      { label: string; promedio: number }
    > = {};

    Object.entries(acumuladorLikert).forEach(([key, data]) => {
      const promedio = data.conteo > 0 ? data.suma / data.conteo : 0;
      metricasLikertEmpleadores[key] = {
        label: data.label,
        promedio: Number(promedio.toFixed(2)),
      };
    });

    return NextResponse.json({
      ok: true,
      totalTitulados,
      totalEmpleadores,
      satisfaccionPromedioTitulados: Number(
        satisfaccionPromedioTitulados.toFixed(2),
      ),
      concordanciaPromedioTitulados: Number(
        concordanciaPromedioTitulados.toFixed(2),
      ),
      metricasLikertEmpleadores,
    });
  } catch (error) {
    console.error("Error en API HU5:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Error al calcular la percepción de calidad institucional",
      },
      { status: 500 },
    );
  }
}
