/**
 * Saved Vehicles — Server-side service layer.
 *
 * **Mock implementation** using an in-memory Map keyed by visitor ID.
 * When the BED Saved Vehicle Service is available, replace the body
 * of each function with the real HTTP call — the signatures stay the same.
 *
 * Every function accepts a `visitorId` so the BED integration has
 * the context it needs to resolve the correct user store.
 */

const MAX_SAVED = 30;

// ── In-memory store (per-visitor) ────────────────────────────────────

const stores = new Map<string, string[]>();

function getStore(visitorId: string): string[] {
  let store = stores.get(visitorId);
  if (!store) {
    store = [];
    stores.set(visitorId, store);
  }
  return store;
}

// ── Public API (same signatures BED client will use) ─────────────────

/** Retrieve all saved VINs for a visitor. */
export function getAll(visitorId: string): Promise<string[]> {
  return Promise.resolve([...getStore(visitorId)]);
}

/**
 * Save a vehicle by VIN.
 * No-op if already saved. Throws if at capacity.
 * Returns the full updated list.
 */
export function save(visitorId: string, vin: string): Promise<string[]> {
  const store = getStore(visitorId);

  if (store.includes(vin)) {
    return Promise.resolve([...store]);
  }

  if (store.length >= MAX_SAVED) {
    return Promise.reject(new Error(`Cannot save more than ${MAX_SAVED} vehicles.`));
  }

  store.push(vin);
  return Promise.resolve([...store]);
}

/**
 * Remove a saved vehicle by VIN.
 * Returns the full updated list.
 */
export function remove(visitorId: string, vin: string): Promise<string[]> {
  const store = getStore(visitorId);
  const filtered = store.filter((v) => v !== vin);
  stores.set(visitorId, filtered);
  return Promise.resolve([...filtered]);
}

/** Clear all saved vehicles. Returns an empty array. */
export function clearAll(visitorId: string): Promise<string[]> {
  stores.set(visitorId, []);
  return Promise.resolve([]);
}
