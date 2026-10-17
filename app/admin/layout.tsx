import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import Link from "next/link";

export const instant = false;

const MENU_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icono: "📊",
  },
  {
    href: "/admin/hu1",
    label: "Brechas de Competencias",
    icono: "🎯",
  },
  {
    href: "/admin/hu2",
    label: "Inserción Laboral",
    icono: "💼",
  },
  {
    href: "/admin/hu3",
    label: "Formación Continua",
    icono: "🎓",
  },
  {
    href: "/admin/hu4",
    label: "Pertinencia Curricular",
    icono: "📚",
  },
  {
    href: "/admin/hu5",
    label: "Calidad Institucional",
    icono: "🌟",
  },
  {
    href: "/admin/hu6",
    label: "Reportes y Exportación",
    icono: "📄",
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    redirect("/login");
  }

  const sesion = await verificarToken(token);
  if (!sesion) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* MENÚ LATERAL REDISEÑADO */}
      <aside className="w-72 bg-blue-900 text-white flex flex-col justify-between p-6 shrink-0 shadow-lg">
        <div>
          {/* CABECERA */}
          <div className="mb-8 border-b border-blue-800/80 pb-5">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Panel de Análisis
            </h1>
            <p className="text-sm font-medium text-blue-200 mt-1">
              Ing. Sistemas — UMSS
            </p>
          </div>

          {/* NAVEGACIÓN PRINCIPAL */}
          <nav className="space-y-2">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-blue-100 hover:bg-blue-800 hover:text-white transition-all duration-150"
              >
                <span className="text-lg">{item.icono}</span>
                <span className="leading-snug">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* CERRAR SESIÓN (MANTENIENDO FORMULARIO POST /api/logout) */}
        <div className="pt-6 border-t border-blue-800/80">
          <form action="/api/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-200 hover:text-white hover:bg-rose-900/50 rounded-xl transition-all duration-150 text-left"
            >
              <span className="text-lg">🚪</span>
              <span>Cerrar sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
