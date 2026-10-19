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

/* ------------------------------------------------------------------ */
/*  Constantes y utilidades de visualización                           */
/* ------------------------------------------------------------------ */

const COLOR_ADQUIRIDO = "#2563eb"; // blue-600
const COLOR_REQUERIDO = "#f59e0b"; // amber-500
const COLOR_CRITICO = "#e11d48"; // rose-600
const COLOR_MODERADO = "#f59e0b"; // amber-500
const COLOR_ADECUADO = "#10b981"; // emerald-500

const SVG_W = 500;
const SVG_PAD = 14;

/** Convierte un valor de la escala Likert 0-5 a una coordenada X dentro del SVG */
const escalaX = (valor: number) => {
  const v = Math.max(0, Math.min(5, valor));
  return SVG_PAD + (v / 5) * (SVG_W - SVG_PAD * 2);
};

const formatBrecha = (b: number) => (b > 0 ? `+${b.toFixed(2)}` : b.toFixed(2));

const getSeveridad = (brecha: number) => {
  if (brecha > 0.8) {
    return {
      etiqueta: "Crítica",
      color: COLOR_CRITICO,
      texto: "text-rose-600",
      fondo: "bg-rose-50",
    };
  }
  if (brecha > 0) {
    return {
      etiqueta: "Moderada",
      color: COLOR_MODERADO,
      texto: "text-amber-600",
      fondo: "bg-amber-50",
    };
  }
  return {
    etiqueta: "Adecuada",
    color: COLOR_ADECUADO,
    texto: "text-emerald-600",
    fondo: "bg-emerald-50",
  };
};

/* ------------------------------------------------------------------ */
/*  Gráfico 1: Dumbbell (adquirido vs requerido) por competencia       */
/* ------------------------------------------------------------------ */

function FilaCompetencia({ c }: { c: CompetenciaAnalisis }) {
  const sev = getSeveridad(c.brecha);
  const xAdq = escalaX(c.promedioAdquirido);
  const xReq = escalaX(c.promedioRequerido);
  const escalaTicks = [0, 1, 2, 3, 4, 5];

  return (
    <div className="py-4 border-b border-slate-100 last:border-0">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800">{c.nombre}</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              c.tipo === "Técnica"
                ? "bg-blue-100 text-blue-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {c.tipo}
          </span>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-md ${sev.fondo} ${sev.texto}`}
        >
          Brecha {formatBrecha(c.brecha)} · {sev.etiqueta}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${SVG_W} 36`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label={`Adquirido ${c.promedioAdquirido.toFixed(
          2,
        )} y requerido ${c.promedioRequerido.toFixed(2)} para ${c.nombre}`}
      >
        {/* Líneas guía verticales */}
        {escalaTicks.map((t) => (
          <line
            key={t}
            x1={escalaX(t)}
            x2={escalaX(t)}
            y1={4}
            y2={32}
            stroke="#e2e8f0"
            strokeWidth={1}
            strokeDasharray={t === 0 || t === 5 ? "0" : "3 3"}
          />
        ))}

        {/* Conector entre adquirido y requerido (la "brecha") */}
        <line
          x1={xAdq}
          x2={xReq}
          y1={18}
          y2={18}
          stroke={sev.color}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.35}
        />

        {/* Punto requerido */}
        <circle
          cx={xReq}
          cy={18}
          r={8}
          fill={COLOR_REQUERIDO}
          stroke="#ffffff"
          strokeWidth={2}
        >
          <title>{`Requerido: ${c.promedioRequerido.toFixed(2)} / 5`}</title>
        </circle>

        {/* Punto adquirido */}
        <circle
          cx={xAdq}
          cy={18}
          r={8}
          fill={COLOR_ADQUIRIDO}
          stroke="#ffffff"
          strokeWidth={2}
        >
          <title>{`Adquirido: ${c.promedioAdquirido.toFixed(2)} / 5`}</title>
        </circle>
      </svg>

      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: COLOR_ADQUIRIDO }}
          />
          Adquirido:{" "}
          <span className="font-semibold text-slate-700">
            {c.promedioAdquirido.toFixed(2)}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: COLOR_REQUERIDO }}
          />
          Requerido:{" "}
          <span className="font-semibold text-slate-700">
            {c.promedioRequerido.toFixed(2)}
          </span>
        </span>
      </div>
    </div>
  );
}

function EjeEscala() {
  const ticks = [0, 1, 2, 3, 4, 5];
  return (
    <svg
      viewBox={`0 0 ${SVG_W} 18`}
      className="w-full h-auto mt-2"
      aria-hidden="true"
    >
      {ticks.map((t) => (
        <text
          key={t}
          x={escalaX(t)}
          y={12}
          textAnchor="middle"
          fontSize={11}
          fill="#94a3b8"
        >
          {t}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Gráfico 2: Medidor semicircular (escala Likert 1-5)               */
/* ------------------------------------------------------------------ */

function MedidorLikert({ valor }: { valor: number }) {
  const min = 1;
  const max = 5;
  const v = Math.max(min, Math.min(max, valor));
  const t = (v - min) / (max - min); // fracción 0..1

  const cx = 100;
  const cy = 100;
  const r = 80;

  const puntoEn = (fraccion: number) => {
    const angulo = Math.PI * (1 - fraccion);
    return {
      x: cx + r * Math.cos(angulo),
      y: cy - r * Math.sin(angulo),
    };
  };

  const inicio = puntoEn(0);
  const fin = puntoEn(1);
  const actual = puntoEn(t);

  const arcoFondo = `M ${inicio.x} ${inicio.y} A ${r} ${r} 0 0 1 ${fin.x} ${fin.y}`;
  const arcoValor = `M ${inicio.x} ${inicio.y} A ${r} ${r} 0 0 1 ${actual.x} ${actual.y}`;

  const color =
    v >= 4 ? COLOR_ADECUADO : v >= 3 ? COLOR_MODERADO : COLOR_CRITICO;

  return (
    <svg viewBox="0 0 200 120" className="w-40 h-auto" aria-hidden="true">
      <path
        d={arcoFondo}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={14}
        strokeLinecap="round"
      />
      {t > 0 && (
        <path
          d={arcoValor}
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
        />
      )}
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fontSize={26}
        fontWeight={800}
        fill="#1e3a8a"
      >
        {v.toFixed(1)}
      </text>
      <text x={20} y={116} textAnchor="middle" fontSize={10} fill="#94a3b8">
        1
      </text>
      <text x={180} y={116} textAnchor="middle" fontSize={10} fill="#94a3b8">
        5
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Gráfico 3: Donut de distribución por nivel de brecha               */
/* ------------------------------------------------------------------ */

function DonutDistribucion({
  criticas,
  moderadas,
  adecuadas,
}: {
  criticas: number;
  moderadas: number;
  adecuadas: number;
}) {
  const total = criticas + moderadas + adecuadas;
  const radio = 40;
  const circunferencia = 2 * Math.PI * radio;

  const segmentos = [
    { valor: criticas, color: COLOR_CRITICO, nombre: "Crítica" },
    { valor: moderadas, color: COLOR_MODERADO, nombre: "Moderada" },
    { valor: adecuadas, color: COLOR_ADECUADO, nombre: "Adecuada" },
  ];

  let acumulado = 0;

  return (
    <div className="flex items-center gap-6">
      <svg
        viewBox="0 0 100 100"
        className="w-28 h-28 shrink-0"
        aria-hidden="true"
      >
        <circle
          cx={50}
          cy={50}
          r={radio}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={12}
        />
        {total > 0 &&
          segmentos.map((s) => {
            if (s.valor === 0) return null;
            const longitud = (s.valor / total) * circunferencia;
            const offset = -acumulado;
            acumulado += longitud;
            return (
              <circle
                key={s.nombre}
                cx={50}
                cy={50}
                r={radio}
                fill="none"
                stroke={s.color}
                strokeWidth={12}
                strokeDasharray={`${longitud} ${circunferencia - longitud}`}
                strokeDashoffset={offset}
                transform="rotate(-90 50 50)"
              />
            );
          })}
        <text
          x={50}
          y={54}
          textAnchor="middle"
          fontSize={16}
          fontWeight={800}
          fill="#1e3a8a"
        >
          {total}
        </text>
      </svg>

      <ul className="space-y-2 text-xs">
        {segmentos.map((s) => (
          <li key={s.nombre} className="flex items-center gap-2 text-slate-700">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            <span className="font-medium">{s.nombre}</span>
            <span className="text-slate-400">
              {s.valor} {s.valor === 1 ? "competencia" : "competencias"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Página principal                                                   */
/* ------------------------------------------------------------------ */

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

  // Ordenamos de mayor a menor brecha para leer de un vistazo los puntos críticos
  const competenciasOrdenadas = [...datos.competencias].sort(
    (a, b) => b.brecha - a.brecha,
  );

  const numCriticas = datos.competencias.filter((c) => c.brecha > 0.8).length;
  const numModeradas = datos.competencias.filter(
    (c) => c.brecha > 0 && c.brecha <= 0.8,
  ).length;
  const numAdecuadas = datos.competencias.filter((c) => c.brecha <= 0).length;

  const likert = datos.percepcionEmpleadores.promedioLikertCompetencias;
  const brechaGlobalSev = getSeveridad(datos.promedioBrechaGlobal);

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
          <div className="flex items-end gap-3">
            <p className={`text-3xl font-bold ${brechaGlobalSev.texto}`}>
              {formatBrecha(datos.promedioBrechaGlobal)}
            </p>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 ${brechaGlobalSev.fondo} ${brechaGlobalSev.texto}`}
            >
              {brechaGlobalSev.etiqueta}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Promedio (Requerido - Adquirido)
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 md:col-span-2">
          <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
            ⚠️ Índice de Brecha Máxima (Punto Crítico)
          </p>
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div>
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
            {datos.competenciaMayorBrecha && (
              <div className="w-full sm:w-56">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Brecha sobre escala máxima</span>
                  <span className="font-semibold">
                    {((datos.competenciaMayorBrecha.brecha / 5) * 100).toFixed(
                      0,
                    )}
                    %
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (datos.competenciaMayorBrecha.brecha / 5) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PANEL PRINCIPAL DE COMPARACIÓN + LATERAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COMPARATIVA ADQUIRIDO VS REQUERIDO */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
            <div>
              <h2 className="text-lg font-bold text-blue-900">
                Nivel Adquirido vs. Nivel Requerido
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ordenado de mayor a menor brecha. Escala Likert 0 a 5.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-700">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLOR_ADQUIRIDO }}
                />
                Adquirido
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLOR_REQUERIDO }}
                />
                Requerido
              </span>
            </div>
          </div>

          <div>
            {competenciasOrdenadas.map((c) => (
              <FilaCompetencia key={c.nombre} c={c} />
            ))}
          </div>
          <EjeEscala />
        </div>

        {/* LADO DERECHO: EMPLEADORES, DISTRIBUCIÓN Y ARCUSUR */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-blue-900 mb-1">
              Percepción del Sector Empleador
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Valoración promedio en competencias (Likert 1-5).
            </p>

            <div className="flex items-center gap-4 mb-6">
              <MedidorLikert valor={likert} />
              <div>
                <div className="text-xs text-slate-400">Escala 1 al 5</div>
                <div
                  className={`text-sm font-semibold ${
                    likert >= 4 ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {likert >= 4 ? "Satisfactorio" : "En Observación"}
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
                      &ldquo;{txt}&rdquo;
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

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-blue-900 mb-1">
              Distribución de Brechas
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Competencias agrupadas por nivel de brecha.
            </p>
            <DonutDistribucion
              criticas={numCriticas}
              moderadas={numModeradas}
              adecuadas={numAdecuadas}
            />
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
