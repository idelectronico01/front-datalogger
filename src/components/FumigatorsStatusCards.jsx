// src/components/FumigatorsStatusCards.jsx
import { useEffect, useState } from "react";

const REFRESH_MS = 3000; // cada 3 segundos

function createInitialFumigators() {
  const now = new Date().toISOString();
  return [
    {
      id: 1,
      nombre: "Fumigadora 01",
      operador: "Juan Pérez",
      presion: 2.3,
      voltaje: 12.4,
      corriente: 1.7,
      potencia: 21.1, // V * A aprox
      bateria: 82,
      latitud: 4.711,
      longitud: -74.072,
      ultimaTransmision: now,
      estado: "online",
    },
    {
      id: 2,
      nombre: "Fumigadora 02",
      operador: "María López",
      presion: 2.0,
      voltaje: 12.1,
      corriente: 1.5,
      potencia: 18.1,
      bateria: 67,
      latitud: 4.709,
      longitud: -74.069,
      ultimaTransmision: now,
      estado: "online",
    },
  ];
}

function tickFumigator(prev) {
  // pequeños cambios pseudo-reales
  const rand = (base, amp) => base + (Math.random() - 0.5) * amp;

  const voltaje = +(rand(prev.voltaje, 0.4)).toFixed(2);
  const corriente = +(rand(prev.corriente, 0.3)).toFixed(2);
  const presion = +(rand(prev.presion, 0.3)).toFixed(2);
  const potencia = +(voltaje * corriente).toFixed(1);

  // batería baja muy despacio
  const bateriaDrop = Math.random() < 0.3 ? 1 : 0;
  const bateria = Math.max(0, prev.bateria - bateriaDrop);

  // coordenadas se mueven poquito
  const latitud = +(prev.latitud + (Math.random() - 0.5) * 0.0005).toFixed(6);
  const longitud = +(prev.longitud + (Math.random() - 0.5) * 0.0005).toFixed(6);

  const ultimaTransmision = new Date().toISOString();

  // de vez en cuando simulamos caída de comunicación
  const estado =
    Math.random() < 0.05 || bateria === 0 ? "offline" : "online";

  return {
    ...prev,
    voltaje,
    corriente,
    presion,
    potencia,
    bateria,
    latitud,
    longitud,
    ultimaTransmision,
    estado,
  };
}

function formatTime(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function FumigatorsStatusCards() {
  const [fumigators, setFumigators] = useState(createInitialFumigators);

  useEffect(() => {
    const id = setInterval(() => {
      setFumigators((prev) => prev.map((f) => tickFumigator(f)));
    }, REFRESH_MS);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Estado de fumigadoras
          </h2>
          <p className="text-xs text-slate-500">
            Datos en tiempo real por equipo: presión, voltaje, potencia,
            batería y coordenadas.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Actualización automática cada {REFRESH_MS / 1000} s.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {fumigators.map((f) => {
          const online = f.estado === "online";
          const batteryColor =
            f.bateria > 60
              ? "bg-emerald-100 text-emerald-700"
              : f.bateria > 30
              ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700";

          return (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3"
            >
              {/* Cabecera */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#DA291C]/10 flex items-center justify-center">
                    {/* Icono “bonito” de fumigadora (puedes cambiarlo) */}
                    <span className="text-xl">🚜</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {f.nombre}
                    </div>
                    <div className="text-xs text-slate-500">
                      Operador: {f.operador}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium " +
                      (online
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700")
                    }
                  >
                    <span
                      className={
                        "h-1.5 w-1.5 rounded-full " +
                        (online ? "bg-emerald-500" : "bg-red-500")
                      }
                    />
                    {online ? "En línea" : "Sin comunicación"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Última transmisión: {formatTime(f.ultimaTransmision)}
                  </span>
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="text-[11px] uppercase text-slate-400">
                    Presión
                  </div>
                  <div className="text-sm font-mono text-slate-900">
                    {f.presion.toFixed(2)}{" "}
                    <span className="text-[10px] text-slate-400">bar</span>
                  </div>

                  <div className="text-[11px] uppercase text-slate-400">
                    Voltaje
                  </div>
                  <div className="text-sm font-mono text-slate-900">
                    {f.voltaje.toFixed(2)}{" "}
                    <span className="text-[10px] text-slate-400">V</span>
                  </div>

                  <div className="text-[11px] uppercase text-slate-400">
                    Potencia
                  </div>
                  <div className="text-sm font-mono text-slate-900">
                    {f.potencia.toFixed(1)}{" "}
                    <span className="text-[10px] text-slate-400">W</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] uppercase text-slate-400">
                    Batería
                  </div>
                  <div
                    className={
                      "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium " +
                      batteryColor
                    }
                  >
                    <span>🔋</span>
                    <span>{f.bateria}%</span>
                  </div>

                  <div className="mt-2 text-[11px] uppercase text-slate-400">
                    Coordenadas
                  </div>
                  <div className="text-[11px] font-mono text-slate-800">
                    Lat: {f.latitud}
                    <br />
                    Lng: {f.longitud}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
