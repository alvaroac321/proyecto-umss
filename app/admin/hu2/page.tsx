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

  const porcentajeContratacion =
    datos.totalEmpleadores > 0
      ? Math.round((datos.haContratado5Anios.si / datos.totalEmpleadores) * 100)
      : 0;

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

      {/* METRICAS KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Empresas Contratantes
          </p>
          <p className="text-3xl font-bold text-emerald-600">
            {porcentajeContratacion}%
          </p>
          <p className="text-xs text-slate-500 mt-2">
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
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            ⏱️ Tiempo de consecución del Primer Empleo
          </h2>
          <div className="space-y-3">
            {Object.entries(datos.tiempoPrimerEmpleo).map(
              ([rango, cantidad]) => {
                const porcentaje = Math.round(
                  (cantidad / datos.totalTitulados) * 100,
                );
                return (
                  <div key={rango}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>{rango}</span>
                      <span>
                        {cantidad} ({porcentaje}%)
                      </span>
                    </div>
                    <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* DISTRIBUCIÓN POR SITUACIÓN LABORAL */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            💼 Situación Laboral Actual
          </h2>
          <div className="space-y-3">
            {Object.entries(datos.situacionLaboral).map(
              ([situacion, cantidad]) => {
                const porcentaje = Math.round(
                  (cantidad / datos.totalTitulados) * 100,
                );
                return (
                  <div key={situacion}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>{situacion}</span>
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

        {/* DEMANDA POR RUBRO/SECTOR */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            🏢 Contratación por Rubro / Sector
          </h2>
          <div className="space-y-3">
            {Object.entries(datos.contratacionPorRubro).map(
              ([rubro, cantidad]) => {
                const porcentaje =
                  datos.totalEmpleadores > 0
                    ? Math.round((cantidad / datos.totalEmpleadores) * 100)
                    : 0;
                return (
                  <div key={rubro}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>{rubro}</span>
                      <span>
                        {cantidad} empresas ({porcentaje}%)
                      </span>
                    </div>
                    <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* TAMAÑO DE LAS EMPRESAS Y PROYECCIÓN */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-blue-900 mb-3">
              📊 Tamaño de Empresas Contratantes
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(datos.tamanoEmpresas).map(
                ([tamano, cantidad]) => (
                  <div
                    key={tamano}
                    className="bg-slate-50 p-3 rounded-lg border border-slate-100"
                  >
                    <p className="text-xs text-slate-500">{tamano}</p>
                    <p className="text-xl font-bold text-slate-800">
                      {cantidad}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-blue-900 mb-2">
              Proyección de Contratación Futura
            </h3>
            <div className="space-y-2">
              {Object.entries(datos.proyeccionContratacion).map(
                ([proy, cantidad]) => (
                  <div
                    key={proy}
                    className="flex justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded"
                  >
                    <span>{proy}</span>
                    <span className="font-bold text-slate-800">
                      {cantidad} empresas
                    </span>
                  </div>
                ),
              )}
            </div>
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
