import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import Link from "next/link";

export const instant = false;

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
      {/* Menú lateral */}
      <aside className="w-64 bg-blue-900 text-white flex-shrink-0">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-lg font-bold leading-tight">
            Panel de Análisis
          </h1>
          <p className="text-xs text-blue-300 mt-1">Ing. Sistemas — UMSS</p>
        </div>

        <nav className="p-4 space-y-1">
          <Link
            href="/admin"
            className="block px-3 py-2 rounded-md text-sm hover:bg-blue-800"
          >
           Dashboard
          </Link>
          <Link
            href="/admin/hu1"
            className="block px-3 py-2 rounded-md text-sm hover:bg-blue-800"
          >
            Antiguedad y empleabilidad
          </Link>
          <Link
            href="/admin/hu2"
            className="block px-3 py-2 rounded-md text-sm hover:bg-blue-800"
          >
            Formación continua
          </Link>
          <Link
            href="/admin/hu3"
            className="block px-3 py-2 rounded-md text-sm hover:bg-blue-800"
          >
            Financiamiento
          </Link>
          <Link
            href="/admin/hu4"
            className="block px-3 py-2 rounded-md text-sm hover:bg-blue-800"
          >
            Competencias
          </Link>
          <Link
            href="/admin/hu5"
            className="block px-3 py-2 rounded-md text-sm hover:bg-blue-800"
          >
            Reportes
          </Link>
          <Link
            href="/admin/importar"
            className="block px-3 py-2 rounded-md text-sm hover:bg-blue-800"
          >
            Importar
          </Link>

          <div className="pt-4 mt-4 border-t border-blue-800">
            <form action="/api/logout" method="POST">
              <button
                type="submit"
                className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-red-700"
              >
                🚪 Cerrar sesión
              </button>
            </form>
          </div>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}