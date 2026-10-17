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
          con validación estadística ($\chi^2$).
        </p>
      </div>

      {/* RESULTADO PRUEBA ESTADISTICA CHI-CUADRADA */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Estadístico Chi-Cuadrada ($\chi^2$)
          </p>
          <p className="text-3xl font-bold text-amber-600">
            {datos.estadisticaChi.chiCuadrada}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Grados de libertad (df): {datos.estadisticaChi.gradosLibertad}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Independencia Estadística
          </p>
          <p
            className={`text-xl font-bold mt-1 ${
              datos.estadisticaChi.esSignificativo
                ? "text-emerald-600"
                : "text-blue-900"
            }`}
          >
            {datos.estadisticaChi.esSignificativo
              ? "Relación Significativa (p < 0.05)"
              : "Distribución Homogénea"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
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
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            🎓 Niveles de Posgrado Demandados (Titulados)
          </h2>
          <div className="space-y-3">
            {Object.entries(datos.nivelPosgradoMap).map(([nivel, cantidad]) => {
              const porcentaje = Math.round(
                (cantidad / datos.totalTitulados) * 100,
              );
              return (
                <div key={nivel}>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>{nivel}</span>
                    <span>
                      {cantidad} ({porcentaje}%)
                    </span>
                  </div>
                  <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FUENTES DE FINANCIAMIENTO */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            💳 Fuentes de Financiamiento Estimadas
          </h2>
          <div className="space-y-3">
            {Object.entries(datos.fuenteFinanciamientoMap).map(
              ([fuente, cantidad]) => {
                const porcentaje = Math.round(
                  (cantidad / datos.totalTitulados) * 100,
                );
                return (
                  <div key={fuente}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>{fuente}</span>
                      <span>
                        {cantidad} ({porcentaje}%)
                      </span>
                    </div>
                    <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* TABLA DE CONTINGENCIA CRUZADA */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-blue-900 mb-4">
          📊 Tabla de Contingencia: Área de Interés vs. Fuente de Financiamiento
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="p-3 font-bold">Área de Interés</th>
                {fuentesUnicas.map((f) => (
                  <th key={f} className="p-3 font-bold text-center">
                    {f}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {Object.entries(datos.tablaContingencia).map(([area, fila]) => (
                <tr key={area} className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-800">{area}</td>
                  {fuentesUnicas.map((f) => (
                    <td
                      key={f}
                      className="p-3 text-center font-bold text-slate-700"
                    >
                      {fila[f] || 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
