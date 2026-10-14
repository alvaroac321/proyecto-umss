"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RUBROS = [
  "Desarrollo de software",
  "Servicios de tecnologías de información (TI)",
  "Telecomunicaciones y redes",
  "Soporte técnico y mantenimiento de sistemas",
  "Consultoría en sistemas / transformación digital",
  "Banca y servicios financieros",
  "Instituciones públicas / gobierno",
  "Educación e investigación",
  "Industria y manufactura",
  "Comercio y comercio electrónico",
  "Salud",
  "Seguridad informática / ciberseguridad",
  "Análisis de datos / inteligencia de negocios",
  "Startups o emprendimientos tecnológicos",
  "Otros",
];

const TAMANOS = [
  "Grande (100 funcionarios o más)",
  "Mediana (entre 31 a 99 funcionarios)",
  "Pequeña (entre 11 a 30 funcionarios)",
  "Micro (hasta 10 funcionarios)",
];

const PROYECCIONES = [
  "Sí, existe una alta probabilidad de contratación",
  "Sí, dependiendo del crecimiento o nuevos proyectos",
  "No se tiene prevista la contratación actualmente",
  "No requiere profesionales del área de Sistemas",
];

const NIVELES_FORMACION = [
  "Licenciatura",
  "Diplomado",
  "Especialidad",
  "Maestría",
  "Doctorado",
  "Posdoctorado",
];

const MEDIOS_CONVOCATORIA = [
  "Medios escritos y audiovisuales",
  "Internet y Redes sociales",
  "Postulación competitiva",
  "Oferta profesional personal",
  "Recomendación de terceros",
  "Otros",
];

const CARGOS = [
  "De apoyo / asistencia tecnológica",
  "Técnico (desarrollo, redes, BD, soporte)",
  "Analista (sistemas, datos, procesos)",
  "Especialista (ciberseguridad, arquitectura)",
  "Supervisor / Coordinador de área tecnológica",
  "Jefatura o Gerencial (gestión de proyectos)",
  "Consultor tecnológico",
  "Otro",
];

const LIKERT_OPCIONES = [
  "Totalmente en desacuerdo",
  "En desacuerdo",
  "De acuerdo",
  "Totalmente de acuerdo",
  "No sabe",
];

const CRITERIOS_LIKERT = [
  { campo: "likertConfianza", texto: "La Carrera brinda confianza a nuestra organización como formadora de profesionales." },
  { campo: "likertTituloConsistente", texto: "El título profesional es consistente con el nivel de formación y las competencias demostradas." },
  { campo: "likertConsultaOpinion", texto: "Las autoridades de la Carrera consultan regularmente nuestra opinión como empleadores." },
  { campo: "likertConocePerfil", texto: "Conozco el perfil profesional y las competencias de egreso declaradas por la Carrera." },
  { campo: "likertPerfilCoherente", texto: "El perfil profesional declarado es coherente con el desempeño laboral demostrado." },
  { campo: "likertDesempenoDestacado", texto: "La formación permite a sus titulados alcanzar un desempeño destacado." },
  { campo: "likertConsideraOpinion", texto: "La Carrera considera nuestra opinión e incorpora las necesidades del sector laboral." },
  { campo: "likertCompetencias", texto: "El desempeño evidencia competencias: comunicación, análisis, pensamiento crítico, trabajo en equipo." },
  { campo: "likertValores", texto: "Los titulados demuestran valores: ética, responsabilidad social, inclusión, respeto." },
  { campo: "likertParticipacion", texto: "He participado en procesos de recopilación de información o retroalimentación." },
];

export default function EncuestaEmpleador() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [form, setForm] = useState({
    email: "",
    nombreEmpresa: "",
    tipoOrganizacion: "Privado",
    tamano: "Mediana (entre 31 a 99 funcionarios)",
    rubroSector: "Desarrollo de software",
    haContratado5Anios: false,
    proyeccionContratacion: "Sí, existe una alta probabilidad de contratación",
    nivelFormacionDemanda: "Licenciatura",
    medioConvocatoria: "Internet y Redes sociales",
    cargosDesempenados: [] as string[],
    areasEmergentes: "",
    herramientasTecnologicas: "",
    habilidadesRequeridas: "",
    likertConfianza: 3,
    likertTituloConsistente: 3,
    likertConsultaOpinion: 3,
    likertConocePerfil: 3,
    likertPerfilCoherente: 3,
    likertDesempenoDestacado: 3,
    likertConsideraOpinion: 3,
    likertCompetencias: 3,
    likertValores: 3,
    likertParticipacion: 3,
  });

  const actualizar = (campo: string, valor: any) => {
    setForm({ ...form, [campo]: valor });
  };

  const toggleArray = (campo: string, valor: string) => {
    const actual = (form as any)[campo] as string[];
    const nuevo = actual.includes(valor)
      ? actual.filter((v) => v !== valor)
      : [...actual, valor];
    setForm({ ...form, [campo]: nuevo });
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje("");

    try {
      const respuesta = await fetch("/api/empleadores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const datos = await respuesta.json();

      if (datos.ok) {
        setMensaje("✅ Encuesta enviada correctamente. ¡Gracias!");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setMensaje("❌ Error al enviar. Intenta de nuevo.");
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error de conexión.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 text-sm hover:underline">
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold text-blue-900 mt-4 mb-2">
          Encuesta para Empleadores
        </h1>
        <p className="text-slate-600 mb-8">
          Carrera de Ingeniería en Sistemas — UMSS
        </p>

        <form onSubmit={enviar} className="space-y-8">
          {/* SECCIÓN 1: DATOS DE LA ORGANIZACIÓN */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              1. Datos de la organización
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => actualizar("email", e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2 text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Nombre de la empresa o institución *
                </label>
                <input
                  type="text"
                  value={form.nombreEmpresa}
                  onChange={(e) => actualizar("nombreEmpresa", e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2 text-slate-900 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Tipo de organización *
                </label>
                <select
                  value={form.tipoOrganizacion}
                  onChange={(e) =>
                    actualizar("tipoOrganizacion", e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-md p-2 text-slate-900 bg-white"
                >
                  <option>Público</option>
                  <option>Privado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Tamaño de la organización *
                </label>
                <select
                  value={form.tamano}
                  onChange={(e) => actualizar("tamano", e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2 text-slate-900 bg-white"
                >
                  {TAMANOS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Rubro o sector principal *
                </label>
                <select
                  value={form.rubroSector}
                  onChange={(e) => actualizar("rubroSector", e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2 text-slate-900 bg-white"
                >
                  {RUBROS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: EMPLEABILIDAD */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              2. Empleabilidad
            </h2>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={form.haContratado5Anios}
                onChange={(e) =>
                  actualizar("haContratado5Anios", e.target.checked)
                }
              />
              <span className="text-sm text-slate-800">
                ¿Ha contratado Ingenieros de Sistemas en los últimos 5 años?
              </span>
            </label>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Posibilidad de contratación futura *
                </label>
                <select
                  value={form.proyeccionContratacion}
                  onChange={(e) =>
                    actualizar("proyeccionContratacion", e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-md p-2 text-slate-900 bg-white"
                >
                  {PROYECCIONES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Nivel de formación demandado *
                </label>
                <select
                  value={form.nivelFormacionDemanda}
                  onChange={(e) =>
                    actualizar("nivelFormacionDemanda", e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-md p-2 text-slate-900 bg-white"
                >
                  {NIVELES_FORMACION.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Medio de convocatoria
                </label>
                <select
                  value={form.medioConvocatoria}
                  onChange={(e) =>
                    actualizar("medioConvocatoria", e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-md p-2 text-slate-900 bg-white"
                >
                  {MEDIOS_CONVOCATORIA.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Cargos que desempeñan (puede elegir varios)
                </label>
                <div className="space-y-2">
                  {CARGOS.map((c) => (
                    <label key={c} className="flex items-start gap-2 text-sm text-slate-800">
                      <input
                        type="checkbox"
                        checked={form.cargosDesempenados.includes(c)}
                        onChange={() => toggleArray("cargosDesempenados", c)}
                        className="mt-1"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: PREGUNTAS ABIERTAS */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              3. Tendencias y requerimientos
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Áreas de conocimiento o tecnologías emergentes importantes
                </label>
                <textarea
                  value={form.areasEmergentes}
                  onChange={(e) =>
                    actualizar("areasEmergentes", e.target.value)
                  }
                  rows={3}
                  className="w-full border border-slate-300 rounded-md p-2 text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Herramientas tecnológicas que debería manejar el titulado
                </label>
                <textarea
                  value={form.herramientasTecnologicas}
                  onChange={(e) =>
                    actualizar("herramientasTecnologicas", e.target.value)
                  }
                  rows={3}
                  className="w-full border border-slate-300 rounded-md p-2 text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Habilidades y competencias fundamentales
                </label>
                <textarea
                  value={form.habilidadesRequeridas}
                  onChange={(e) =>
                    actualizar("habilidadesRequeridas", e.target.value)
                  }
                  rows={3}
                  className="w-full border border-slate-300 rounded-md p-2 text-slate-900 bg-white"
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN 4: FORMACIÓN Y PERFIL PROFESIONAL (LIKERT) */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              4. Formación y perfil profesional
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Valore cada criterio del 1 al 5 según su experiencia.
            </p>

            <div className="space-y-6">
              {CRITERIOS_LIKERT.map((c) => (
                <div key={c.campo}>
                  <p className="text-sm font-medium text-slate-800 mb-2">
                    {c.texto}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <button
                        key={valor}
                        type="button"
                        onClick={() => actualizar(c.campo, valor)}
                        className={`w-10 h-10 rounded-md border font-semibold transition ${
                          (form as any)[c.campo] === valor
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-300 hover:border-blue-400"
                        }`}
                      >
                        {valor}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* BOTÓN ENVIAR */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={enviando}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold py-3 px-8 rounded-md transition"
            >
              {enviando ? "Enviando..." : "Enviar encuesta"}
            </button>
          </div>

          {mensaje && (
            <div className="text-center text-lg font-semibold">{mensaje}</div>
          )}
        </form>
      </div>
    </main>
  );
}