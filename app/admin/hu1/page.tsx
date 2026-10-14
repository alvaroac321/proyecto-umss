"use client";

import { useEffect, useState } from "react";

interface DatosHU1 {
  estadisticas: {
    total: number;
    media: number;
    mediana: number;
    desviacion: number;
    minimo: number;
    maximo: number;
  };
  segmentacion: { junior: number; consolidado: number };
  porSituacion: Record<string, number>;
  porAnios: Record<string, number>;
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
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return <p className="text-slate-600">Cargando datos...</p>;
  }

  if (!datos || datos.estadisticas.total === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          HU1: Antiguedad y empleabilidad
        </h1>
        <p className="text-slate-600 mb-8">
          Analisis de años de vida profesional de los titulados.
        </p>
        <div className="rounded-xl bg-amber-50 p-6 border border-amber-200 text-amber-800">
          No hay datos registrados. Llena el formulario de titulados primero.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-2">
        HU1: Antiguedad y empleabilidad
      </h1>
      <p className="text-slate-600 mb-8">
        Analisis de años de vida profesional de los titulados.
      </p>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">Media</p>
          <p className="text-3xl font-bold text-blue-900">
            {datos.estadisticas.media} años
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">Mediana</p>
          <p className="text-3xl font-bold text-emerald-600">
            {datos.estadisticas.mediana} años
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">
            Desviación estandar
          </p>
          <p className="text-3xl font-bold text-amber-600">
            {datos.estadisticas.desviacion} años
          </p>
        </div>
      </div>

      {/* Segmentación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Segmentación por antigüedad
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-700">
                Profesionales junior (&lt; 5 años)
              </span>
              <span className="font-bold text-slate-800">
                {datos.segmentacion.junior}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">
                Mandos consolidados (≥ 5 años)
              </span>
              <span className="font-bold text-slate-800">
                {datos.segmentacion.consolidado}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Distribución por situación laboral
          </h2>
          <div className="space-y-2">
            {Object.entries(datos.porSituacion).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-700 text-sm">{k}</span>
                <span className="font-bold text-slate-800">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribución por rangos de años */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-blue-900 mb-4">
          Distribución por rangos de años
        </h2>
        <div className="space-y-2">
          {Object.entries(datos.porAnios).map(([rango, cantidad]) => (
            <div key={rango} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-16">{rango} años</span>
              <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-blue-500 h-full"
                  style={{
                    width: `${(cantidad / datos.estadisticas.total) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-bold text-slate-700 w-8 text-right">
                {cantidad}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}