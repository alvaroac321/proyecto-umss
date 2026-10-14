import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Guardar una encuesta de titulado
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const competencias = body.competencias || [];

    const titulado = await prisma.graduateSurvey.create({
      data: {
        edad: body.edad,
        genero: body.genero,
        formacionComplementaria: body.formacionComplementaria ?? false,
        nivelPosgrado: body.nivelPosgrado ?? null,
        institucionPosgrado: body.institucionPosgrado ?? null,
        fuenteFinanciamiento: body.fuenteFinanciamiento ?? null,
        nombrePrograma: body.nombrePrograma ?? null,
        interesPosgrado: body.interesPosgrado ?? false,
        areaInteresPosgrado: body.areaInteresPosgrado ?? null,
        organizacionPosgrado: body.organizacionPosgrado ?? null,
        opinionPosgradoFCyT: body.opinionPosgradoFCyT ?? null,
        aniosVidaProfesional: Number(body.aniosVidaProfesional) || 0,
        aniosDesempleo: Number(body.aniosDesempleo) || 0,
        situacionLaboral: body.situacionLaboral,
        origenEmprendimiento: body.origenEmprendimiento ?? null,
        entregableNegocio: body.entregableNegocio ?? null,
        financiamientoNegocio: body.financiamientoNegocio ?? null,
        satisfaccionNegocio: body.satisfaccionNegocio ?? null,
        importanciaFormacion: body.importanciaFormacion ?? null,
        primerEmpleo: body.primerEmpleo ?? false,
        tiempoPrimerEmpleo: body.tiempoPrimerEmpleo ?? null,
        numeroEmpleos: body.numeroEmpleos ?? null,
        satisfaccionCarrera: body.satisfaccionCarrera ?? null,
        concordanciaMercado: body.concordanciaMercado ?? null,
        aspectosUtiles: body.aspectosUtiles?.join(";") ?? null,
        aspectosMejorar: body.aspectosMejorar?.join(";") ?? null,
        asignaturasUtiles: body.asignaturasUtiles?.join(";") ?? null,
        asignaturasInutiles: body.asignaturasInutiles?.join(";") ?? null,
        redContactos: body.redContactos ?? false,
        email: body.email ?? null,
        telefono: body.telefono ?? null,
        linkedin: body.linkedin ?? null,

        competencias: {
          create: competencias.map((c: any) => ({
            nombreCompetencia: c.nombre,
            tipo: c.tipo,
            nivelAdquirido: Number(c.adquirido) || 0,
            nivelRequerido: Number(c.requerido) || 0,
            brecha: (Number(c.requerido) || 0) - (Number(c.adquirido) || 0),
          })),
        },
      },
    });

    return NextResponse.json({ ok: true, data: titulado }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar titulado:", error);
    return NextResponse.json(
      { ok: false, error: "Error al guardar la encuesta" },
      { status: 500 },
    );
  }
}

// Leer todas las encuestas de titulados
export async function GET() {
  try {
    const titulados = await prisma.graduateSurvey.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, data: titulados });
  } catch (error) {
    console.error("Error al leer titulados:", error);
    return NextResponse.json(
      { ok: false, error: "Error al leer los datos" },
      { status: 500 },
    );
  }
}