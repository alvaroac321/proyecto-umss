import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Guardar una encuesta de empleador
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const empleador = await prisma.employerSurvey.create({
      data: {
        email: body.email ?? null,
        nombreEmpresa: body.nombreEmpresa,
        tipoOrganizacion: body.tipoOrganizacion,
        tamano: body.tamano,
        rubroSector: body.rubroSector,
        haContratado5Anios: body.haContratado5Anios ?? false,
        proyeccionContratacion: body.proyeccionContratacion,
        nivelFormacionDemanda: body.nivelFormacionDemanda,
        medioConvocatoria: body.medioConvocatoria ?? null,
        cargosDesempenados: body.cargosDesempenados?.join(";") ?? null,
        areasEmergentes: body.areasEmergentes ?? null,
        herramientasTecnologicas: body.herramientasTecnologicas ?? null,
        habilidadesRequeridas: body.habilidadesRequeridas ?? null,
        likertConfianza: body.likertConfianza ?? null,
        likertTituloConsistente: body.likertTituloConsistente ?? null,
        likertConsultaOpinion: body.likertConsultaOpinion ?? null,
        likertConocePerfil: body.likertConocePerfil ?? null,
        likertPerfilCoherente: body.likertPerfilCoherente ?? null,
        likertDesempenoDestacado: body.likertDesempenoDestacado ?? null,
        likertConsideraOpinion: body.likertConsideraOpinion ?? null,
        likertCompetencias: body.likertCompetencias ?? null,
        likertValores: body.likertValores ?? null,
        likertParticipacion: body.likertParticipacion ?? null,
      },
    });

    return NextResponse.json({ ok: true, data: empleador }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar empleador:", error);
    return NextResponse.json(
      { ok: false, error: "Error al guardar la encuesta" },
      { status: 500 },
    );
  }
}

// Leer todas las encuestas de empleadores
export async function GET() {
  try {
    const empleadores = await prisma.employerSurvey.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, data: empleadores });
  } catch (error) {
    console.error("Error al leer empleadores:", error);
    return NextResponse.json(
      { ok: false, error: "Error al leer los datos" },
      { status: 500 },
    );
  }
}