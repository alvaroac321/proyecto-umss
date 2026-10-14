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
  Legend,
} from "recharts";

interface Competencia {
  nombre: string;
  tipo: string;
  mediaAdquirido: number;
  mediaRequerido: number;
  desviacionAdquirido: number;
  desviacionRequerido: number;
  brechaPromedio: number;
  muestras: number;
}

interface DatosHU4 {
  totalRegistros: number;
  competencias: Competencia[];
  resumen: {
    brechaPromedio: number;
    competenciaMayorBrecha: { nombre: string; brecha: number } | null;
    competenciaMenorBrecha: { nombre: string; brecha: number } | null;
  };
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
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return <p className="text-slate-600">Cargando datos...</p>;
  }

  if (!datos || datos.totalRegistros === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          HU4: Brechas en competencias profesionales
        </h1>
        <div className="mt-8 rounded-xl bg-amber-50 p-6 border border-amber-200 text-amber-800">
          No hay datos de competencias registrados. Llena el formulario de
          titulados primero.
        </div>
      </div>
    );
  }

  // Datos para el gráfico de barras comparativo
  const dataGrafico = datos.competencias.map((c) => ({
    competencia:
      c.nombre.length > 22 ? c.nombre.slice(0, 22) + "..." : c.nombre,
    Adquirido: c.mediaAdquirido,
    Requerido: c.mediaRequerido,
  }));

  // Datos ordenados por brecha descendente
  const dataBrechas = [...datos.competencias].sort(
    (a, b) => b.brechaPromedio - a.brechaPromedio,
  );

  const colorBrecha = (brecha: number) => {
    if (brecha > 1) return "text-red-600";
    if (brecha > 0) return "text-amber-600";
    if (brecha === 0) return "text-slate-600";
    return "text-emerald-600";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-2">
        HU4: Brechas en competencias profesionales
      </h1>
      <p className="text-slate-600 mb-8">
        Comparación entre competencias adquiridas en la universidad y
        requeridas en el puesto laboral.
      </p>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">Registros totales</p>
          <p className="text-3xl font-bold text-blue-900">
            {datos.totalRegistros}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">Brecha promedio</p>
          <p
            className={`text-3xl font-bold ${colorBrecha(
              datos.resumen.brechaPromedio,
            )}`}
          >
            {datos.resumen.brechaPromedio > 0 ? "+" : ""}
            {datos.resumen.brechaPromedio}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">
            Mayor brecha detectada
          </p>
          {datos.resumen.competenciaMayorBrecha && (
            <>
              <p className="text-sm font-bold text-red-600 mt-1">
                {datos.resumen.competenciaMayorBrecha.nombre}
              </p>
              <p className="text-xs text-slate-500">
                Brecha: +{datos.resumen.competenciaMayorBrecha.brecha}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Gráfico comparativo */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-blue-900 mb-4">
          Comparación global: adquirido vs requerido
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataGrafico} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis dataKey="competencia" type="category" width={180} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Adquirido" fill="#3b82f6" />
              <Bar dataKey="Requerido" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-blue-900 mb-4">
          Detalle por competencia
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left py-2 px-3 text-slate-600">
                  Competencia
                </th>
                <th className="text-center py-2 px-3 text-slate-600">Tipo</th>
                <th className="text-center py-2 px-3 text-slate-600">
                  Adquirido (μ ± σ)
                </th>
                <th className="text-center py-2 px-3 text-slate-600">
                  Requerido (μ ± σ)
                </th>
                <th className="text-center py-2 px-3 text-slate-600">Brecha</th>
                <th className="text-center py-2 px-3 text-slate-600">
                  Muestras
                </th>
              </tr>
            </thead>
            <tbody>
              {dataBrechas.map((c) => (
                <tr key={c.nombre} className="border-b last:border-0">
                  <td className="py-2 px-3 text-slate-800 font-medium">
                    {c.nombre}
                  </td>
                  <td className="text-center py-2 px-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        c.tipo === "Técnica"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {c.tipo}
                    </span>
                  </td>
                  <td className="text-center py-2 px-3 text-slate-700">
                    {c.mediaAdquirido} ± {c.desviacionAdquirido}
                  </td>
                  <td className="text-center py-2 px-3 text-slate-700">
                    {c.mediaRequerido} ± {c.desviacionRequerido}
                  </td>
                  <td
                    className={`text-center py-2 px-3 font-bold ${colorBrecha(
                      c.brechaPromedio,
                    )}`}
                  >
                    {c.brechaPromedio > 0 ? "+" : ""}
                    {c.brechaPromedio}
                  </td>
                  <td className="text-center py-2 px-3 text-slate-500">
                    {c.muestras}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interpretación */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-lg font-bold text-blue-900 mb-2">Interpretación</h2>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>
            • <strong>Brecha positiva (+):</strong> el puesto requiere más de
            lo que se aprendió en la universidad → oportunidad de mejora
            curricular.
          </li>
          <li>
            • <strong>Brecha cero (0):</strong> hay equilibrio entre lo
            aprendido y lo requerido.
          </li>
          <li>
            • <strong>Brecha negativa (−):</strong> se aprendió más de lo que
            el puesto exige.
          </li>
        </ul>
      </div>
    </div>
  );
}