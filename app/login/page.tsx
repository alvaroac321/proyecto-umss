"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginAdmin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const datos = await respuesta.json();

      if (datos.ok) {
        router.push("/admin");
      } else {
        setError("Contraseña incorrecta");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 p-8">
        <Link href="/" className="text-blue-600 text-sm hover:underline">
          ← Volver al inicio
        </Link>

        <h1 className="text-2xl font-bold text-blue-900 mt-4 mb-2">
          Acceso Administrador
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          Ingresa la contraseña para acceder al panel de análisis.
        </p>

        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-md p-2 text-slate-900 bg-white"
              placeholder="••••••••"
              autoFocus
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-md transition"
          >
            {cargando ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}