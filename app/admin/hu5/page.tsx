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

/* ------------------------------------------------------------------ */
/*  Utilidades                                                         */
/* ------------------------------------------------------------------ */

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/** Color según el nivel alcanzado sobre una escala de 10 puntos */
const colorNivel10 = (v: number) => {
  if (v >= 8) return "#10b981"; // emerald-500
  if (v >= 6) return "#6366f1"; // indigo-500
  if (v >= 4) return "#f59e0b"; // amber-500
  return "#e11d48"; // rose-600
};

/* ------------------------------------------------------------------ */
/*  Gráfico 1: Medidor semicircular (escala 0 a 5)                     */
/* ------------------------------------------------------------------ */

function MedidorSemicircular({
  valor,
  maximo,
  color,
}: {
  valor: number;
  maximo: number;
  color: string;
}) {
  const fraccion = clamp(valor / maximo, 0, 1);
  const r = 80;
  const cx = 100;
  const cy = 100;

  const puntoEn = (f: number) => {
    const angulo = Math.PI * (1 - f);
    return {
      x: cx + r * Math.cos(angulo),
      y: cy - r * Math.sin(angulo),
    };
  };

  const inicio = puntoEn(0);
  const fin = puntoEn(1);
  const actual = puntoEn(fraccion);

  const arcoFondo = `M ${inicio.x} ${inicio.y} A ${r} ${r} 0 0 1 ${fin.x} ${fin.y}`;
  const arcoValor = `M ${inicio.x} ${inicio.y} A ${r} ${r} 0 0 1 ${actual.x} ${actual.y}`;

  return (
    <svg
      viewBox="0 0 200 120"
      className="w-full max-w-[200px] h-auto mx-auto"
      role="img"
      aria-label={`${valor.toFixed(1)} de ${maximo}`}
    >
      <path
        d={arcoFondo}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth={16}
        strokeLinecap="round"
      />
      {fraccion > 0 && (
        <path
          d={arcoValor}
          fill="none"
          stroke={color}
          strokeWidth={16}
          strokeLinecap="round"
        />
      )}
      <text
        x={cx}
        y={cy - 12}
        textAnchor="middle"
        fontSize={30}
        fontWeight={800}
        fill="#1e1b4b"
      >
        {valor.toFixed(1)}
      </text>
      <text x={20} y={116} textAnchor="middle" fontSize={10} fill="#94a3b8">
        0
      </text>
      <text x={180} y={116} textAnchor="middle" fontSize={10} fill="#94a3b8">
        {maximo}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Gráfico 2: Barras horizontales con escala 0 a 10 y marcas          */
/* ------------------------------------------------------------------ */

function BarrasEscala10({ metricas }: { metricas: [string, MetricaLikert][] }) {
  const ticks = [0, 2, 4, 6, 8, 10];

  return (
    <div>
      <div className="relative">
        {/* Líneas guía de la escala */}
        <div className="absolute inset-0 pointer-events-none">
          {ticks.map((t) => (
            <div
              key={t}
              className="absolute top-0 bottom-0 border-l border-dashed border-slate-200"
              style={{ left: `${(t / 10) * 100}%` }}
            />
          ))}
        </div>

        <ul className="relative space-y-4">
          {metricas.map(([key, item]) => {
            const valor = clamp(item.promedio, 0, 10);
            const color = colorNivel10(valor);
            return (
              <li
                key={key}
                className="border-b border-slate-100 pb-3 last:border-0"
              >
                <div className="flex justify-between items-baseline gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-slate-800">
                    {item.label}
                  </span>
                  <span
                    className="text-xs font-bold whitespace-nowrap"
                    style={{ color }}
                  >
                    {item.promedio.toFixed(2)} / 10 pts
                  </span>
                </div>
                <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(valor / 10) * 100}%`,
                      backgroundColor: color,
                    }}
                    title={`${item.label}: ${item.promedio.toFixed(2)} / 10`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Eje de la escala */}
      <div className="relative h-4 mt-2" aria-hidden="true">
        {ticks.map((t) => (
          <span
            key={t}
            className="absolute text-[10px] text-slate-400 -translate-x-1/2"
            style={{ left: `${(t / 10) * 100}%` }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Leyenda de niveles */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: "#10b981" }}
          />
          Alto (≥ 8)
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: "#6366f1" }}
          />
          Bueno (6 – 7.9)
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: "#f59e0b" }}
          />
          Regular (4 – 5.9)
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: "#e11d48" }}
          />
          Bajo (&lt; 4)
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Página principal                                                   */
/* ------------------------------------------------------------------ */

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

  const metricasOrdenadas = Object.entries(datos.metricasLikertEmpleadores);

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

      {/* KPI DE SATISFACCIÓN Y CONCORDANCIA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Satisfacción General de Titulados
          </p>
          <MedidorSemicircular
            valor={datos.satisfaccionPromedioTitulados}
            maximo={5}
            color="#4338ca"
          />
          <p className="text-xs text-slate-400 text-center mt-2">
            Evaluación de la cohorte activa sobre la carrera (escala de 5 pts)
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Concordancia con el Mercado Laboral
          </p>
          <MedidorSemicircular
            valor={datos.concordanciaPromedioTitulados}
            maximo={5}
            color="#10b981"
          />
          <p className="text-xs text-slate-400 text-center mt-2">
            Pertinencia laboral percibida por los graduados (escala de 5 pts)
          </p>
        </div>
      </div>

      {/* EVALUACIÓN LIKERT DE EMPLEADORES */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-blue-900 mb-1">
          🏢 Calificación del Sector Empleador
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Promedios obtenidos de las {datos.totalEmpleadores} empresas
          encuestadas (Escala Likert 1 a 10).
        </p>

        <BarrasEscala10 metricas={metricasOrdenadas} />
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
