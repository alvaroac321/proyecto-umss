"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const COMPETENCIAS = [
  { nombre: "Programación y desarrollo de software", tipo: "Técnica" },
  { nombre: "Bases de datos y SQL", tipo: "Técnica" },
  { nombre: "Redes y comunicaciones", tipo: "Técnica" },
  { nombre: "Seguridad informática", tipo: "Técnica" },
  { nombre: "Análisis de datos y estadística", tipo: "Técnica" },
  { nombre: "Arquitectura de software", tipo: "Técnica" },
  { nombre: "Gestión de proyectos TI", tipo: "Técnica" },
  { nombre: "Comunicación efectiva", tipo: "Transversal" },
  { nombre: "Trabajo en equipo", tipo: "Transversal" },
  { nombre: "Pensamiento crítico", tipo: "Transversal" },
  { nombre: "Resolución de problemas", tipo: "Transversal" },
  { nombre: "Aprendizaje continuo", tipo: "Transversal" },
  { nombre: "Liderazgo", tipo: "Transversal" },
  { nombre: "Ética profesional", tipo: "Transversal" },
];

const AREAS = [
  "IA",
  "Robótica",
  "Ingeniería de Software",
  "Base de Datos",
  "Redes de Datos y Seguridad",
];

const NIVELES_POSGRADO = [
  "Diplomado",
  "Especialidad",
  "Maestría",
  "Doctorado",
  "Posdoctorado",
];

const INSTITUCIONES = [
  "Escuela Universitaria de Posgrado (EUPG)",
  "Dirección de Posgrado FCyT",
  "IBNORCA",
  "Universidades Internacionales",
  "Universidades Públicas Nacionales",
  "Universidades Privadas Nacionales",
  "Otro",
];

const FUENTES_FINANCIAMIENTO = [
  "Recursos Propios",
  "Beca Total",
  "Beca Parcial",
];

const SITUACIONES_LABORALES = [
  "Trabajando en Organización",
  "No Trabaja",
  "Emprendimiento Propio",
];

const TIEMPOS_PRIMER_EMPLEO = [
  "Ya trabajaba antes de titularse",
  "Menos de 1 mes",
  "Entre 1 - 4 meses",
  "Entre 4 - 8 meses",
  "Entre 8 - 12 meses",
  "Más de 12 meses",
];

const NUMERO_EMPLEOS = ["1", "2", "3", "Más de 3"];

const ASPECTOS_UTILES = [
  "Aplicación práctica de conceptos teóricos en proyectos reales",
  "Oportunidad de realizar pasantías o prácticas profesionales",
  "Distribución de los horarios de clases",
  "Desarrollo de habilidades analíticas y de resolución de problemas",
  "Colaboración de equipos multidisciplinarios",
  "Enseñanza de herramientas y software específico de la industria",
];

const ASPECTOS_MEJORAR = [
  "Mayor integración de la teoría con aplicaciones prácticas",
  "Mayor relacionamiento del estudiante con las empresas",
  "La distribución de horarios de clases",
  "Actualización constante del plan de estudios",
  "Incremento de actividades extracurriculares",
  "Ofrecimiento de más opciones de especialización",
];

const ASIGNATURAS = [
  "Introducción",
  "Base de Datos",
  "Inteligencia Artificial",
  "Redes de Computadora",
  "Electivas",
  "T.I.S.",
  "Básicas (Física, Cálculo, Álgebra)",
  "Planificación de Proyectos y Gestión",
  "Tecnología Redes Avanzadas",
];

const ASIGNATURAS_INUTILES = [
  "Básicas (Física, Cálculo, Álgebra)",
  "Aplic. Interactivas para Televisión Digital",
  "Telefonía IP",
  "Web Semánticas",
  "Graficación por Computadora",
  "Robótica",
  "Taller de Programación en Bajo Nivel",
  "Teoría de Autómatas y Leng. Formales",
  "Programación Funcional",
  "Teoría de Grafos",
  "Contabilidad Básica",
];

export default function EncuestaTitulado() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Estado del formulario
  const [form, setForm] = useState({
    edad: "25-34 años",
    genero: "Hombre",
    formacionComplementaria: false,
    nivelPosgrado: "Diplomado",
    institucionPosgrado: "Dirección de Posgrado FCyT",
    fuenteFinanciamiento: "Recursos Propios",
    nombrePrograma: "",
    interesPosgrado: false,
    areaInteresPosgrado: "Ingeniería de Software",
    organizacionPosgrado: "Dirección de Posgrado FCyT",
    opinionPosgradoFCyT: 3,
    aniosVidaProfesional: 0,
    aniosDesempleo: 0,
    situacionLaboral: "Trabajando en Organización",
    origenEmprendimiento: "Idea propia.",
    entregableNegocio: "Producto",
    financiamientoNegocio: "No, financiamiento propio.",
    satisfaccionNegocio: 3,
    importanciaFormacion: 3,
    primerEmpleo: false,
    tiempoPrimerEmpleo: "Entre 1 - 4 meses",
    numeroEmpleos: "1",
    satisfaccionCarrera: 3,
    concordanciaMercado: 3,

    competencias: COMPETENCIAS.map((c) => ({
      nombre: c.nombre,
      tipo: c.tipo,
      adquirido: 3,
      requerido: 3,
    })),
    aspectosUtiles: [] as string[],
    aspectosMejorar: [] as string[],
    asignaturasUtiles: [] as string[],
    asignaturasInutiles: [] as string[],
    redContactos: false,
    email: "",
    telefono: "",
    linkedin: "",
  });

  const actualizar = (campo: string, valor: any) => {
    setForm({ ...form, [campo]: valor });
  };

  const toggleArray = (campo: string, valor: string, max?: number) => {
    const actual = (form as any)[campo] as string[];
    let nuevo;
    if (actual.includes(valor)) {
      nuevo = actual.filter((v) => v !== valor);
    } else {
      if (max && actual.length >= max) {
        alert(`Solo puedes seleccionar máximo ${max} opciones`);
        return;
      }
      nuevo = [...actual, valor];
    }
    setForm({ ...form, [campo]: nuevo });
  };

    const actualizarCompetencia = (
    index: number,
    campo: "adquirido" | "requerido",
    valor: number,
  ) => {
    const nuevas = [...form.competencias];
    nuevas[index] = { ...nuevas[index], [campo]: valor };
    setForm({ ...form, competencias: nuevas });
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje("");

    try {
      const respuesta = await fetch("/api/titulados", {
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
          Encuesta para Titulados
        </h1>
        <p className="text-slate-600 mb-8">
          Carrera de Ingeniería en Sistemas — UMSS
        </p>

        <form onSubmit={enviar} className="space-y-8">
          {/* ============ SECCIÓN 1: DATOS GENERALES ============ */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              1. Datos generales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Edad actual
                </label>
                <select
                  value={form.edad}
                  onChange={(e) => actualizar("edad", e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2"
                >
                  <option>25-34 años</option>
                  <option>35 años o más</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Género</label>
                <select
                  value={form.genero}
                  onChange={(e) => actualizar("genero", e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2"
                >
                  <option>Hombre</option>
                  <option>Mujer</option>
                  <option>Otro</option>
                </select>
              </div>
            </div>
          </section>

          {/* ============ SECCIÓN 2: FORMACIÓN COMPLEMENTARIA ============ */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              2. Formación complementaria
            </h2>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={form.formacionComplementaria}
                onChange={(e) =>
                  actualizar("formacionComplementaria", e.target.checked)
                }
              />
              <span className="text-sm">
                ¿Ha realizado o está realizando algún programa de formación
                complementaria?
              </span>
            </label>

            {form.formacionComplementaria && (
              <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nivel de mayor grado
                  </label>
                  <select
                    value={form.nivelPosgrado}
                    onChange={(e) => actualizar("nivelPosgrado", e.target.value)}
                    className="w-full border border-slate-300 rounded-md p-2"
                  >
                    {NIVELES_POSGRADO.map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Institución donde cursó
                  </label>
                  <select
                    value={form.institucionPosgrado}
                    onChange={(e) =>
                      actualizar("institucionPosgrado", e.target.value)
                    }
                    className="w-full border border-slate-300 rounded-md p-2"
                  >
                    {INSTITUCIONES.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Fuente de financiamiento
                  </label>
                  <select
                    value={form.fuenteFinanciamiento}
                    onChange={(e) =>
                      actualizar("fuenteFinanciamiento", e.target.value)
                    }
                    className="w-full border border-slate-300 rounded-md p-2"
                  >
                    {FUENTES_FINANCIAMIENTO.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre del programa
                  </label>
                  <input
                    type="text"
                    value={form.nombrePrograma}
                    onChange={(e) =>
                      actualizar("nombrePrograma", e.target.value)
                    }
                    className="w-full border border-slate-300 rounded-md p-2"
                  />
                </div>
              </div>
            )}
          </section>

          {/* ============ SECCIÓN 3: INTERÉS EN POSGRADO ============ */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              3. Interés en posgrado
            </h2>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={form.interesPosgrado}
                onChange={(e) =>
                  actualizar("interesPosgrado", e.target.checked)
                }
              />
              <span className="text-sm">
                ¿Estaría interesado en realizar estudios de posgrado en
                Ingeniería en Sistemas?
              </span>
            </label>

            {form.interesPosgrado && (
              <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Área de interés
                  </label>
                  <select
                    value={form.areaInteresPosgrado}
                    onChange={(e) =>
                      actualizar("areaInteresPosgrado", e.target.value)
                    }
                    className="w-full border border-slate-300 rounded-md p-2"
                  >
                    {AREAS.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Organización donde estudiaría
                  </label>
                  <select
                    value={form.organizacionPosgrado}
                    onChange={(e) =>
                      actualizar("organizacionPosgrado", e.target.value)
                    }
                    className="w-full border border-slate-300 rounded-md p-2"
                  >
                    {INSTITUCIONES.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Opinión sobre posgrado de la FCyT (1=muy malo, 4=muy bueno)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={form.opinionPosgradoFCyT}
                    onChange={(e) =>
                      actualizar("opinionPosgradoFCyT", Number(e.target.value))
                    }
                    className="w-full border border-slate-300 rounded-md p-2"
                  />
                </div>
              </div>
            )}
          </section>

          {/* ============ SECCIÓN 4: VIDA PROFESIONAL ============ */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              4. Vida profesional
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Años de vida profesional
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.aniosVidaProfesional}
                  onChange={(e) =>
                    actualizar("aniosVidaProfesional", Number(e.target.value))
                  }
                  className="w-full border border-slate-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Años desempleado
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.aniosDesempleo}
                  onChange={(e) =>
                    actualizar("aniosDesempleo", Number(e.target.value))
                  }
                  className="w-full border border-slate-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Situación laboral actual
              </label>
              <select
                value={form.situacionLaboral}
                onChange={(e) => actualizar("situacionLaboral", e.target.value)}
                className="w-full border border-slate-300 rounded-md p-2"
              >
                {SITUACIONES_LABORALES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </section>

          {/* ============ SECCIÓN 5: EMPLEABILIDAD ============ */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              5. Empleabilidad
            </h2>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={form.primerEmpleo}
                onChange={(e) => actualizar("primerEmpleo", e.target.checked)}
              />
              <span className="text-sm">
                ¿El trabajo actual es su primer empleo?
              </span>
            </label>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tiempo que tardó en conseguir su primer empleo
                </label>
                <select
                  value={form.tiempoPrimerEmpleo}
                  onChange={(e) =>
                    actualizar("tiempoPrimerEmpleo", e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-md p-2"
                >
                  {TIEMPOS_PRIMER_EMPLEO.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cantidad de empleos desde que se tituló
                </label>
                <select
                  value={form.numeroEmpleos}
                  onChange={(e) => actualizar("numeroEmpleos", e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2"
                >
                  {NUMERO_EMPLEOS.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ============ SECCIÓN 5.5: COMPETENCIAS ============ */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-2">
              5.5. Competencias profesionales
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Evalúa cada competencia en dos dimensiones: cuánto la adquiriste
              en tu formación (1-5) y cuánto la requieres en tu puesto actual
              (1-5).
            </p>

            <div className="space-y-6">
              {form.competencias.map((c, i) => (
                <div
                  key={c.nombre}
                  className="border-b border-slate-100 pb-4 last:border-0"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-slate-800">
                      {c.nombre}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        c.tipo === "Técnica"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {c.tipo}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Nivel adquirido en la universidad
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() =>
                              actualizarCompetencia(i, "adquirido", v)
                            }
                            className={`w-9 h-9 rounded-md border text-sm font-semibold transition ${
                              c.adquirido === v
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-slate-700 border-slate-300 hover:border-blue-400"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Nivel requerido en el puesto
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() =>
                              actualizarCompetencia(i, "requerido", v)
                            }
                            className={`w-9 h-9 rounded-md border text-sm font-semibold transition ${
                              c.requerido === v
                                ? "bg-amber-500 text-white border-amber-500"
                                : "bg-white text-slate-700 border-slate-300 hover:border-amber-400"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============ SECCIÓN 6: SATISFACCIÓN ============ */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              6. Satisfacción con la carrera
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Satisfacción global con la formación (1-4)
                </label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={form.satisfaccionCarrera}
                  onChange={(e) =>
                    actualizar("satisfaccionCarrera", Number(e.target.value))
                  }
                  className="w-full border border-slate-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Concordancia con el mercado laboral (1-4)
                </label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={form.concordanciaMercado}
                  onChange={(e) =>
                    actualizar("concordanciaMercado", Number(e.target.value))
                  }
                  className="w-full border border-slate-300 rounded-md p-2"
                />
              </div>
            </div>
          </section>

          {/* ============ SECCIÓN 7: ASPECTOS Y ASIGNATURAS ============ */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              7. Aspectos y asignaturas
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Aspectos de la carrera que le resultaron útiles
              </label>
              <div className="space-y-2">
                {ASPECTOS_UTILES.map((a) => (
                  <label key={a} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.aspectosUtiles.includes(a)}
                      onChange={() => toggleArray("aspectosUtiles", a)}
                      className="mt-1"
                    />
                    <span>{a}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Aspectos que pueden mejorarse
              </label>
              <div className="space-y-2">
                {ASPECTOS_MEJORAR.map((a) => (
                  <label key={a} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.aspectosMejorar.includes(a)}
                      onChange={() => toggleArray("aspectosMejorar", a)}
                      className="mt-1"
                    />
                    <span>{a}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Asignaturas que le dieron ventaja competitiva (máx. 5)
              </label>
              <div className="space-y-2">
                {ASIGNATURAS.map((a) => (
                  <label key={a} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.asignaturasUtiles.includes(a)}
                      onChange={() => toggleArray("asignaturasUtiles", a, 5)}
                      className="mt-1"
                    />
                    <span>{a}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Asignaturas que no le resultaron útiles (máx. 2)
              </label>
              <div className="space-y-2">
                {ASIGNATURAS_INUTILES.map((a) => (
                  <label key={a} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.asignaturasInutiles.includes(a)}
                      onChange={() =>
                        toggleArray("asignaturasInutiles", a, 2)
                      }
                      className="mt-1"
                    />
                    <span>{a}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* ============ SECCIÓN 8: CONTACTO ============ */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              8. Contacto
            </h2>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={form.redContactos}
                onChange={(e) => actualizar("redContactos", e.target.checked)}
              />
              <span className="text-sm">
                ¿Le interesaría formar parte de la red de contactos oficial?
              </span>
            </label>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email de contacto
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => actualizar("email", e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Teléfono (WhatsApp)
                </label>
                <input
                  type="text"
                  value={form.telefono}
                  onChange={(e) => actualizar("telefono", e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  LinkedIn
                </label>
                <input
                  type="text"
                  value={form.linkedin}
                  onChange={(e) => actualizar("linkedin", e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2"
                />
              </div>
            </div>
          </section>

          {/* ============ BOTÓN ENVIAR ============ */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={enviando}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 px-8 rounded-md transition"
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