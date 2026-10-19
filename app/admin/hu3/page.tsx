"use client";

import { useEffect, useState } from "react";

interface DatosHU3 {
  ok: boolean;
  totalTitulados: number;
  totalEmpleadores: number;
  nivelPosgradoMap: Record<string, number>;
  fuenteFinanciamientoMap: Record<string, number>;
  tablaContingencia: Record<string, Record<string, number>>;
  nivelFormacionDemandaMap: Record<string, number>;
  areasEmergentesList: string[];
  estadisticaChi: {
    chiCuadrada: number;
    gradosLibertad: number;
    esSignificativo: boolean;
  };
}

/* ------------------------------------------------------------------ */
/*  Paleta y utilidades                                                */
/* ------------------------------------------------------------------ */

const COLOR_PRINCIPAL = "#f59e0b"; // amber-500
const COLOR_SECUNDARIO = "#2563eb"; // blue-600
const COLOR_EXITO = "#10b981"; // emerald-500

const PALETA = [
  "#f59e0b", // amber-500
  "#2563eb", // blue-600
  "#10b981", // emerald-500
  "#7c3aed", // violet-600
  "#e11d48", // rose-600
  "#0891b2", // cyan-600
  "#64748b", // slate-500
  "#db2777", // pink-600
];

const colorPara = (i: number) => PALETA[i % PALETA.length];

const porcentaje = (parte: number, total: number) =>
  total > 0 ? Math.round((parte / total) * 100) : 0;

/* ------------------------------------------------------------------ */
/*  Gráfico 1: Barras horizontales ordenadas                           */
/* ------------------------------------------------------------------ */

function BarrasHorizontales({
  datos,
  total,
  colorBase,
}: {
  datos: Record<string, number>;
  total: number;
  colorBase?: string;
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
            <div className="flex justify-between items-baseline text-xs mb-1 gap-2">
              <span className="font-medium text-slate-700">{etiqueta}</span>
              <span className="text-slate-500 whitespace-nowrap">
                <span className="font-bold text-slate-800">{cantidad}</span> (
                {pct}%)
              </span>
            </div>
            <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${ancho}%`, backgroundColor: color }}
                title={`${etiqueta}: ${cantidad} (${pct}%)`}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Gráfico 2: Mapa de calor para la tabla de contingencia             */
/* ------------------------------------------------------------------ */

function MapaDeCalor({
  tabla,
  columnas,
}: {
  tabla: Record<string, Record<string, number>>;
  columnas: string[];
}) {
  const filas = Object.entries(tabla);
  const valores = filas.flatMap(([, fila]) =>
    columnas.map((c) => fila[c] || 0),
  );
  const maximo = Math.max(1, ...valores);

  const fondoCelda = (valor: number) => {
    const alpha = valor === 0 ? 0 : 0.12 + (valor / maximo) * 0.78;
    return `rgba(245, 158, 11, ${alpha})`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="p-2 text-left font-bold text-slate-700 min-w-[140px]">
              Área de Interés
            </th>
            {columnas.map((f) => (
              <th
                key={f}
                className="p-2 text-center font-bold text-slate-700 min-w-[90px] align-bottom"
              >
                {f}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map(([area, fila]) => (
            <tr key={area}>
              <td className="p-2 font-medium text-slate-800 whitespace-nowrap">
                {area}
              </td>
              {columnas.map((f) => {
                const valor = fila[f] || 0;
                const intenso = maximo > 0 && valor / maximo > 0.6;
                return (
                  <td
                    key={f}
                    className={`p-3 text-center font-bold rounded-md transition-colors ${
                      intenso ? "text-white" : "text-slate-700"
                    }`}
                    style={{ backgroundColor: fondoCelda(valor) }}
                    title={`${area} · ${f}: ${valor}`}
                  >
                    {valor}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-500">
        <span>Menor</span>
        <div
          className="h-2 w-32 rounded-full"
          style={{
            background:
              "linear-gradient(to right, rgba(245,158,11,0.12), rgba(245,158,11,0.9))",
          }}
        />
        <span>Mayor frecuencia</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gráfico 3: Indicador de significancia (chi-cuadrada)               */
/* ------------------------------------------------------------------ */

function IndicadorSignificancia({ significativo }: { significativo: boolean }) {
  const color = significativo ? COLOR_EXITO : COLOR_SECUNDARIO;
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 48 48"
        className="w-12 h-12 shrink-0"
        aria-hidden="true"
      >
        <circle
          cx={24}
          cy={24}
          r={20}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={6}
        />
        <circle
          cx={24}
          cy={24}
          r={20}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={`${significativo ? 125.6 : 62.8} 125.6`}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
        />
        <text
          x={24}
          y={29}
          textAnchor="middle"
          fontSize={16}
          fontWeight={800}
          fill={color}
        >
          {significativo ? "✓" : "–"}
        </text>
      </svg>
      <p
        className={`text-base font-bold leading-snug ${
          significativo ? "text-emerald-600" : "text-blue-900"
        }`}
      >
        {significativo
          ? "Relación Significativa (p < 0.05)"
          : "Distribución Homogénea"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Página principal                                                   */
/* ------------------------------------------------------------------ */

export default function HU3Page() {
  const [datos, setDatos] = useState<DatosHU3 | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/analisis/hu3")
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
        <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <p>Cargando análisis de Formación Continua (HU-03)...</p>
      </div>
    );
  }

  if (!datos || (datos.totalTitulados === 0 && datos.totalEmpleadores === 0)) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          HU-03: Demanda de Formación Continua y Capacidad de Financiamiento
        </h1>
        <p className="text-slate-600 mb-8">
          Evaluación de necesidades de posgrado y capacidad económica de
          financiamiento.
        </p>
        <div className="rounded-xl bg-amber-50 p-6 border border-amber-200 text-amber-800">
          ⚠️ No hay datos registrados sobre posgrados en las encuestas.
        </div>
      </div>
    );
  }

  // Extraer las fuentes de financiamiento únicas para la tabla cruzada
  const fuentesUnicas = Array.from(
    new Set(
      Object.values(datos.tablaContingencia).flatMap((item) =>
        Object.keys(item),
      ),
    ),
  );

  return (
    <div className="space-y-8">
      {/* CABECERA */}
      <div>
        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Historia de Usuario 03
        </span>
        <h1 className="text-3xl font-bold text-blue-900 mt-2 mb-1">
          Demanda de Formación Continua y Capacidad de Financiamiento
        </h1>
        <p className="text-slate-600">
          Viabilidad financiera y áreas estratégicas para programas de posgrado
          con validación estadística (χ²).
        </p>
      </div>

      {/* RESULTADO PRUEBA ESTADÍSTICA CHI-CUADRADA */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Estadístico Chi-Cuadrada (χ²)
          </p>
          <p className="text-3xl font-bold text-amber-600">
            {datos.estadisticaChi.chiCuadrada}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Grados de libertad (df): {datos.estadisticaChi.gradosLibertad}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Independencia Estadística
          </p>
          <IndicadorSignificancia
            significativo={datos.estadisticaChi.esSignificativo}
          />
          <p className="text-xs text-slate-500 mt-2">
            Evaluación entre área de interés y fuente de pago
          </p>
        </div>

        <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
            💡 Decisión Directiva
          </p>
          <p className="text-xs text-amber-800 leading-relaxed">
            Permite a la Dirección de Posgrado FCyT ajustar precios y becas en
            función del método de pago de los interesados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NIVELES DE POSGRADO INTERESADOS */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-1">
            🎓 Niveles de Posgrado Demandados (Titulados)
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Porcentaje sobre el total de titulados encuestados.
          </p>
          <BarrasHorizontales
            datos={datos.nivelPosgradoMap}
            total={datos.totalTitulados}
            colorBase={COLOR_PRINCIPAL}
          />
        </div>

        {/* FUENTES DE FINANCIAMIENTO */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-1">
            💳 Fuentes de Financiamiento Estimadas
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Porcentaje sobre el total de titulados encuestados.
          </p>
          <BarrasHorizontales
            datos={datos.fuenteFinanciamientoMap}
            total={datos.totalTitulados}
            colorBase={COLOR_SECUNDARIO}
          />
        </div>
      </div>

      {/* MAPA DE CALOR: ÁREA DE INTERÉS VS. FUENTE DE FINANCIAMIENTO */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-blue-900 mb-1">
          📊 Área de Interés vs. Fuente de Financiamiento
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Tabla de contingencia. La intensidad del color indica la frecuencia de
          cada combinación.
        </p>
        <MapaDeCalor tabla={datos.tablaContingencia} columnas={fuentesUnicas} />
      </div>

      {/* VALOR PARA ARCUSUR */}
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 text-amber-900">
        <h3 className="font-bold text-sm mb-2">
          📌 Valor para Acreditación ARCUSUR
        </h3>
        <p className="text-xs text-amber-800 leading-relaxed">
          Sustenta la creación de nuevos programas de posgrado (Maestrías y
          Diplomados) en la Dirección de Posgrado FCyT orientados a áreas
          estratégicas (IA, Ciberseguridad, Ciencia de Datos) con respaldo
          financiero de la cohorte.
        </p>
      </div>
    </div>
  );
}
