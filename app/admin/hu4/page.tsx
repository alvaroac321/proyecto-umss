"use client";

import { useEffect, useState } from "react";

interface DatosHU4 {
  ok: boolean;
  totalTitulados: number;
  asignaturasUtiles: Record<string, number>;
  asignaturasInutiles: Record<string, number>;
  aspectosUtiles: Record<string, number>;
  aspectosMejorar: Record<string, number>;
}

export default function HU4Page() {
  const [datos, setDatos] = useState<DatosHU4 | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/analisis/hu4")
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
        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p>Cargando análisis de Pertinencia Curricular (HU-04)...</p>
      </div>
    );
  }

  if (!datos || datos.totalTitulados === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          HU-04: Evaluación de Pertinencia Curricular y Rendimiento del Plan de
          Estudios
        </h1>
        <p className="text-slate-600 mb-8">
          Ranking de materias clave y aspectos metodológicos declarados por los
          egresados.
        </p>
        <div className="rounded-xl bg-amber-50 p-6 border border-amber-200 text-amber-800">
          ⚠️ No hay encuestas de titulados registradas en el sistema.
        </div>
      </div>
    );
  }

  // Ordenar asignaturas por frecuencia
  const topUtiles = Object.entries(datos.asignaturasUtiles)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topInutiles = Object.entries(datos.asignaturasInutiles)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="space-y-8">
      {/* CABECERA */}
      <div>
        <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Historia de Usuario 04
        </span>
        <h1 className="text-3xl font-bold text-blue-900 mt-2 mb-1">
          Evaluación de Pertinencia Curricular y Plan de Estudios
        </h1>
        <p className="text-slate-600">
          Identificación empírica de materias con mayor valor profesional y
          asignaturas sujetas a reestructuración.
        </p>
      </div>

      {/* KPI MUESTRA */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Muestra Evaluada
        </p>
        <p className="text-3xl font-bold text-purple-900">
          {datos.totalTitulados}{" "}
          <span className="text-sm font-normal text-slate-500">
            Respuestas de Titulados Procesadas
          </span>
        </p>
      </div>

      {/* RANKINGS DE ASIGNATURAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP ASIGNATURAS UTILES */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-emerald-700 mb-4 flex items-center gap-2">
            <span>⭐</span> Asignaturas de Mayor Pertinencia y Utilidad
          </h2>
          <div className="space-y-3">
            {topUtiles.length > 0 ? (
              topUtiles.map(([malla, cantidad], idx) => {
                const porcentaje = Math.round(
                  (cantidad / datos.totalTitulados) * 100,
                );
                return (
                  <div key={malla}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>
                        <strong className="text-emerald-700">#{idx + 1}</strong>{" "}
                        {malla}
                      </span>
                      <span className="font-bold text-slate-800">
                        {cantidad} menciones ({porcentaje}%)
                      </span>
                    </div>
                    <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400">
                Sin registros de asignaturas.
              </p>
            )}
          </div>
        </div>

        {/* TOP ASIGNATURAS A REVISAR */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-rose-700 mb-4 flex items-center gap-2">
            <span>⚠️</span> Asignaturas a Reorganizar / Actualizar
          </h2>
          <div className="space-y-3">
            {topInutiles.length > 0 ? (
              topInutiles.map(([malla, cantidad], idx) => {
                const porcentaje = Math.round(
                  (cantidad / datos.totalTitulados) * 100,
                );
                return (
                  <div key={malla}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>
                        <strong className="text-rose-600">#{idx + 1}</strong>{" "}
                        {malla}
                      </span>
                      <span className="font-bold text-slate-800">
                        {cantidad} menciones ({porcentaje}%)
                      </span>
                    </div>
                    <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400">
                Sin observaciones registradas.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ASPECTOS PEDAGÓGICOS Y METODOLÓGICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-3">
            ✅ Aspectos Fortalezas de la Carrera
          </h2>
          <div className="space-y-2">
            {Object.entries(datos.aspectosUtiles).length > 0 ? (
              Object.entries(datos.aspectosUtiles).map(
                ([aspecto, cantidad]) => (
                  <div
                    key={aspecto}
                    className="flex justify-between text-xs p-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <span className="font-medium text-slate-700">
                      {aspecto}
                    </span>
                    <span className="font-bold text-blue-800">
                      {cantidad} votos
                    </span>
                  </div>
                ),
              )
            ) : (
              <p className="text-xs text-slate-400">
                Sin aspectos registrados.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-3">
            🔧 Aspectos Metodológicos a Mejorar
          </h2>
          <div className="space-y-2">
            {Object.entries(datos.aspectosMejorar).length > 0 ? (
              Object.entries(datos.aspectosMejorar).map(
                ([aspecto, cantidad]) => (
                  <div
                    key={aspecto}
                    className="flex justify-between text-xs p-3 rounded-lg bg-amber-50/50 border border-amber-100"
                  >
                    <span className="font-medium text-slate-700">
                      {aspecto}
                    </span>
                    <span className="font-bold text-amber-800">
                      {cantidad} votos
                    </span>
                  </div>
                ),
              )
            ) : (
              <p className="text-xs text-slate-400">
                Sin observaciones a mejorar.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* VALOR PARA ARCUSUR */}
      <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 text-purple-900">
        <h3 className="font-bold text-sm mb-2">
          📌 Valor para Acreditación ARCUSUR
        </h3>
        <p className="text-xs text-purple-800 leading-relaxed">
          Otorga evidencia empírica directa reportada por la cohorte activa para
          la toma de decisiones en el Comité Académico y justifica la
          actualización de planes analíticos.
        </p>
      </div>
    </div>
  );
}
