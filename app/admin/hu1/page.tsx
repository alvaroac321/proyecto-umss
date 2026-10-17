"use client";

import { useEffect, useState } from "react";

interface CompetenciaAnalisis {
  nombre: string;
  tipo: "Técnica" | "Transversal";
  promedioAdquirido: number;
  promedioRequerido: number;
  brecha: number;
}

interface DatosHU1 {
  ok: boolean;
  totalTitulados: number;
  totalEmpleadores: number;
  promedioBrechaGlobal: number;
  competenciaMayorBrecha: {
    nombre: string;
    brecha: number;
  } | null;
  percepcionEmpleadores: {
    promedioLikertCompetencias: number;
    habilidadesDemandedas: string[];
  };
  competencias: CompetenciaAnalisis[];
}

export default function HU1Page() {
  const [datos, setDatos] = useState<DatosHU1 | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/analisis/hu1")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setDatos(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <div className="flex items-center gap-3 text-slate-600 py-10">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p>Cargando análisis de brechas de competencias (HU-01)...</p>
      </div>
    );
  }

  if (!datos || datos.totalTitulados === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          HU-01: Diagnóstico de Brechas de Competencias (Gap Analysis)
        </h1>
        <p className="text-slate-600 mb-8">
          Cuantificación de la diferencia entre competencias adquiridas y
          requeridas por el mercado laboral.
        </p>
        <div className="rounded-xl bg-amber-50 p-6 border border-amber-200 text-amber-800">
          ⚠️ No hay suficientes datos registrados. Registra al menos un
          formulario de titulados para visualizar los datos.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* CABECERA DE LA HISTORIA DE USUARIO */}
      <div>
        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Historia de Usuario 01
        </span>
        <h1 className="text-3xl font-bold text-blue-900 mt-2 mb-1">
          Diagnóstico de Brechas de Competencias (Gap Analysis)
        </h1>
        <p className="text-slate-600">
          Evaluación del nivel Adquirido en la universidad vs. Requerido en el
          ejercicio profesional (14 competencias técnicas y transversales).
        </p>
      </div>

      {/* TARJETAS DE INDICADORES / KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Muestra Analizada
          </p>
          <p className="text-3xl font-bold text-blue-900">
            {datos.totalTitulados}{" "}
            <span className="text-sm font-normal text-slate-500">
              Titulados
            </span>
          </p>
          <p className="text-xs text-slate-400 mt-2">
            y {datos.totalEmpleadores} Empleadores
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Brecha Promedio Global
          </p>
          <p className="text-3xl font-bold text-amber-600">
            {datos.promedioBrechaGlobal > 0
              ? `+${datos.promedioBrechaGlobal.toFixed(2)}`
              : datos.promedioBrechaGlobal.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Promedio (Requerido - Adquirido)
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 md:col-span-2">
          <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
            ⚠️ Índice de Brecha Máxima (Punto Crítico)
          </p>
          <p className="text-xl font-bold text-slate-800">
            {datos.competenciaMayorBrecha?.nombre || "N/A"}
          </p>
          <p className="text-sm font-semibold text-rose-600 mt-1">
            Diferencia:{" "}
            {datos.competenciaMayorBrecha
              ? `+${datos.competenciaMayorBrecha.brecha.toFixed(2)} pts`
              : "N/A"}
          </p>
        </div>
      </div>

      {/* PANEL PRINCIPAL DE BARRAS COMPARATIVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-blue-900">
              Nivel Adquirido vs. Nivel Requerido
            </h2>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-700">
                <span className="w-3 h-3 bg-blue-600 rounded-sm"></span>{" "}
                Adquirido
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>{" "}
                Requerido
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {datos.competencias.map((c) => (
              <div
                key={c.nombre}
                className="border-b border-slate-100 pb-3 last:border-0"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-800">
                    {c.nombre}{" "}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        c.tipo === "Técnica"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {c.tipo}
                    </span>
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      c.brecha > 0.8
                        ? "text-rose-600"
                        : c.brecha > 0
                          ? "text-amber-600"
                          : "text-emerald-600"
                    }`}
                  >
                    Brecha:{" "}
                    {c.brecha > 0
                      ? `+${c.brecha.toFixed(2)}`
                      : c.brecha.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>Adquirido:</span>
                      <span className="font-semibold text-slate-700">
                        {c.promedioAdquirido.toFixed(2)} / 5
                      </span>
                    </div>
                    <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${(c.promedioAdquirido / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>Requerido:</span>
                      <span className="font-semibold text-slate-700">
                        {c.promedioRequerido.toFixed(2)} / 5
                      </span>
                    </div>
                    <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${(c.promedioRequerido / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LADO DERECHO: DATOS DE EMPLEADORES Y VALOR PARA ARCUSUR */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-blue-900 mb-3">
              Percepción del Sector Empleador
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Valoración promedio en competencias (Likert 1-5).
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-extrabold text-blue-900">
                {datos.percepcionEmpleadores.promedioLikertCompetencias.toFixed(
                  1,
                )}
              </div>
              <div>
                <div className="text-xs text-slate-400">Escala 1 al 5</div>
                <div className="text-sm font-semibold text-emerald-600">
                  {datos.percepcionEmpleadores.promedioLikertCompetencias >= 4
                    ? "Satisfactorio"
                    : "En Observación"}
                </div>
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Habilidades Requeridas por Empresas:
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {datos.percepcionEmpleadores.habilidadesDemandedas.length > 0 ? (
                datos.percepcionEmpleadores.habilidadesDemandedas.map(
                  (txt, idx) => (
                    <li
                      key={idx}
                      className="bg-slate-50 p-2.5 rounded border border-slate-100 italic"
                    >
                      "{txt}"
                    </li>
                  ),
                )
              ) : (
                <li className="text-slate-400">
                  Sin habilidades registradas por empleadores.
                </li>
              )}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-blue-900">
            <h3 className="font-bold text-sm mb-2">
              📌 Valor para Acreditación ARCUSUR
            </h3>
            <p className="text-xs text-blue-800 leading-relaxed">
              Justifica directamente los rediseños curriculares y las
              actualizaciones en los contenidos analíticos para aquellas
              competencias con mayor brecha detectada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
