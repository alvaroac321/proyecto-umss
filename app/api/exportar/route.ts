import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function escaparCSV(valor: any): string {
  if (valor === null || valor === undefined) return "";
  const str = String(valor);
  if (str.includes(";") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo") || "titulados";

    let filas: string[] = [];
    let encabezados: string[] = [];
    let nombreArchivo = "";

    if (tipo === "titulados") {
      const datos = await prisma.graduateSurvey.findMany({
        orderBy: { createdAt: "desc" },
      });

      encabezados = [
        "ID",
        "Fecha",
        "Edad",
        "Género",
        "Formación complementaria",
        "Nivel posgrado",
        "Institución",
        "Fuente financiamiento",
        "Nombre programa",
        "Interesado posgrado",
        "Área interés",
        "Organización posgrado",
        "Opinión FCyT",
        "Años vida profesional",
        "Años desempleo",
        "Situación laboral",
        "Origen emprendimiento",
        "Entregable negocio",
        "Financiamiento negocio",
        "Satisfacción negocio",
        "Importancia formación",
        "Primer empleo",
        "Tiempo primer empleo",
        "Número empleos",
        "Satisfacción carrera",
        "Concordancia mercado",
        "Aspectos útiles",
        "Aspectos mejorar",
        "Asignaturas útiles",
        "Asignaturas inútiles",
        "Red contactos",
        "Email",
        "Teléfono",
        "LinkedIn",
      ];

      filas = datos.map((d) =>
        [
          d.id,
          d.createdAt.toISOString(),
          d.edad,
          d.genero,
          d.formacionComplementaria,
          d.nivelPosgrado,
          d.institucionPosgrado,
          d.fuenteFinanciamiento,
          d.nombrePrograma,
          d.interesPosgrado,
          d.areaInteresPosgrado,
          d.organizacionPosgrado,
          d.opinionPosgradoFCyT,
          d.aniosVidaProfesional,
          d.aniosDesempleo,
          d.situacionLaboral,
          d.origenEmprendimiento,
          d.entregableNegocio,
          d.financiamientoNegocio,
          d.satisfaccionNegocio,
          d.importanciaFormacion,
          d.primerEmpleo,
          d.tiempoPrimerEmpleo,
          d.numeroEmpleos,
          d.satisfaccionCarrera,
          d.concordanciaMercado,
          d.aspectosUtiles,
          d.aspectosMejorar,
          d.asignaturasUtiles,
          d.asignaturasInutiles,
          d.redContactos,
          d.email,
          d.telefono,
          d.linkedin,
        ]
          .map(escaparCSV)
          .join(";"),
      );

      nombreArchivo = "titulados";
    } else if (tipo === "empleadores") {
      const datos = await prisma.employerSurvey.findMany({
        orderBy: { createdAt: "desc" },
      });

      encabezados = [
        "ID",
        "Fecha",
        "Email",
        "Nombre empresa",
        "Tipo organización",
        "Tamaño",
        "Rubro sector",
        "Contrató 5 años",
        "Proyección contratación",
        "Nivel formación demanda",
        "Medio convocatoria",
        "Cargos desempeñados",
        "Áreas emergentes",
        "Herramientas tecnológicas",
        "Habilidades requeridas",
        "Likert confianza",
        "Likert título consistente",
        "Likert consulta opinión",
        "Likert conoce perfil",
        "Likert perfil coherente",
        "Likert desempeño destacado",
        "Likert considera opinión",
        "Likert competencias",
        "Likert valores",
        "Likert participación",
      ];

      filas = datos.map((d) =>
        [
          d.id,
          d.createdAt.toISOString(),
          d.email,
          d.nombreEmpresa,
          d.tipoOrganizacion,
          d.tamano,
          d.rubroSector,
          d.haContratado5Anios,
          d.proyeccionContratacion,
          d.nivelFormacionDemanda,
          d.medioConvocatoria,
          d.cargosDesempenados,
          d.areasEmergentes,
          d.herramientasTecnologicas,
          d.habilidadesRequeridas,
          d.likertConfianza,
          d.likertTituloConsistente,
          d.likertConsultaOpinion,
          d.likertConocePerfil,
          d.likertPerfilCoherente,
          d.likertDesempenoDestacado,
          d.likertConsideraOpinion,
          d.likertCompetencias,
          d.likertValores,
          d.likertParticipacion,
        ]
          .map(escaparCSV)
          .join(";"),
      );

      nombreArchivo = "empleadores";
    } else if (tipo === "competencias") {
      const datos = await prisma.competenciaTitulado.findMany({
        orderBy: { createdAt: "desc" },
      });

      encabezados = [
        "ID",
        "Fecha",
        "Titulado ID",
        "Competencia",
        "Tipo",
        "Nivel adquirido",
        "Nivel requerido",
        "Brecha",
      ];

      filas = datos.map((d) =>
        [
          d.id,
          d.createdAt.toISOString(),
          d.tituladoId,
          d.nombreCompetencia,
          d.tipo,
          d.nivelAdquirido,
          d.nivelRequerido,
          d.brecha,
        ]
          .map(escaparCSV)
          .join(";"),
      );

      nombreArchivo = "competencias";
    } else {
      return NextResponse.json(
        { ok: false, error: "Tipo no válido" },
        { status: 400 },
      );
    }

    // BOM para Excel
    const csv = "\uFEFF" + [encabezados.join(";"), ...filas].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error al exportar:", error);
    return NextResponse.json(
      { ok: false, error: "Error al exportar" },
      { status: 500 },
    );
  }
}