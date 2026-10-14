"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface DatosHU2 {
  totales: {
    totalTitulados: number;
    conFormacionComplementaria: number;
    interesadosEnPosgrado: number;
  };
  nivelPosgrado: {
    absolutas: Record<string, number>;
    relativas: Record<string, number>;
  };
  areasInteres: {
    absolutas: Record<string, number>;
    relativas: Record<string, number>;
  };
  alertas: {
    areasConcentradas: { area: string; porcentaje: number }[];
    concentracionTop2: number;
    top2: { area: string; porcentaje: number }[];
  };
}

export default function HU2Page() {
  const [datos, setDatos] = useState<DatosHU2 | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/analisis/hu2")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setDatos(data);
      })
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return <p className="text-slate-600">Cargando datos...</p>;
  }

  if (!datos || datos.totales.totalTitulados === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          HU2: Formación continua y áreas de interés
        </h1>
        <div className="mt-8 rounded-xl bg-amber-50 p-6 border border-amber-200 text-amber-800">
           No hay datos registrados. Llena el formulario de titulados primero.
        </div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const dataNivel = Object.entries(datos.nivelPosgrado.absolutas).map(
    ([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: datos.nivelPosgrado.relativas[nombre] || 0,
    }),
  );

  const dataAreas = Object.entries(datos.areasInteres.absolutas).map(
    ([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: datos.areasInteres.relativas[nombre] || 0,
    }),
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-2">
        HU2: Formación continua y áreas de interés
      </h1>
      <p className="text-slate-600 mb-8">
        Distribución de preferencias de posgrado y áreas temáticas.
      </p>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">Total titulados</p>
          <p className="text-3xl font-bold text-blue-900">
            {datos.totales.totalTitulados}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">
            Con formación complementaria
          </p>
          <p className="text-3xl font-bold text-emerald-600">
            {datos.totales.conFormacionComplementaria}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">
            Interesados en posgrado
          </p>
          <p className="text-3xl font-bold text-amber-600">
            {datos.totales.interesadosEnPosgrado}
          </p>
        </div>
      </div>

      {/* Alerta de concentración */}
      {datos.alertas.areasConcentradas.length > 0 && (
        <div className="mb-8 rounded-xl bg-red-50 p-6 border border-red-200">
          <p className="font-bold text-red-800 mb-2">
            🚨 Alerta: concentración crítica detectada
          </p>
          {datos.alertas.areasConcentradas.map((a) => (
            <p key={a.area} className="text-sm text-red-700">
              El área <strong>{a.area}</strong> concentra el{" "}
              <strong>{a.porcentaje}%</strong> de las preferencias (supera el
              70%).
            </p>
          ))}
        </div>
      )}

      {datos.alertas.concentracionTop2 > 70 && (
        <div className="mb-8 rounded-xl bg-amber-50 p-6 border border-amber-200">
          <p className="font-bold text-amber-800 mb-2">
            📌 Concentración de mercado
          </p>
          <p className="text-sm text-amber-700">
            Las 2 áreas principales ({datos.alertas.top2.map((t) => t.area).join(" y ")}) concentran el{" "}
            <strong>{datos.alertas.concentracionTop2}%</strong> de las
            preferencias.
          </p>
        </div>
      )}

      {/* Gráfico: Nivel de posgrado */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-blue-900 mb-4">
          Distribución por nivel de posgrado
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataNivel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico: Áreas de interés */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-blue-900 mb-4">
          Distribución por áreas de interés
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataAreas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tablas de frecuencias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Frecuencias: nivel de posgrado
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-slate-600">Nivel</th>
                <th className="text-right py-2 text-slate-600">Abs.</th>
                <th className="text-right py-2 text-slate-600">Rel. (%)</th>
              </tr>
            </thead>
            <tbody>
              {dataNivel.map((f) => (
                <tr key={f.nombre} className="border-b last:border-0">
                  <td className="py-2 text-slate-800">{f.nombre}</td>
                  <td className="text-right text-slate-700">{f.cantidad}</td>
                  <td className="text-right font-semibold text-slate-800">
                    {f.porcentaje.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Frecuencias: áreas de interés
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-slate-600">Área</th>
                <th className="text-right py-2 text-slate-600">Abs.</th>
                <th className="text-right py-2 text-slate-600">Rel. (%)</th>
              </tr>
            </thead>
            <tbody>
              {dataAreas.map((f) => (
                <tr key={f.nombre} className="border-b last:border-0">
                  <td className="py-2 text-slate-800">{f.nombre}</td>
                  <td className="text-right text-slate-700">{f.cantidad}</td>
                  <td className="text-right font-semibold text-slate-800">
                    {f.porcentaje.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}