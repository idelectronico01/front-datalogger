// src/App.jsx
import { useState } from "react";
import { RealtimeTelemetryTable } from "./components/RealtimeTelemetryTable";
import { TelemetryMap } from "./components/TelemetryMap";
import { FumigatorsStatusCards } from "./components/FumigatorsStatusCards";

export default function App() {
  const [activeTab, setActiveTab] = useState("realtime"); // 'realtime' | 'history' | 'maps' | 'config'

  const baseBtn =
  "w-full text-left px-3 py-2 rounded-lg transition-colors text-sm";

  const getBtnClasses = (tab) =>
    activeTab === tab
      ? baseBtn + " bg-white text-[#DA291C] font-semibold"
      : baseBtn + " text-white/90 hover:bg-white/20";


  let title = "";
  let subtitle = "";

  switch (activeTab) {
    case "realtime":
      title = "Datos en tiempo real";
      subtitle = "Lecturas en vivo de las fumigadoras en campo.";
      break;
    case "maps":
      title = "Mapas";
      subtitle = "Visualización geográfica del recorrido reciente.";
      break;
    case "history":
      title = "Estado de fumigadoras";
      subtitle =
        "Vista rápida de cada equipo con datos en tiempo real (sin histórico).";
      break;
    case "config":
      title = "Configuración";
      subtitle = "Parámetros del sistema y dispositivos.";
      break;
    default:
      title = "Panel de monitoreo";
      subtitle = "";
  }

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900">
      {/* Menú lateral */}
      <aside className="w-56 bg-[#DA291C] text-white flex flex-col py-4 px-3 fixed inset-y-0 left-0">
        <div className="mb-6 px-2">
          <div className="text-xs font-semibold tracking-wide uppercase text-slate-400">
            Datalogger
          </div>
          <div className="mt-1 text-sm font-semibold">Fumigación</div>
        </div>

        <nav className="space-y-1 flex-1">
          <button
            className={getBtnClasses("realtime")}
            onClick={() => setActiveTab("realtime")}
          >
            Datos en tiempo real
          </button>
          <button
            className={getBtnClasses("history")}
            onClick={() => setActiveTab("history")}
          >
            Histórico
          </button>
          <button
            className={getBtnClasses("maps")}
            onClick={() => setActiveTab("maps")}
          >
            Mapas
          </button>
          <button
            className={getBtnClasses("config")}
            onClick={() => setActiveTab("config")}
          >
            Configuración
          </button>
        </nav>

        <div className="mt-auto px-2 text-xs text-slate-400">
          Mockup · Front Datalogger
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 ml-56 p-6 space-y-6">
        {/* Encabezado principal */}
        <header className="mb-2">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </header>

        {/* Contenido según pestaña */}
        {activeTab === "realtime" && <RealtimeTelemetryTable />}
        {activeTab === "maps" && <TelemetryMap />}

        {activeTab === "history" && <FumigatorsStatusCards />}

        {activeTab === "config" && (
          <div className="text-sm text-slate-500">
            Aquí irán opciones para configurar dispositivos, intervalos, etc.
          </div>
        )}
      </main>
    </div>
  );
}
