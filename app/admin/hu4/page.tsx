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

/* ------------------------------------------------------------------ */
/*  Utilidades                                                         */
/* ------------------------------------------------------------------ */

const porcentaje = (parte: number, total: number) =>
  total > 0 ? Math.round((parte / total) * 100) : 0;

/* ------------------------------------------------------------------ */
/*  Gráfico 1: Ranking de asignaturas (barras horizontales)            */
/* ------------------------------------------------------------------ */

function RankingAsignaturas({
  entradas,
  total,
  colorBarra,
  colorPosicion,
  vacio,
}: {
  entradas: [string, number][];
  total: number;
  colorBarra: string;
  colorPosicion: string;
  vacio: string;
}) {
  if (entradas.length === 0) {
    return <p className="text-xs text-slate-400">{vacio}</p>;
  }

  const maximo = Math.max(1, ...entradas.map(([, v]) => v));

  return (
    <ul className="space-y-3">
      {entradas.map(([malla, cantidad], idx) => {
        const pct = porcentaje(cantidad, total);
        const ancho = (cantidad / maximo) * 100;
        return (
          <li key={malla}>
            <div className="flex justify-between items-baseline gap-2 text-xs mb-1">
              <span className="font-medium text-slate-700">
                <strong className={colorPosicion}>#{idx + 1}</strong> {malla}
              </span>
              <span className="text-slate-500 whitespace-nowrap">
                <span className="font-bold text-slate-800">{cantidad}</span>{" "}
                menciones ({pct}%)
              </span>
            </div>
            <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${ancho}%`, backgroundColor: colorBarra }}
                title={`${malla}: ${cantidad} menciones (${pct}%)`}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Gráfico 2: Comparación de aspectos (barras con votos)              */
/* ------------------------------------------------------------------ */

function AspectosBarras({
  datos,
  colorBarra,
  colorTexto,
  vacio,
}: {
  datos: Record<string, number>;
  colorBarra: string;
  colorTexto: string;
  vacio: string;
}) {
  const entradas = Object.entries(datos).sort((a, b) => b[1] - a[1]);

  if (entradas.length === 0) {
    return <p className="text-xs text-slate-400">{vacio}</p>;
  }

  const maximo = Math.max(1, ...entradas.map(([, v]) => v));
  const totalVotos = entradas.reduce((acc, [, v]) => acc + v, 0);

  return (
    <ul className="space-y-3">
      {entradas.map(([aspecto, votos]) => {
        const ancho = (votos / maximo) * 100;
        const pct = porcentaje(votos, totalVotos);
        return (
          <li key={aspecto}>
            <div className="flex justify-between items-baseline gap-2 text-xs mb-1">
              <span className="font-medium text-slate-700">{aspecto}</span>
              <span className={`font-bold whitespace-nowrap ${colorTexto}`}>
                {votos} votos{" "}
                <span className="font-normal text-slate-400">({pct}%)</span>
              </span>
            </div>
            <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${ancho}%`, backgroundColor: colorBarra }}
                title={`${aspecto}: ${votos} votos (${pct}%)`}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Gráfico 3: Resumen comparativo fortalezas vs. mejoras              */
/* ------------------------------------------------------------------ */

function BalanceFortalezasMejoras({
  fortalezas,
  mejoras,
}: {
  fortalezas: number;
  mejoras: number;
}) {
  const total = fortalezas + mejoras;
  const pctFortalezas = porcentaje(fortalezas, total);
  const pctMejoras = total > 0 ? 100 - pctFortalezas : 0;

  return (
    <div>
      <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100">
        <div
          className="h-full bg-blue-600 transition-all duration-700"
          style={{ width: `${pctFortalezas}%` }}
          title={`Fortalezas: ${fortalezas} votos`}
        />
        <div
          className="h-full bg-amber-500 transition-all duration-700"
          style={{ width: `${pctMejoras}%` }}
          title={`A mejorar: ${mejoras} votos`}
        />
      </div>
      <div className="flex justify-between text-[11px] mt-2">
        <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-600" />
          Fortalezas: {fortalezas} ({pctFortalezas}%)
        </span>
        <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-500" />A
          mejorar: {mejoras} ({pctMejoras}%)
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Página principal                                                   */
/* ------------------------------------------------------------------ */

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

  // Ordenar asignaturas por frecuencia (top 10)
  const topUtiles = Object.entries(datos.asignaturasUtiles)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topInutiles = Object.entries(datos.asignaturasInutiles)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const totalFortalezas = Object.values(datos.aspectosUtiles).reduce(
    (acc, v) => acc + v,
    0,
  );
  const totalMejoras = Object.values(datos.aspectosMejorar).reduce(
    (acc, v) => acc + v,
    0,
  );

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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-emerald-700 mb-1 flex items-center gap-2">
            <span>⭐</span> Asignaturas de Mayor Pertinencia y Utilidad
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Top 10 según menciones de titulados. El porcentaje se calcula sobre
            el total de respuestas.
          </p>
          <RankingAsignaturas
            entradas={topUtiles}
            total={datos.totalTitulados}
            colorBarra="#10b981"
            colorPosicion="text-emerald-700"
            vacio="Sin registros de asignaturas."
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-rose-700 mb-1 flex items-center gap-2">
            <span>⚠️</span> Asignaturas a Reorganizar / Actualizar
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Top 10 según menciones de titulados. El porcentaje se calcula sobre
            el total de respuestas.
          </p>
          <RankingAsignaturas
            entradas={topInutiles}
            total={datos.totalTitulados}
            colorBarra="#f43f5e"
            colorPosicion="text-rose-600"
            vacio="Sin observaciones registradas."
          />
        </div>
      </div>

      {/* BALANCE GENERAL */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-blue-900 mb-1">
          ⚖️ Balance de Valoración Pedagógica
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Proporción de votos entre fortalezas y aspectos a mejorar.
        </p>
        <BalanceFortalezasMejoras
          fortalezas={totalFortalezas}
          mejoras={totalMejoras}
        />
      </div>

      {/* ASPECTOS PEDAGÓGICOS Y METODOLÓGICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-1">
            ✅ Aspectos Fortalezas de la Carrera
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Votos por aspecto valorado positivamente.
          </p>
          <AspectosBarras
            datos={datos.aspectosUtiles}
            colorBarra="#2563eb"
            colorTexto="text-blue-800"
            vacio="Sin aspectos registrados."
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-1">
            🔧 Aspectos Metodológicos a Mejorar
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Votos por aspecto señalado para mejora.
          </p>
          <AspectosBarras
            datos={datos.aspectosMejorar}
            colorBarra="#f59e0b"
            colorTexto="text-amber-800"
            vacio="Sin observaciones a mejorar."
          />
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
