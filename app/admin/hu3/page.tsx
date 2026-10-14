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

interface TablaContingencia {
  filas: string[];
  columnas: string[];
  matriz: number[][];
  totalesFila: number[];
  totalesColumna: number[];
  total: number;
}

interface DatosHU3 {
  totales: {
    totalTitulados: number;
    conFinanciamiento: number;
  };
  financiamiento: {
    absolutas: Record<string, number>;
    relativas: Record<string, number>;
  };
  tabla: TablaContingencia | null;
  chiCuadrado: {
    chi2: number;
    gl: number;
    pValor: number;
    significativo: boolean;
    conclusion: string;
  } | null;
}

export default function HU3Page() {
  const [datos, setDatos] = useState<DatosHU3 | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/analisis/hu3")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setDatos(data);
      })
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return <p className="text-slate-600">Cargando datos...</p>;
  }

  if (!datos || datos.totales.conFinanciamiento === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          HU3: Mecanismos de financiamiento
        </h1>
        <div className="mt-8 rounded-xl bg-amber-50 p-6 border border-amber-200 text-amber-800">
          No hay datos suficientes. Llena el formulario de titulados con
          información de financiamiento y posgrado.
        </div>
      </div>
    );
  }

  // Preparar datos para gráfico de barras apiladas
  const dataGrafico =
    datos.tabla?.filas.map((fila, i) => {
      const obj: any = { nombre: fila };
      datos.tabla!.columnas.forEach((col, j) => {
        obj[col] = datos.tabla!.matriz[i][j];
      });
      return obj;
    }) || [];

  const colores = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-2">
        HU3: Mecanismos de financiamiento
      </h1>
      <p className="text-slate-600 mb-8">
        Cruce de fuente de financiamiento con el nivel de posgrado deseado y
        prueba Chi-cuadrado.
      </p>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">
            Titulados con financiamiento registrado
          </p>
          <p className="text-3xl font-bold text-blue-900">
            {datos.totales.conFinanciamiento}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            de {datos.totales.totalTitulados} totales
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 uppercase">
            Fuente más frecuente
          </p>
          {Object.entries(datos.financiamiento.absolutas)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 1)
            .map(([fuente, cantidad]) => (
              <div key={fuente}>
                <p className="text-2xl font-bold text-emerald-600">{fuente}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {cantidad} titulados (
                  {datos.financiamiento.relativas[fuente]}%)
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Frecuencias de financiamiento */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-blue-900 mb-4">
          Frecuencia de fuentes de financiamiento
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-slate-600">Fuente</th>
              <th className="text-right py-2 text-slate-600">Frecuencia</th>
              <th className="text-right py-2 text-slate-600">Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(datos.financiamiento.absolutas).map(
              ([fuente, cantidad]) => (
                <tr key={fuente} className="border-b last:border-0">
                  <td className="py-2 text-slate-800">{fuente}</td>
                  <td className="text-right text-slate-700">{cantidad}</td>
                  <td className="text-right font-semibold text-slate-800">
                    {datos.financiamiento.relativas[fuente]}%
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* Tabla de contingencia */}
      {datos.tabla && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Tabla de contingencia: Financiamiento × Nivel de posgrado
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left py-2 px-3 border">
                    Financiamiento
                  </th>
                  {datos.tabla.columnas.map((col) => (
                    <th
                      key={col}
                      className="text-center py-2 px-3 border text-slate-600"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="text-center py-2 px-3 border bg-blue-50">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {datos.tabla.filas.map((fila, i) => (
                  <tr key={fila}>
                    <td className="py-2 px-3 border font-medium text-slate-800">
                      {fila}
                    </td>
                    {datos.tabla!.columnas.map((_, j) => (
                      <td
                        key={j}
                        className="text-center py-2 px-3 border text-slate-700"
                      >
                        {datos.tabla!.matriz[i][j]}
                      </td>
                    ))}
                    <td className="text-center py-2 px-3 border font-bold bg-blue-50">
                      {datos.tabla!.totalesFila[i]}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold">
                  <td className="py-2 px-3 border">Total</td>
                  {datos.tabla.totalesColumna.map((t, j) => (
                    <td
                      key={j}
                      className="text-center py-2 px-3 border"
                    >
                      {t}
                    </td>
                  ))}
                  <td className="text-center py-2 px-3 border bg-blue-100">
                    {datos.tabla.total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gráfico de barras apiladas */}
      {dataGrafico.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Distribución cruzada: Financiamiento por nivel de posgrado
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                {datos.tabla!.columnas.map((col, i) => (
                  <Bar
                    key={col}
                    dataKey={col}
                    stackId="a"
                    fill={colores[i % colores.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Prueba Chi-cuadrado */}
      {datos.chiCuadrado && (
        <div
          className={`rounded-xl p-6 border-2 ${
            datos.chiCuadrado.significativo
              ? "bg-emerald-50 border-emerald-300"
              : "bg-slate-50 border-slate-300"
          }`}
        >
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Prueba de independencia Chi-cuadrado (χ²)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <p className="text-sm text-slate-500 uppercase">
                Estadístico χ²
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {datos.chiCuadrado.chi2}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase">
                Grados de libertad
              </p>
              <p className="text-2xl font-bold text-slate-700">
                {datos.chiCuadrado.gl}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase">p-valor</p>
              <p
                className={`text-2xl font-bold ${
                  datos.chiCuadrado.significativo
                    ? "text-emerald-600"
                    : "text-slate-600"
                }`}
              >
                {datos.chiCuadrado.pValor}
              </p>
            </div>
          </div>

          <div
            className={`p-4 rounded-md ${
              datos.chiCuadrado.significativo
                ? "bg-emerald-100"
                : "bg-slate-200"
            }`}
          >
            <p className="text-sm font-medium text-slate-800">
              <strong>Conclusión:</strong> {datos.chiCuadrado.conclusion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}