// src/components/TelemetryMap.jsx
import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
  fetchLastTelemetryForMap,
} from "../services/telemetryApi";

// Arreglar los iconos de Leaflet con Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const REFRESH_INTERVAL_MS = 3000; // cada 3 segundos

export function TelemetryMap() {
  const [points, setPoints] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar y refrescar los últimos N puntos
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        const data = await fetchLastTelemetryForMap(120);
        if (!isMounted) return;
        setPoints(data);
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Error cargando datos del mapa");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load(); // carga inicial

    const intervalId = setInterval(load, REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const latlngs = useMemo(
    () =>
      points.map((p) => [p.latitud, p.longitud]),
    [points]
  );

  const lastPoint = points[points.length - 1] || null;

  const center = useMemo(() => {
    if (lastPoint) return [lastPoint.latitud, lastPoint.longitud];
    // fallback Bogotá-ish
    return [4.71, -74.07];
  }, [lastPoint]);

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Mapas · Recorrido reciente
          </h2>
          <p className="text-xs text-slate-500">
            Últimos 120 puntos (~2 minutos) de la fumigadora en tiempo casi real.
          </p>
        </div>
        <div className="text-xs text-right text-slate-500">
          {lastUpdate && (
            <div>
              Actualizado:{" "}
              {lastUpdate.toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          )}
          <div>Puntos: {points.length}</div>
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-200">
        <MapContainer
          center={center}
          zoom={15}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {latlngs.length > 1 && (
            <Polyline positions={latlngs} />
          )}

          {lastPoint && (
            <Marker position={[lastPoint.latitud, lastPoint.longitud]}>
              <Popup>
                <div className="text-xs">
                  <div className="font-semibold mb-1">
                    {lastPoint.fumigadora}
                  </div>
                  <div>Operador: {lastPoint.operador}</div>
                  <div>
                    Lat/Lng: {lastPoint.latitud}, {lastPoint.longitud}
                  </div>
                  <div>
                    V: {lastPoint.voltaje} V · I: {lastPoint.corriente} A
                  </div>
                  <div>Presión: {lastPoint.presion} bar</div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {loading && (
        <p className="text-xs text-slate-400">
          Cargando datos del mapa...
        </p>
      )}
    </section>
  );
}
