"use client";

import { useEffect, useState } from "react";

interface MetricaLikert {
  label: string;
  promedio: number;
}

interface DatosHU5 {
  ok: boolean;
  totalTitulados: number;
  totalEmpleadores: number;
  satisfaccionPromedioTitulados: number;
  concordanciaPromedioTitulados: number;
  metricasLikertEmpleadores: Record<string, MetricaLikert>;
}

export default function HU5Page() {
  const [datos, setDatos] = useState<DatosHU5 | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/analisis/hu5")
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
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p>Cargando percepción de Calidad Institucional (HU-05)...</p>
      </div>
    );
  }

  if (!datos || (datos.totalTitulados === 0 && datos.totalEmpleadores === 0)) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          HU-05: Percepción de Calidad Institucional y Desempeño del Egresado
        </h1>
        <p className="text-slate-600 mb-8">
          Evaluación de imagen institucional y desempeño profesional desde la
          visión del mercado laboral.
        </p>
        <div className="rounded-xl bg-amber-50 p-6 border border-amber-200 text-amber-800">
          ⚠️ No hay encuestas registradas para analizar la calidad
          institucional.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* CABECERA */}
      <div>
        <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Historia de Usuario 05
        </span>
        <h1 className="text-3xl font-bold text-blue-900 mt-2 mb-1">
          Percepción de Calidad Institucional y Desempeño
        </h1>
        <p className="text-slate-600">
          Valoración de la imagen universitaria, ética, valores y coherencia del
          perfil de egreso.
        </p>
      </div>

      {/* TARJETAS KPI DE SATISFACCIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Satisfacción General de Titulados
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-indigo-900">
              {datos.satisfaccionPromedioTitulados.toFixed(1)}
            </span>
            <span className="text-slate-500 font-medium">/ 5 pts</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Evaluación de la cohorte activa sobre la carrera
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Concordancia con el Mercado Laboral
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-emerald-600">
              {datos.concordanciaPromedioTitulados.toFixed(1)}
            </span>
            <span className="text-slate-500 font-medium">/ 5 pts</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Pertinencia laboral percibida por los graduados
          </p>
        </div>
      </div>

      {/* EVALUACIÓN LIKERT DE EMPLEADORES */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-blue-900 mb-2">
          🏢 Calificación del Sector Empleador
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Promedios obtenidos de las {datos.totalEmpleadores} empresas
          encuestadas (Escala Likert 1 a 10).
        </p>

        <div className="space-y-4">
          {Object.entries(datos.metricasLikertEmpleadores).map(
            ([key, item]) => {
              const porcentaje = Math.min(
                100,
                Math.max(0, (item.promedio / 10) * 100),
              );
              return (
                <div
                  key={key}
                  className="border-b border-slate-100 pb-3 last:border-0"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-slate-800">
                      {item.label}
                    </span>
                    <span className="text-xs font-bold text-indigo-700">
                      {item.promedio.toFixed(2)} / 10 pts
                    </span>
                  </div>
                  <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* VALOR PARA ARCUSUR */}
      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 text-indigo-900">
        <h3 className="font-bold text-sm mb-2">
          📌 Valor para Acreditación ARCUSUR
        </h3>
        <p className="text-xs text-indigo-800 leading-relaxed">
          Valida formalmente el cumplimiento del perfil de egreso declarado,
          demostrando que los titulados responden a los estándares éticos, de
          responsabilidad social y excelencia técnica exigidos en el proceso de
          acreditación.
        </p>
      </div>
    </div>
  );
}
