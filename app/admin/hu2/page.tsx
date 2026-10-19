"use client";

import { useEffect, useState } from "react";

interface DatosHU2 {
  ok: boolean;
  totalTitulados: number;
  totalEmpleadores: number;
  tiempoPrimerEmpleo: Record<string, number>;
  situacionLaboral: Record<string, number>;
  contratacionPorRubro: Record<string, number>;
  tamanoEmpresas: Record<string, number>;
  proyeccionContratacion: Record<string, number>;
  haContratado5Anios: {
    si: number;
    no: number;
  };
}

/* ------------------------------------------------------------------ */
/*  Paleta y utilidades                                                */
/* ------------------------------------------------------------------ */

const PALETA = [
  "#10b981", // emerald-500
  "#2563eb", // blue-600
  "#7c3aed", // violet-600
  "#f59e0b", // amber-500
  "#e11d48", // rose-600
  "#0891b2", // cyan-600
  "#64748b", // slate-500
  "#db2777", // pink-600
];

const colorPara = (i: number) => PALETA[i % PALETA.length];

const porcentaje = (parte: number, total: number) =>
  total > 0 ? Math.round((parte / total) * 100) : 0;

/* ------------------------------------------------------------------ */
/*  Gráfico 1: Barras horizontales con ranking                         */
/* ------------------------------------------------------------------ */

function BarrasHorizontales({
  datos,
  total,
  colorBase,
  sufijo = "",
  unidad = "",
}: {
  datos: Record<string, number>;
  total: number;
  colorBase?: string;
  sufijo?: string;
  unidad?: string;
}) {
  const entradas = Object.entries(datos).sort((a, b) => b[1] - a[1]);
  const maximo = Math.max(1, ...entradas.map(([, v]) => v));

  return (
    <ul className="space-y-3">
      {entradas.map(([etiqueta, cantidad], i) => {
        const pct = porcentaje(cantidad, total);
        const ancho = (cantidad / maximo) * 100;
        const color = colorBase ?? colorPara(i);
        return (
          <li key={etiqueta}>
            <div className="flex justify-between items-baseline text-xs mb-1">
              <span className="font-medium text-slate-700 pr-2">
                {etiqueta}
              </span>
              <span className="text-slate-500 whitespace-nowrap">
                <span className="font-bold text-slate-800">
                  {cantidad}
                  {unidad}
                </span>{" "}
                ({pct}%{sufijo})
              </span>
            </div>
            <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${ancho}%`, backgroundColor: color }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Gráfico 2: Donut con leyenda                                       */
/* ------------------------------------------------------------------ */

function Donut({
  datos,
  centro,
  subtitulo,
}: {
  datos: Record<string, number>;
  centro: number | string;
  subtitulo?: string;
}) {
  const entradas = Object.entries(datos).filter(([, v]) => v > 0);
  const total = entradas.reduce((acc, [, v]) => acc + v, 0);
  const radio = 40;
  const circunferencia = 2 * Math.PI * radio;

  let acumulado = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle
            cx={50}
            cy={50}
            r={radio}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={12}
          />
          {total > 0 &&
            entradas.map(([etiqueta, valor], i) => {
              const longitud = (valor / total) * circunferencia;
              const offset = -acumulado;
              acumulado += longitud;
              return (
                <circle
                  key={etiqueta}
                  cx={50}
                  cy={50}
                  r={radio}
                  fill="none"
                  stroke={colorPara(i)}
                  strokeWidth={12}
                  strokeDasharray={`${longitud} ${circunferencia - longitud}`}
                  strokeDashoffset={offset}
                  transform="rotate(-90 50 50)"
                >
                  <title>{`${etiqueta}: ${valor} (${porcentaje(valor, total)}%)`}</title>
                </circle>
              );
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold text-blue-900 leading-none">
            {centro}
          </span>
          {subtitulo && (
            <span className="text-[10px] text-slate-500 mt-1">{subtitulo}</span>
          )}
        </div>
      </div>

      <ul className="space-y-2 text-xs w-full">
        {entradas.map(([etiqueta, valor], i) => (
          <li
            key={etiqueta}
            className="flex items-center justify-between gap-3 text-slate-700"
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: colorPara(i) }}
              />
              <span className="font-medium">{etiqueta}</span>
            </span>
            <span className="text-slate-500 whitespace-nowrap">
              {valor} ({porcentaje(valor, total)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gráfico 3: Columnas verticales (tiempo al primer empleo)           */
/* ------------------------------------------------------------------ */

function ColumnasVerticales({
  datos,
  total,
  color,
}: {
  datos: Record<string, number>;
  total: number;
  color: string;
}) {
  const entradas = Object.entries(datos);
  const maximo = Math.max(1, ...entradas.map(([, v]) => v));
  const altoMax = 120;

  return (
    <div className="flex items-end justify-around gap-2 h-44 pt-4">
      {entradas.map(([etiqueta, cantidad]) => {
        const altura = (cantidad / maximo) * altoMax;
        return (
          <div
            key={etiqueta}
            className="flex flex-col items-center flex-1 min-w-0 h-full justify-end"
          >
            <span className="text-xs font-bold text-slate-800 mb-1">
              {cantidad}
            </span>
            <span className="text-[10px] text-slate-500 mb-1">
              {porcentaje(cantidad, total)}%
            </span>
            <div
              className="w-full max-w-[56px] rounded-t-md transition-all duration-700"
              style={{
                height: `${Math.max(altura, cantidad > 0 ? 4 : 0)}px`,
                backgroundColor: color,
              }}
              title={`${etiqueta}: ${cantidad}`}
            />
            <span className="text-[10px] text-slate-600 mt-2 text-center leading-tight">
              {etiqueta}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gráfico 4: Medidor semicircular (% de empresas contratantes)       */
/* ------------------------------------------------------------------ */

function MedidorSemicircular({ valor }: { valor: number }) {
  const v = Math.max(0, Math.min(100, valor));
  const r = 80;
  const cx = 100;
  const cy = 100;

  const puntoEn = (fraccion: number) => {
    const angulo = Math.PI * (1 - fraccion);
    return {
      x: cx + r * Math.cos(angulo),
      y: cy - r * Math.sin(angulo),
    };
  };

  const inicio = puntoEn(0);
  const fin = puntoEn(1);
  const actual = puntoEn(v / 100);

  const arcoFondo = `M ${inicio.x} ${inicio.y} A ${r} ${r} 0 0 1 ${fin.x} ${fin.y}`;
  const arcoValor = `M ${inicio.x} ${inicio.y} A ${r} ${r} 0 0 1 ${actual.x} ${actual.y}`;

  return (
    <svg
      viewBox="0 0 200 120"
      className="w-full max-w-[220px] h-auto mx-auto"
      aria-hidden="true"
    >
      <path
        d={arcoFondo}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth={16}
        strokeLinecap="round"
      />
      {v > 0 && (
        <path
          d={arcoValor}
          fill="none"
          stroke="#10b981"
          strokeWidth={16}
          strokeLinecap="round"
        />
      )}
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fontSize={28}
        fontWeight={800}
        fill="#1e3a8a"
      >
        {v}%
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Página principal                                                   */
/* ------------------------------------------------------------------ */

export default function HU2Page() {
  const [datos, setDatos] = useState<DatosHU2 | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/analisis/hu2")
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
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p>Cargando datos de inserción laboral (HU-02)...</p>
      </div>
    );
  }

  if (!datos || (datos.totalTitulados === 0 && datos.totalEmpleadores === 0)) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          HU-02: Mapeo de Inserción Laboral y Perfil de Contratación
        </h1>
        <p className="text-slate-600 mb-8">
          Análisis de absorción laboral, tiempo para el primer empleo y demanda
          por sectores.
        </p>
        <div className="rounded-xl bg-amber-50 p-6 border border-amber-200 text-amber-800">
          ⚠️ No hay datos registrados en las encuestas de titulados ni de
          empleadores.
        </div>
      </div>
    );
  }

  const porcentajeContratacion = porcentaje(
    datos.haContratado5Anios.si,
    datos.totalEmpleadores,
  );

  return (
    <div className="space-y-8">
      {/* CABECERA */}
      <div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Historia de Usuario 02
        </span>
        <h1 className="text-3xl font-bold text-blue-900 mt-2 mb-1">
          Mapeo de Inserción Laboral y Perfil de Contratación
        </h1>
        <p className="text-slate-600">
          Velocidad de inserción al primer empleo y demanda laboral según rubro
          y tamaño de empresa.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Empresas Contratantes
          </p>
          <div className="flex-1 flex items-center justify-center">
            <MedidorSemicircular valor={porcentajeContratacion} />
          </div>
          <p className="text-xs text-slate-500 text-center mt-1">
            Han contratado titulados en los últimos 5 años
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Muestra de Titulados
          </p>
          <p className="text-3xl font-bold text-blue-900">
            {datos.totalTitulados}
          </p>
          <p className="text-xs text-slate-500 mt-2">Respuestas procesadas</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Muestra de Empleadores
          </p>
          <p className="text-3xl font-bold text-purple-700">
            {datos.totalEmpleadores}
          </p>
          <p className="text-xs text-slate-500 mt-2">Empresas encuestadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TIEMPO HASTA EL PRIMER EMPLEO */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-1">
            ⏱️ Tiempo de consecución del Primer Empleo
          </h2>
          <p className="text-xs text-slate-500 mb-2">
            Distribución de titulados por tiempo transcurrido.
          </p>
          <ColumnasVerticales
            datos={datos.tiempoPrimerEmpleo}
            total={datos.totalTitulados}
            color="#10b981"
          />
        </div>

        {/* SITUACIÓN LABORAL ACTUAL */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-1">
            💼 Situación Laboral Actual
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Estado laboral de los titulados encuestados.
          </p>
          <Donut
            datos={datos.situacionLaboral}
            centro={datos.totalTitulados}
            subtitulo="titulados"
          />
        </div>

        {/* DEMANDA POR RUBRO / SECTOR */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-1">
            🏢 Contratación por Rubro / Sector
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Empresas agrupadas por sector económico.
          </p>
          <BarrasHorizontales
            datos={datos.contratacionPorRubro}
            total={datos.totalEmpleadores}
            sufijo=" empresas"
            colorBase="#7c3aed"
          />
        </div>

        {/* TAMAÑO DE EMPRESAS Y PROYECCIÓN */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-blue-900 mb-1">
              📊 Tamaño de Empresas Contratantes
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Proporción de empresas según su tamaño.
            </p>
            <Donut
              datos={datos.tamanoEmpresas}
              centro={datos.totalEmpleadores}
              subtitulo="empresas"
            />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-blue-900 mb-3">
              Proyección de Contratación Futura
            </h3>
            <BarrasHorizontales
              datos={datos.proyeccionContratacion}
              total={datos.totalEmpleadores}
              sufijo=" empresas"
              colorBase="#2563eb"
            />
          </div>
        </div>
      </div>

      {/* VALOR ARCUSUR */}
      <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 text-emerald-900">
        <h3 className="font-bold text-sm mb-2">
          📌 Valor para Acreditación ARCUSUR
        </h3>
        <p className="text-xs text-emerald-800 leading-relaxed">
          Demuestra la pertinencia del título frente a las necesidades del
          entorno socioeconómico regional y nacional, justificando la tasa de
          absorción en el sector productivo.
        </p>
      </div>
    </div>
  );
}
