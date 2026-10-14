import Link from "next/link";

export default function Inicio() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-3">
            Sistema de Análisis de Mercado y Empleabilidad
          </h1>
          <p className="text-lg text-slate-600">
            Ingeniería en Sistemas — Universidad Mayor de San Simón
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Herramienta de recolección y análisis para el proceso de acreditación ARCUSUR
          </p>
        </div>

        {/* Tres opciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Opción 1: Titulado */}
          <Link
            href="/encuesta/titulado"
            className="group rounded-2xl bg-white p-8 shadow-md border border-slate-200 hover:shadow-xl hover:border-blue-400 transition"
          >
            <div className="text-5xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Soy Titulado
            </h2>
            <p className="text-slate-600 text-sm">
              Llena la encuesta de titulados para aportar al análisis de
              formación y empleabilidad.
            </p>
            <div className="mt-6 text-blue-600 font-semibold group-hover:translate-x-1 transition">
              Llenar encuesta →
            </div>
          </Link>

          {/* Opción 2: Empleador */}
          <Link
            href="/encuesta/empleador"
            className="group rounded-2xl bg-white p-8 shadow-md border border-slate-200 hover:shadow-xl hover:border-emerald-400 transition"
          >
            <div className="text-5xl mb-4">🏢</div>
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">
              Soy Empleador
            </h2>
            <p className="text-slate-600 text-sm">
              Completa la encuesta de empleadores para valorar el perfil
              profesional de los titulados.
            </p>
            <div className="mt-6 text-emerald-600 font-semibold group-hover:translate-x-1 transition">
              Llenar encuesta →
            </div>
          </Link>

          {/* Opción 3: Administrador */}
          <Link
            href="/admin"
            className="group rounded-2xl bg-white p-8 shadow-md border border-slate-200 hover:shadow-xl hover:border-amber-400 transition"
          >
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              Administrador
            </h2>
            <p className="text-slate-600 text-sm">
              Accede al panel de análisis, reportes, matrices y exportación de
              datos.
            </p>
            <div className="mt-6 text-amber-600 font-semibold group-hover:translate-x-1 transition">
              Entrar al panel →
            </div>
          </Link>
        </div>

        {/* Pie */}
        <p className="text-center text-xs text-slate-400 mt-12">
          Universidad Mayor de San Simón — Facultad de Ciencias y Tecnología
        </p>
      </div>
    </main>
  );
}