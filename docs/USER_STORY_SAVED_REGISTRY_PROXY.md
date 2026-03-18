# User Story: Saved Registry Proxy API — Favorites & Search History

## Epic

**Saved Registry Service Integration**

## Story

As a frontend developer, I want saved vehicles (favorites) and recent search history to flow through a server-side proxy API backed by TanStack Query with IndexedDB persistence, so that the data layer is decoupled from the storage backend and can seamlessly switch from the current mock implementation to the BED (Backend) services when they are ready.

## Background

Previously, favorites and search history were stored directly in the browser's IndexedDB via client-side code. This approach:

- Had no server-side awareness of user data
- Could not sync across devices or sessions
- Required a full rewrite when the BED services become available

The new architecture introduces a **proxy API layer** inside the Next.js app that abstracts the storage backend behind a consistent interface.

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Browser                                                      │
│                                                               │
│  TanStack Query (cache-first from IndexedDB)                  │
│       │                                                       │
│       ▼                                                       │
│  Client API Services (fetch with credentials: "include")      │
│       │                                                       │
│       ▼                                                       │
│  /api/saved-registry/vehicles     ← Proxy Route (Next.js)    │
│  /api/saved-registry/search-history                           │
│       │                                                       │
│       ▼                                                       │
│  Server Service Layer (mock in-memory)                        │
│       │                                                       │
│       ▼  (future)                                             │
│  BED Saved Vehicle Service / BED Recent Search Service        │
└──────────────────────────────────────────────────────────────┘
```

## Acceptance Criteria

### Proxy API Routes

- [x] `GET /api/saved-registry/vehicles` — Returns all saved VINs for the visitor
- [x] `POST /api/saved-registry/vehicles` — Saves a vehicle by VIN `{ vin }`
- [x] `DELETE /api/saved-registry/vehicles/:vin` — Removes a single saved vehicle
- [x] `DELETE /api/saved-registry/vehicles` — Clears all saved vehicles
- [x] `GET /api/saved-registry/search-history` — Returns all search entries
- [x] `POST /api/saved-registry/search-history` — Adds a search entry `{ query, url, type? }`
- [x] `DELETE /api/saved-registry/search-history/:id` — Removes a single search entry
- [x] `DELETE /api/saved-registry/search-history` — Clears all search history

### Visitor Identity

- [x] All routes use `extractArrowIds()` from `~/lib/arrow/server-api` to resolve visitor identity
- [x] Fingerprint ID is extracted from Arrow headers first, then falls back to httpOnly cookies
- [x] Anonymous fallback (`"anonymous"`) when no identity is available

### Server Service Layer (Mock)

- [x] `vehicles.service.ts` — In-memory Map keyed by visitor ID, max 30 vehicles
- [x] `search-history.service.ts` — In-memory Map keyed by visitor ID, max 10 entries, dedup by query
- [x] Function signatures match what BED client calls will use (drop-in replacement)
- [x] All functions return `Promise<T>` for BED compatibility

### Client API Services

- [x] `saved-vehicles-api.ts` — Rewritten from IndexedDB to `fetch()` calls to proxy routes
- [x] `search-history-api.ts` — Rewritten from IndexedDB to `fetch()` calls to proxy routes
- [x] All requests use `credentials: "include"` for cookie-based identity
- [x] Function signatures unchanged from previous IndexedDB implementation
- [x] Backward-compatible type re-exports (`SearchEntry`)

### TanStack Query — Cache-First Pattern

- [x] `PersistQueryClientProvider` restores IndexedDB cache **before** children render
- [x] Users see last-known data immediately (zero network wait)
- [x] Restored data is subject to `staleTime` (30s) — triggers background refetch
- [x] API response replaces stale cache; updated cache persists back to IndexedDB
- [x] Only `saved-vehicles` and `search-history` query keys are persisted
- [x] `gcTime` set to 24 hours so cache survives long enough for persistence
- [x] Cache buster (`v2`) for schema migration safety

### BED Migration Readiness

- [x] Commented-out `createArrowServerClient` scaffolding in each route file
- [x] `extractForwardHeaders` import commented for BED header forwarding
- [x] Each route has inline BED migration instructions in JSDoc comments
- [x] Service layer designed for drop-in replacement (same function signatures)

### Code Quality

- [x] Zero TypeScript errors in all saved-registry files
- [x] Zero Biome lint errors (format, imports, async/await, non-null assertions)
- [x] All 10 search history unit tests passing
- [x] No unused imports or dead code

## Files Changed

### New Files

| File | Purpose |
|------|---------|
| `src/lib/saved-registry/types.ts` | Shared types (`SearchEntry`, `SavedRegistryResponse`) |
| `src/lib/saved-registry/vehicles.service.ts` | Server-side mock service for saved vehicles |
| `src/lib/saved-registry/search-history.service.ts` | Server-side mock service for search history |
| `src/lib/saved-registry/index.ts` | Barrel exports |
| `src/app/api/saved-registry/vehicles/route.ts` | Proxy route: GET, POST, DELETE |
| `src/app/api/saved-registry/vehicles/[vin]/route.ts` | Proxy route: DELETE single vehicle |
| `src/app/api/saved-registry/search-history/route.ts` | Proxy route: GET, POST, DELETE |
| `src/app/api/saved-registry/search-history/[id]/route.ts` | Proxy route: DELETE single entry |

### Modified Files

| File | Change |
|------|--------|
| `src/services/saved-vehicles-api.ts` | IndexedDB → fetch proxy calls |
| `src/services/search-history-api.ts` | IndexedDB → fetch proxy calls |
| `src/components/providers/query-provider.tsx` | `persistQueryClient` → `PersistQueryClientProvider` |
| `src/lib/routes/constants.ts` | Added `API_ROUTES.SAVED_VEHICLES` and `API_ROUTES.SEARCH_HISTORY` |
| `src/lib/queries/saved-vehicles.ts` | Updated docs |
| `src/lib/queries/search-history.ts` | Updated docs |

## BED Migration Steps

When the BED services are ready:

1. **Configure environment variables**:
   - `BED_SAVED_REGISTRY_URL` — Base URL for the BED service
   - `BED_API_KEY` — Authentication token

2. **Uncomment the BED client** in each route file:
   ```typescript
   import { createArrowServerClient } from "~/lib/arrow/server-api";

   const bedClient = createArrowServerClient({
     baseUrl: process.env.BED_SAVED_REGISTRY_URL!,
     authToken: process.env.BED_API_KEY,
     serviceName: "SavedVehicles", // or "SearchHistory"
   });
   ```

3. **Replace service calls** with BED client calls:
   ```typescript
   // Before (mock):
   const data = await vehiclesService.getAll(visitorId);

   // After (BED):
   const ids = extractArrowIds(req);
   const { data } = await bedClient.get("/vehicles", {
     ids,
     headers: extractForwardHeaders(req),
   });
   ```

4. **Remove the mock service files** once BED is fully validated

## Test Plan

- [x] Search history unit tests pass (10/10)
- [ ] Manual: Save a vehicle → verify it appears in favorites
- [ ] Manual: Remove a favorite → verify it disappears
- [ ] Manual: Perform a search → verify it appears in recent searches
- [ ] Manual: Delete a search entry → verify removal
- [ ] Manual: Clear all history → verify empty state
- [ ] Manual: Refresh page → verify cached data loads instantly, then refreshes from API
- [ ] Manual: Open in incognito → verify graceful degradation (no persisted cache)

## Dependencies

- TanStack Query v5 with `@tanstack/react-query-persist-client`
- Arrow SDK (`extractArrowIds`, `createArrowServerClient`)
- IndexedDB (via `~/lib/indexeddb`) for TanStack Query cache persistence

## Story Points

**8** — Multiple layers (proxy routes, services, client APIs, TanStack persistence) with BED migration scaffolding
