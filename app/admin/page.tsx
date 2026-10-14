import Link from "next/link";

export default function AdminInicio() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-2">
        Panel de trabajo
      </h1>
      <p className="text-slate-600 mb-8">
        Bienvenido al panel de análisis. Selecciona un módulo del menú lateral.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { href: "/admin/hu1", titulo: "HU1: Antiguedad y empleabilidad", icono: "📈" },
          { href: "/admin/hu2", titulo: "HU2: Formación continua", icono: "📚" },
          { href: "/admin/hu3", titulo: "HU3: Financiamiento", icono: "💰" },
          { href: "/admin/hu4", titulo: "HU4: Competencias", icono: "🎯" },
          { href: "/admin/hu5", titulo: "HU5: Reportes", icono: "📋" },
          { href: "/admin/importar", titulo: "Importar Excel", icono: "📥" },
        ].map((modulo) => (
          <Link
            key={modulo.href}
            href={modulo.href}
            className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-400 transition"
          >
            <div className="text-4xl mb-3">{modulo.icono}</div>
            <h2 className="font-bold text-slate-800">{modulo.titulo}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}