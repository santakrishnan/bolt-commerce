/**
 * Mock API service for saved/favorite vehicles.
 *
 * Simulates a REST-like backend with in-memory persistence and artificial
 * network latency. In production this would hit a real endpoint; the
 * interface is kept identical so the swap is seamless.
 *
 * Endpoints modelled:
 *   GET    /saved-vehicles          → getAllSavedVehicles()
 *   POST   /saved-vehicles/:vin     → saveVehicle(vin)
 *   DELETE /saved-vehicles/:vin     → unsaveVehicle(vin)
 *   DELETE /saved-vehicles          → clearAllSavedVehicles()
 */

const MAX_SAVED = 30;

// Key used in IndexedDB to persist the mock store across refreshes
const IDB_KEY = "saved-vehicles-store";

// ── In-memory store (kept as a cached copy; persisted to IDB) ──────────────

let store: string[] = [];

async function readStore(): Promise<string[]> {
  if (typeof window === "undefined") {
    return store;
  }
  try {
    const { idbGet } = await import("~/lib/indexeddb");
    const val = await idbGet<string[]>(IDB_KEY);
    if (Array.isArray(val)) {
      store = val;
    }
  } catch (_err) {
    // ignore — best-effort
  }
  return store;
}

async function writeStore(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const { idbSet } = await import("~/lib/indexeddb");
    await idbSet(IDB_KEY, store);
  } catch (_err) {
    // ignore — best-effort
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Simulate network latency (50-150 ms). */
function simulateLatency(): Promise<void> {
  const ms = 50 + Math.random() * 100;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Retrieve the full list of saved VINs. */
export async function getAllSavedVehicles(): Promise<string[]> {
  await simulateLatency();
  await readStore();
  return [...store];
}

/**
 * Save a vehicle by VIN.
 * Returns the updated list of saved VINs.
 * Throws if at capacity or duplicate.
 */
export async function saveVehicle(vin: string): Promise<string[]> {
  await simulateLatency();

  await readStore();

  if (store.includes(vin)) {
    return [...store];
  }

  if (store.length >= MAX_SAVED) {
    throw new Error(`Cannot save more than ${MAX_SAVED} vehicles.`);
  }

  store = [...store, vin];
  await writeStore();
  return [...store];
}

/**
 * Remove a saved vehicle by VIN.
 * Returns the updated list of saved VINs.
 */
export async function unsaveVehicle(vin: string): Promise<string[]> {
  await simulateLatency();
  await readStore();
  store = store.filter((v) => v !== vin);
  await writeStore();
  return [...store];
}

/** Clear every saved vehicle. Returns an empty array. */
export async function clearAllSavedVehicles(): Promise<string[]> {
  await simulateLatency();
  store = [];
  await writeStore();
  return [];
}
