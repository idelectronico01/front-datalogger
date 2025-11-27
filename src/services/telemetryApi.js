// src/services/telemetryApi.js

// TODO: cuando tengas el back, pon aquí la URL base
// export const API_BASE_URL = "https://tu-api.com";

const MOCK_INTERVAL_MS = 2000;
const MAX_ROWS = 20;

// Generador de datos MOCK (luego lo puedes borrar si no lo necesitas)
function generateRandomTelemetryRow(id) {
  const baseLat = 4.71;
  const baseLng = -74.07;
  const randomOffset = () => (Math.random() - 0.5) * 0.01;

  const fumigadoras = ["Fumigadora 01", "Fumigadora 02", "Fumigadora 03"];
  const operadores = ["Juan Pérez", "María López", "Carlos Gómez", "Ana Ruiz"];

  return {
    id,
    timestamp: new Date().toISOString(),
    latitud: +(baseLat + randomOffset()).toFixed(6),
    longitud: +(baseLng + randomOffset()).toFixed(6),
    presion: +(1.8 + Math.random() * 1.0).toFixed(2),
    voltaje: +(11.5 + Math.random() * 1.5).toFixed(2),
    corriente: +(1.0 + Math.random() * 1.5).toFixed(2),
    fumigadora: fumigadoras[Math.floor(Math.random() * fumigadoras.length)],
    operador: operadores[Math.floor(Math.random() * operadores.length)],
  };
}

/**
 * Carga inicial (por ejemplo, últimos N registros)
 * Aquí luego haces un fetch real al backend.
 */
export async function fetchInitialTelemetry() {
  // TODO: reemplazar por llamada real, ej:
  // const res = await fetch(`${API_BASE_URL}/telemetry/latest`);
  // if (!res.ok) throw new Error("Error cargando telemetría");
  // return await res.json();

  // MOCK: simulamos 5 registros iniciales
  const rows = [];
  for (let i = 1; i <= 5; i++) {
    rows.unshift(generateRandomTelemetryRow(i));
  }
  return rows;
}

/**
 * Suscripción a datos en "tiempo real".
 * En el futuro podría ser un WebSocket, SSE, etc.
 * Retorna una función para cancelar la suscripción.
 */
export function subscribeToTelemetryUpdates({ onData, onError }) {
  // TODO (futuro):
  // - abrir WebSocket / EventSource
  // - escuchar mensajes
  // - llamar a onData(payload)

  let currentId = 5;

  const intervalId = setInterval(() => {
    try {
      currentId += 1;
      const newRow = generateRandomTelemetryRow(currentId);
      onData?.(newRow);
    } catch (err) {
      console.error(err);
      onError?.(err);
    }
  }, MOCK_INTERVAL_MS);

  // función de cleanup
  return () => clearInterval(intervalId);
}

// Utilidad para limitar filas
export function appendAndTrimRows(existingRows, newRow, maxRows = MAX_ROWS) {
  const updated = [newRow, ...existingRows];
  return updated.slice(0, maxRows);
}

/**
 * Datos para el mapa:
 * En el futuro: este será tu endpoint que devuelve los últimos 120 puntos (2 min a 1 Hz).
 */
export async function fetchLastTelemetryForMap(count = 120) {
  // TODO: reemplazar por llamada real, ej:
  // const res = await fetch(`${API_BASE_URL}/telemetry/last?limit=${count}`);
  // if (!res.ok) throw new Error("Error cargando datos del mapa");
  // return await res.json();

  const rows = [];
  for (let i = 1; i <= count; i++) {
    rows.push(generateRandomTelemetryRow(i));
  }
  return rows;
}
