// src/components/RealtimeTelemetryTable.jsx
import { useEffect, useState } from "react";
import {
  fetchInitialTelemetry,
  subscribeToTelemetryUpdates,
  appendAndTrimRows,
} from "../services/telemetryApi";

function formatTimestamp(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "-";

  return {
    time: d.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    date: d.toLocaleDateString("es-CO"),
  };
}

export function RealtimeTelemetryTable() {
  const [rows, setRows] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga inicial
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        const initialRows = await fetchInitialTelemetry();
        if (!isMounted) return;
        setRows(initialRows);
        setLastUpdate(new Date());
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Error cargando datos iniciales");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Suscripción a tiempo real
  useEffect(() => {
    const unsubscribe = subscribeToTelemetryUpdates({
      onData: (newRow) => {
        setRows((prev) => appendAndTrimRows(prev, newRow));
        setLastUpdate(new Date());
      },
      onError: (err) => {
        console.error(err);
        setError("Error recibiendo datos en tiempo real");
      },
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="px-4 py-3 border-b border-slate-100 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Telemetría de fumigadoras
          </h2>
          <p className="text-xs text-slate-500">
            Latitud, longitud, presión, voltaje, corriente y operador.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500">
            Registros: {rows.length}
          </span>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-1 justify-end">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-600 font-medium">En línea</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Última actualización:{" "}
              {lastUpdate
                ? lastUpdate.toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-slate-500">
                Fecha / Hora
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-500">
                Latitud
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-500">
                Longitud
              </th>
              <th className="px-3 py-2 text-right font-medium text-slate-500">
                Presión
              </th>
              <th className="px-3 py-2 text-right font-medium text-slate-500">
                Voltaje
              </th>
              <th className="px-3 py-2 text-right font-medium text-slate-500">
                Corriente
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-500">
                Fumigadora
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-500">
                Operador
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-6 text-center text-slate-400 text-sm"
                >
                  Cargando datos...
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-6 text-center text-slate-400 text-sm"
                >
                  No hay datos disponibles.
                </td>
              </tr>
            )}

            {rows.map((row, idx) => {
              const ts = formatTimestamp(row.timestamp);
              return (
                <tr
                  key={row.id}
                  className={
                    "border-b border-slate-100 " +
                    (idx === 0 ? "bg-emerald-50/40" : "hover:bg-slate-50")
                  }
                >
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700">
                    <div className="flex flex-col">
                      <span>{ts.time}</span>
                      <span className="text-[10px] text-slate-400">
                        {ts.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-800">
                    {row.latitud}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-800">
                    {row.longitud}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-slate-800">
                    {row.presion} <span className="text-[10px]">bar</span>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-slate-800">
                    {row.voltaje} <span className="text-[10px]">V</span>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-slate-800">
                    {row.corriente} <span className="text-[10px]">A</span>
                  </td>
                  <td className="px-3 py-2 text-slate-800">
                    {row.fumigadora}
                  </td>
                  <td className="px-3 py-2 text-slate-800">
                    {row.operador}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
