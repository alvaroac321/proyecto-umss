"use client";

import Link from "next/link";

const HISTORIAS_USUARIO = [
  {
    id: "hu1",
    codigo: "HU-01",
    titulo: "Brechas de Competencias",
    descripcion:
      "Gap Analysis: Comparativa entre nivel Adquirido en la universidad vs. Requerido en el mercado.",
    icono: "📊",
    color: "border-blue-200 bg-blue-50/50 hover:border-blue-400",
  },
  {
    id: "hu2",
    codigo: "HU-02",
    titulo: "Inserción Laboral",
    descripcion:
      "Absorción laboral por rubro, tamaño de empresa y tiempo de consecución del primer empleo.",
    icono: "💼",
    color: "border-emerald-200 bg-emerald-50/50 hover:border-emerald-400",
  },
  {
    id: "hu3",
    codigo: "HU-03",
    titulo: "Formación Continua y Financiamiento",
    descripcion:
      "Demanda de posgrados vs. capacidad de pago con prueba estadística Chi-Cuadrada (χ²).",
    icono: "🎓",
    color: "border-amber-200 bg-amber-50/50 hover:border-amber-400",
  },
  {
    id: "hu4",
    codigo: "HU-04",
    titulo: "Pertinencia Curricular",
    descripcion:
      "Ranking de materias de mayor ventaja competitiva vs. asignaturas a reestructurar.",
    icono: "📚",
    color: "border-purple-200 bg-purple-50/50 hover:border-purple-400",
  },
  {
    id: "hu5",
    codigo: "HU-05",
    titulo: "Percepción de Calidad Institucional",
    descripcion:
      "Evaluación del perfil de egreso, ética y confianza vista por los Empleadores.",
    icono: "🌟",
    color: "border-indigo-200 bg-indigo-50/50 hover:border-indigo-400",
  },
  {
    id: "hu6",
    codigo: "HU-06",
    titulo: "Reportes y Exportación",
    descripcion:
      "Consolidación de datos primarios y exportación limpia a formatos CSV/Excel para ARCUSUR.",
    icono: "📄",
    color: "border-rose-200 bg-rose-50/50 hover:border-rose-400",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Panel de Trabajo y Análisis
        </h1>
        <p className="text-slate-600">
          Herramienta de soporte para las decisiones de acreditación académica
          ARCUSUR — Carrera de Ingeniería en Sistemas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HISTORIAS_USUARIO.map((hu) => (
          <Link
            key={hu.id}
            href={`/admin/${hu.id}`}
            className={`block p-6 rounded-xl border transition shadow-sm hover:shadow-md ${hu.color}`}
          >
            <div className="text-3xl mb-3">{hu.icono}</div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {hu.codigo}
            </span>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              {hu.titulo}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {hu.descripcion}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
