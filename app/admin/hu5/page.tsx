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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface TablaContingencia {
  filas: string[];
  columnas: string[];
  matriz: number[][];
  totalesFila: number[];
  totalesColumna: number[];
  total: number;
}

interface DatosHU5 {
  totales: {
    titulados: number;
    empleadores: number;
    competencias: number;
  };
  cruceAreaFinanciamiento: TablaContingencia | null;
  cruceSituacionSector: any;
  distribuciones: {
    genero: Record<string, number>;
    edad: Record<string, number>;
    situacion: Record<string, number>;
    sectorEmpleador: Record<string, number>;
    tipoOrg: Record<string, number>;
  };
  radarCompetencias: {
    competencia: string;
    adquirido: number;
    requerido: number;
  }[];
}

const COLORES = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

export default function HU5Page() {
  const [datos, setDatos] = useState<DatosHU5 | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/analisis/hu5")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setDatos(data);
      })
      .finally(() => setCargando(false));
  }, []);

  const exportar = (tipo: string) => {
    window.open(`/api/exportar?tipo=${tipo}`, "_blank");
  };

  if (cargando) {
    return <p className="text-slate-600">Cargando dashboard...</p>;
  }

  if (!datos || datos.totales.titulados === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          HU5: Dashboard y reportes
        </h1>
        <div className="mt-8 rounded-xl bg-amber-50 p-6 border border-amber-200 text-amber-800">
          ⚠️ No hay datos registrados. Llena los formularios primero.
        </div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const dataGenero = Object.entries(datos.distribuciones.genero).map(
    ([nombre, valor]) => ({ nombre, valor }),
  );
  const dataEdad = Object.entries(datos.distribuciones.edad).map(
    ([nombre, valor]) => ({ nombre, valor }),
  );
  const dataSituacion = Object.entries(datos.distribuciones.situacion).map(
    ([nombre, valor]) => ({ nombre, valor }),
  );
  const dataSector = Object.entries(
    datos.distribuciones.sectorEmpleador,
  ).map(([nombre, valor]) => ({ nombre, valor }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-2">
        HU5: Dashboard y reportes
      </h1>
      <p className="text-slate-600 mb-8">
        Panel general con matrices cruzadas, gráficos y exportación.
      </p>

      {/* Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">Titulados</p>
          <p className="text-3xl font-bold text-blue-900">
            {datos.totales.titulados}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">Empleadores</p>
          <p className="text-3xl font-bold text-emerald-600">
            {datos.totales.empleadores}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">
            Registros de competencias
          </p>
          <p className="text-3xl font-bold text-amber-600">
            {datos.totales.competencias}
          </p>
        </div>
      </div>

      {/* Botones de exportación */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-blue-900 mb-4">
          Exportar datos
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => exportar("titulados")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-md"
          >
            📥 CSV Titulados
          </button>
          <button
            onClick={() => exportar("empleadores")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-md"
          >
            📥 CSV Empleadores
          </button>
          <button
            onClick={() => exportar("competencias")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-md"
          >
            📥 CSV Competencias
          </button>
        </div>
      </div>

      {/* Matriz de contingencia: Área × Financiamiento */}
      {datos.cruceAreaFinanciamiento && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Matriz de frecuencia cruzada: Área de interés × Financiamiento
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left py-2 px-3 border">Área</th>
                  {datos.cruceAreaFinanciamiento.columnas.map((c) => (
                    <th
                      key={c}
                      className="text-center py-2 px-3 border text-slate-600"
                    >
                      {c}
                    </th>
                  ))}
                  <th className="text-center py-2 px-3 border bg-blue-50">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {datos.cruceAreaFinanciamiento.filas.map((fila, i) => (
                  <tr key={fila}>
                    <td className="py-2 px-3 border font-medium text-slate-800">
                      {fila}
                    </td>
                    {datos.cruceAreaFinanciamiento!.columnas.map((_, j) => (
                      <td
                        key={j}
                        className="text-center py-2 px-3 border text-slate-700"
                      >
                        {datos.cruceAreaFinanciamiento!.matriz[i][j]}
                      </td>
                    ))}
                    <td className="text-center py-2 px-3 border font-bold bg-blue-50">
                      {datos.cruceAreaFinanciamiento!.totalesFila[i]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gráfico de radar: competencias */}
      {datos.radarCompetencias.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Diagrama de radar: competencias adquiridas vs requeridas
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={datos.radarCompetencias}>
                <PolarGrid />
                <PolarAngleAxis dataKey="competencia" />
                <PolarRadiusAxis domain={[0, 5]} />
                <Radar
                  name="Adquirido"
                  dataKey="adquirido"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />
                <Radar
                  name="Requerido"
                  dataKey="requerido"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.5}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Gráficos de distribución */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-md font-bold text-blue-900 mb-4">
            Distribución por género
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataGenero}
                  dataKey="valor"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {dataGenero.map((_, i) => (
                    <Cell key={i} fill={COLORES[i % COLORES.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-md font-bold text-blue-900 mb-4">
            Distribución por edad
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataEdad}
                  dataKey="valor"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {dataEdad.map((_, i) => (
                    <Cell key={i} fill={COLORES[i % COLORES.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-md font-bold text-blue-900 mb-4">
            Situación laboral
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataSituacion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-md font-bold text-blue-900 mb-4">
            Sector de empleadores
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataSector}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}