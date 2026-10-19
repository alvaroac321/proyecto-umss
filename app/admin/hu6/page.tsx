"use client";

import { useEffect, useState } from "react";

interface DatosHU6 {
  ok: boolean;
  resumen: {
    totalTitulados: number;
    totalEmpleadores: number;
    totalCompetenciasEvaluadas: number;
  };
  titulados: any[];
  empleadores: any[];
}

/* ------------------------------------------------------------------ */
/*  Utilidades                                                         */
/* ------------------------------------------------------------------ */

const porcentaje = (parte: number, total: number) =>
  total > 0 ? Math.round((parte / total) * 100) : 0;

/** Cuenta registros agrupados por un campo. Valores vacíos → "Sin dato" */
const contarPorCampo = (lista: any[], campo: string) =>
  lista.reduce<Record<string, number>>((acc, row) => {
    const clave = row?.[campo] ? String(row[campo]) : "Sin dato";
    acc[clave] = (acc[clave] || 0) + 1;
    return acc;
  }, {});

const esSi = (valor: any) => String(valor) === "true" || valor === true;

/* ------------------------------------------------------------------ */
/*  Gráfico 1: Cobertura de la muestra (barras comparativas)           */
/* ------------------------------------------------------------------ */

function CoberturaMuestra({
  items,
}: {
  items: { label: string; valor: number; color: string }[];
}) {
  const maximo = Math.max(1, ...items.map((i) => i.valor));

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex justify-between items-baseline text-xs mb-1">
            <span className="font-medium text-slate-700">{item.label}</span>
            <span className="font-bold text-slate-800">{item.valor}</span>
          </div>
          <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(item.valor / maximo) * 100}%`,
                backgroundColor: item.color,
              }}
              title={`${item.label}: ${item.valor}`}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Gráfico 2: Distribución por categoría (barras ordenadas)           */
/* ------------------------------------------------------------------ */

function DistribucionBarras({
  datos,
  total,
  color,
  vacio,
}: {
  datos: Record<string, number>;
  total: number;
  color: string;
  vacio: string;
}) {
  const entradas = Object.entries(datos).sort((a, b) => b[1] - a[1]);

  if (entradas.length === 0) {
    return <p className="text-xs text-slate-400">{vacio}</p>;
  }

  const maximo = Math.max(1, ...entradas.map(([, v]) => v));

  return (
    <ul className="space-y-3">
      {entradas.map(([etiqueta, cantidad]) => {
        const pct = porcentaje(cantidad, total);
        return (
          <li key={etiqueta}>
            <div className="flex justify-between items-baseline gap-2 text-xs mb-1">
              <span className="font-medium text-slate-700">{etiqueta}</span>
              <span className="text-slate-500 whitespace-nowrap">
                <span className="font-bold text-slate-800">{cantidad}</span> (
                {pct}%)
              </span>
            </div>
            <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(cantidad / maximo) * 100}%`,
                  backgroundColor: color,
                }}
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
/*  Página principal                                                   */
/* ------------------------------------------------------------------ */

export default function HU6Page() {
  const [datos, setDatos] = useState<DatosHU6 | null>(null);
  const [cargando, setCargando] = useState(true);
  const [pestanaActiva, setPestanaActiva] = useState<
    "titulados" | "empleadores"
  >("titulados");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("/api/analisis/hu6")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setDatos(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  }, []);

  // Función para exportar datos perfectamente organizados en columnas para Excel
  const exportarCSV = (lista: any[], nombreArchivo: string) => {
    if (!lista || lista.length === 0) return;

    // Obtener las cabeceras/columnas
    const columnas = Object.keys(lista[0]);

    // Usar punto y coma (;) como separador nativo para Excel en español
    const separador = ";";

    const filasCSV = [
      columnas.join(separador), // Fila de cabecera
      ...lista.map((row) =>
        columnas
          .map((col) => {
            let val = row[col] ?? "";

            // Convertir objetos o JSON a texto plano
            if (typeof val === "object") {
              val = JSON.stringify(val);
            }

            // Convertir a string, eliminar saltos de línea y escapar comillas dobles
            val = String(val)
              .replace(/\r?\n|\r/g, " ")
              .replace(/"/g, '""');

            return `"${val}"`;
          })
          .join(separador),
      ),
    ];

    // Incluir el BOM UTF-8 (\uFEFF) para la lectura de caracteres especiales en Excel
    const contenido = "\uFEFF" + filasCSV.join("\n");
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (cargando) {
    return (
      <div className="flex items-center gap-3 text-slate-600 py-10">
        <div className="w-5 h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
        <p>Cargando panel de gestión y reportes (HU-06)...</p>
      </div>
    );
  }

  if (!datos) {
    return (
      <div className="p-6 text-rose-600 bg-rose-50 rounded-xl border border-rose-200">
        Error al cargar la información consolidada de las encuestas.
      </div>
    );
  }

  // Filtrado dinámico por búsqueda
  const tituladosFiltrados = datos.titulados.filter((t) =>
    JSON.stringify(t).toLowerCase().includes(busqueda.toLowerCase()),
  );

  const empleadoresFiltrados = datos.empleadores.filter((e) =>
    JSON.stringify(e).toLowerCase().includes(busqueda.toLowerCase()),
  );

  // Datos para los gráficos (sobre el conjunto completo, no sobre el filtro)
  const situacionLaboralDistribucion = contarPorCampo(
    datos.titulados,
    "situacionLaboral",
  );

  const tamanoDistribucion = contarPorCampo(datos.empleadores, "tamano");

  const empleadoresContratantes = datos.empleadores.filter((e) =>
    esSi(e.haContratado5Anios),
  ).length;

  return (
    <div className="space-y-8">
      {/* CABECERA */}
      <div>
        <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Historia de Usuario 06
        </span>
        <h1 className="text-3xl font-bold text-blue-900 mt-2 mb-1">
          Panel de Gestión, Exportación de Datos y Reportes Ejecutivos
        </h1>
        <p className="text-slate-600">
          Consolidación de encuestas de campo almacenadas en PostgreSQL para el
          Informe de Autoevaluación ARCUSUR.
        </p>
      </div>

      {/* KPIS DE REGISTROS ALMACENADOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Encuestas Titulados
          </p>
          <p className="text-3xl font-bold text-blue-900">
            {datos.resumen.totalTitulados}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Registros en GraduateSurvey
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Encuestas Empleadores
          </p>
          <p className="text-3xl font-bold text-emerald-600">
            {datos.resumen.totalEmpleadores}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Registros en EmployerSurvey
          </p>
          {datos.resumen.totalEmpleadores > 0 && (
            <p className="text-xs text-slate-500 mt-2">
              {porcentaje(
                empleadoresContratantes,
                datos.resumen.totalEmpleadores,
              )}
              % han contratado titulados en 5 años
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Matriz de Competencias Evaluadas
          </p>
          <p className="text-3xl font-bold text-purple-700">
            {datos.resumen.totalCompetenciasEvaluadas}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Registros en CompetenciaTitulado
          </p>
        </div>
      </div>

      {/* GRÁFICOS DE RESUMEN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-1">
            📈 Cobertura de la Muestra
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Volumen de registros almacenados por tipo de encuesta.
          </p>
          <CoberturaMuestra
            items={[
              {
                label: "Titulados",
                valor: datos.resumen.totalTitulados,
                color: "#2563eb",
              },
              {
                label: "Empleadores",
                valor: datos.resumen.totalEmpleadores,
                color: "#10b981",
              },
              {
                label: "Competencias evaluadas",
                valor: datos.resumen.totalCompetenciasEvaluadas,
                color: "#7c3aed",
              },
            ]}
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-1">
            💼 Situación Laboral (Titulados)
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Distribución sobre el total de titulados registrados.
          </p>
          <DistribucionBarras
            datos={situacionLaboralDistribucion}
            total={datos.resumen.totalTitulados}
            color="#2563eb"
            vacio="Sin registros de titulados."
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-1">
            📊 Tamaño de Empresas (Empleadores)
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Distribución sobre el total de empleadores registrados.
          </p>
          <DistribucionBarras
            datos={tamanoDistribucion}
            total={datos.resumen.totalEmpleadores}
            color="#10b981"
            vacio="Sin registros de empleadores."
          />
        </div>
      </div>

      {/* CONTROLES Y PANELES */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          {/* BOTONES PESTAÑAS */}
          <div className="flex gap-2">
            <button
              onClick={() => setPestanaActiva("titulados")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                pestanaActiva === "titulados"
                  ? "bg-blue-900 text-white shadow"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              🎓 Encuestas Titulados ({tituladosFiltrados.length})
            </button>
            <button
              onClick={() => setPestanaActiva("empleadores")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                pestanaActiva === "empleadores"
                  ? "bg-blue-900 text-white shadow"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              🏢 Encuestas Empleadores ({empleadoresFiltrados.length})
            </button>
          </div>

          {/* FILTRO DE BÚSQUEDA Y BOTÓN EXPORTAR */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar registro..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full md:w-64"
            />

            {pestanaActiva === "titulados" ? (
              <button
                onClick={() =>
                  exportarCSV(datos.titulados, "Reporte_Titulados_ARCUSUR")
                }
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow transition whitespace-nowrap"
              >
                📊 Exportar Excel Titulados
              </button>
            ) : (
              <button
                onClick={() =>
                  exportarCSV(datos.empleadores, "Reporte_Empleadores_ARCUSUR")
                }
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow transition whitespace-nowrap"
              >
                📊 Exportar Excel Empleadores
              </button>
            )}
          </div>
        </div>

        {/* VISTA PREVIA DE TABLAS */}
        <div className="overflow-x-auto max-h-96">
          {pestanaActiva === "titulados" ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Situación Laboral</th>
                  <th className="p-3">Tiempo Primer Empleo</th>
                  <th className="p-3">Email Contacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {tituladosFiltrados.length > 0 ? (
                  tituladosFiltrados.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-[10px] text-slate-400">
                        {t.id?.slice(0, 8)}...
                      </td>
                      <td className="p-3">
                        {t.createdAt ? String(t.createdAt).slice(0, 10) : "-"}
                      </td>
                      <td className="p-3">
                        {t.situacionLaboral ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                            {t.situacionLaboral}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-3">{t.tiempoPrimerEmpleo || "-"}</td>
                      <td className="p-3">{t.email || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      No se encontraron registros de titulados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Empresa</th>
                  <th className="p-3">Sector / Rubro</th>
                  <th className="p-3">Tamaño</th>
                  <th className="p-3">Contrató 5 Años</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {empleadoresFiltrados.length > 0 ? (
                  empleadoresFiltrados.map((e) => {
                    const contrato = esSi(e.haContratado5Anios);
                    return (
                      <tr key={e.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-[10px] text-slate-400">
                          {e.id?.slice(0, 8)}...
                        </td>
                        <td className="p-3 font-medium text-slate-800">
                          {e.nombreEmpresa || "Sin Nombre"}
                        </td>
                        <td className="p-3">{e.rubroSector || "-"}</td>
                        <td className="p-3">{e.tamano || "-"}</td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full font-bold ${
                              contrato
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {contrato ? "Sí" : "No"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      No se encontraron registros de empleadores.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* VALOR PARA ARCUSUR */}
      <div className="bg-rose-50 rounded-xl p-6 border border-rose-200 text-rose-900">
        <h3 className="font-bold text-sm mb-2">
          📌 Valor para Acreditación ARCUSUR
        </h3>
        <p className="text-xs text-rose-800 leading-relaxed">
          Otorga auditabilidad, transparencia y trazabilidad a la recolección de
          datos primarios solicitada en el proceso de acreditación de la Carrera
          de Ingeniería en Sistemas.
        </p>
      </div>
    </div>
  );
}
