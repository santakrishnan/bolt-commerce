# Context & Layout Setup Flow — Architecture Reference

> **Purpose:** Technical reference for Vercel code review. Documents the root layout, provider
> composition, all React context providers, and the SRP/VDP page setup flow.

---

## Table of Contents

1. [Root Layout & Provider Hierarchy](#1-root-layout--provider-hierarchy)
2. [Provider Composition Pattern](#2-provider-composition-pattern)
3. [ThemeProvider](#3-themeprovider)
4. [ArrowProvider (Tracking & Visitor Profiling)](#4-arrowprovider-tracking--visitor-profiling)
5. [QueryProvider (React Query + IndexedDB Persistence)](#5-queryprovider-react-query--indexeddb-persistence)
6. [SearchHistoryProvider](#6-searchhistoryprovider)
7. [FavoritesProvider](#7-favoritesprovider)
8. [LocationProvider](#8-locationprovider)
9. [SearchProvider (Route-Scoped)](#9-searchprovider-route-scoped)
10. [SRP Page Setup Flow](#10-srp-page-setup-flow)
11. [VDP Page Setup Flow](#11-vdp-page-setup-flow)
12. [Context Initialization Timeline](#12-context-initialization-timeline)
13. [File Reference](#13-file-reference)
14. [Questions for Vercel Review](#14-questions-for-vercel-review)

---

## 1. Root Layout & Provider Hierarchy

**File:** `apps/web/src/app/layout.tsx` (Server Component — no `"use client"`)

```
<html>
  <body>
    ┌─────────────────────────────────────────────────────┐
    │  SyncProviders (composed via composeProviders)       │
    │  ┌───────────────────────────────────────────────┐  │
    │  │  1. ThemeProvider        (client, outermost)   │  │
    │  │  ┌─────────────────────────────────────────┐  │  │
    │  │  │  2. ArrowProvider     (client, tracking) │  │  │
    │  │  │  ┌───────────────────────────────────┐  │  │  │
    │  │  │  │  3. QueryProvider  (client, RQ)    │  │  │  │
    │  │  │  │  ┌─────────────────────────────┐  │  │  │  │
    │  │  │  │  │  4. SearchHistoryProvider    │  │  │  │  │
    │  │  │  │  │  ┌───────────────────────┐  │  │  │  │  │
    │  │  │  │  │  │  5. FavoritesProvider │  │  │  │  │  │
    │  │  │  │  │  │                       │  │  │  │  │  │
    │  │  │  │  │  │  ┌─ Suspense ───────┐│  │  │  │  │  │
    │  │  │  │  │  │  │ LocationInit     ││  │  │  │  │  │
    │  │  │  │  │  │  │ (async server)   ││  │  │  │  │  │
    │  │  │  │  │  │  │  ┌────────────┐  ││  │  │  │  │  │
    │  │  │  │  │  │  │  │ Location   │  ││  │  │  │  │  │
    │  │  │  │  │  │  │  │ Provider   │  ││  │  │  │  │  │
    │  │  │  │  │  │  │  │  <Header/> │  ││  │  │  │  │  │
    │  │  │  │  │  │  │  │  {children}│  ││  │  │  │  │  │
    │  │  │  │  │  │  │  └────────────┘  ││  │  │  │  │  │
    │  │  │  │  │  │  └──────────────────┘│  │  │  │  │  │
    │  │  │  │  │  └───────────────────────┘  │  │  │  │  │
    │  │  │  │  └─────────────────────────────┘  │  │  │  │
    │  │  │  └───────────────────────────────────┘  │  │  │
    │  │  └─────────────────────────────────────────┘  │  │
    │  └───────────────────────────────────────────────┘  │
    └─────────────────────────────────────────────────────┘
    <Footer />                    (server, outside providers)
    <FeatureFlagDebug />          (dev only, inside Suspense)
  </body>
</html>
```

### Key Design Decisions

- **Root layout is a Server Component** — reads cookies server-side, renders synchronous HTML shell.
- **`LocationInit` is an async server function** — calls `cookies()` to read `MANUAL_ZIP_COOKIE` before first paint, preventing a flash of default location.
- **`<Suspense>` wraps `LocationInit`** — the shell (`<body>` with min-height) renders immediately while the async cookie read resolves.
- **`<Footer>` is outside all providers** — no provider dependencies, renders as pure server component.
- **Search context is NOT in the root** — it's route-scoped (only mounted on `/used-cars/` pages).

---

## 2. Provider Composition Pattern

**File:** `apps/web/src/shared/providers/compose-providers.tsx`

```typescript
const SyncProviders = composeProviders(
  ThemeProvider,         // 1st — outermost
  ArrowProvider,         // 2nd
  QueryProvider,         // 3rd
  SearchHistoryProvider, // 4th
  FavoritesProvider      // 5th — innermost
);
```

`composeProviders()` is a utility that nests multiple providers left-to-right (outermost-first) without deep JSX indentation. Each provider wraps the next one's children.

### Nesting Rationale

| Order | Provider | Why This Position |
|-------|----------|-------------------|
| 1st | ThemeProvider | Outermost — applies CSS classes to `<html>`, independent of everything |
| 2nd | ArrowProvider | Tracking IDs needed by downstream providers (location, search) |
| 3rd | QueryProvider | React Query client needed by SearchHistory and Favorites |
| 4th | SearchHistoryProvider | Uses React Query for persistence, independent of Favorites |
| 5th | FavoritesProvider | Uses React Query for persistence, innermost sync provider |
| — | LocationProvider | Inside `<Suspense>` — needs async cookie read, separate from sync providers |

---

## 3. ThemeProvider

**File:** `apps/web/src/shared/providers/theme-provider.tsx` (`"use client"`)

### Purpose
Manages light/dark/system theme mode.

### Context Value
```typescript
interface ThemeContextValue {
  state: {
    theme: "light" | "dark" | "system";
  };
  actions: {
    setTheme: (theme: "light" | "dark" | "system") => void;
  };
  meta: {
    isLoading: boolean;
  };
}
```

### Behavior
- Reads system preference via `matchMedia("(prefers-color-scheme: dark)")`
- Applies `light` / `dark` class to `document.documentElement`
- Persists choice (respects system when set to "system")
- Hook: `useTheme()`

---

## 4. ArrowProvider (Tracking & Visitor Profiling)

**File:** `apps/web/src/features/tracking/context/arrow-provider.tsx` (`"use client"`)

### Purpose
Full tracking lifecycle — fingerprinting, session management, and visitor profile fetching.

### Internal Provider Chain (nested inside ArrowProvider)

```
ArrowProvider
  └── FingerprintClientProvider (Fingerprint.js SDK)
        └── FpjsProvider (@fingerprintjs/fingerprintjs-pro-react)
              └── ProfileProvider (session + fingerprint + profile IDs)
                    └── ArrowProfileBridge
                          └── VisitorProfileProvider (visitor profile fetch)
                                └── {children}
```

### Context Value
```typescript
interface ArrowContextValue {
  // Tracking IDs
  sessionId: string | null;
  fingerprintId: string | null;
  profileId: string | null;

  // Fingerprint data (from Fingerprint.js)
  fingerprintData: {
    identity: { visitorId, confidence, visitorFound };
    geo: { city, country, state, stateCode, postalCode, timezone };
    trust: { incognito };
  };

  // Visitor profile (from backend)
  visitorProfile: {
    profileId: string;
    segment?: string;
    isKnown?: boolean;
    features?: Record<string, boolean>;
    userFlags?: { prequalified?, tradeIn?, testDrive? };
  };

  // Loading states
  isReady: boolean;
  isLoading: boolean;
  isProfileLoading: boolean;

  // Methods
  getTrackingIds(): { sessionId, fingerprintId, profileId };
  refreshIds(): Promise<void>;
  refreshProfile(): Promise<void>;
}
```

### Initialization Flow
```
1. FingerprintClientProvider loads Fingerprint.js SDK
   (env: NEXT_PUBLIC_FINGERPRINT_API_KEY, NEXT_PUBLIC_FINGERPRINT_REGION)
   ↓
2. ProfileProvider bootstraps from server cookies (fast path)
   → If cookies present: restore sessionId, fingerprintId, profileId
   → If not: call Fingerprint SDK, then POST /api/v1/session
   ↓
3. VisitorProfileProvider auto-fetches once fingerprintId is available
   → GET /api/v1/visitor-profile?visitorId={fingerprintId}
   → Cache TTL: 5 minutes
   ↓
4. ArrowProvider sets isReady=true when all IDs are resolved
```

### Hook: `useArrow()`

---

## 5. QueryProvider (React Query + IndexedDB Persistence)

**File:** `apps/web/src/shared/providers/query-provider.tsx` (`"use client"`)

### Purpose
TanStack React Query client with IndexedDB persistence for offline-capable data.

### Configuration
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,    // Data fresh for 30 seconds
      gcTime: 24 * 60 * 60 * 1000, // Keep unused data 24 hours (for persistence)
      retry: 1,             // Retry once on failure
    },
  },
});
```

### Persistence Rules
- Uses `PersistQueryClientProvider` with IndexedDB
- Only persists queries with specific prefixes:
  - `"saved-vehicles"` (Favorites)
  - `"search-history"` (Search History)
- Cache buster key: `"v2"` — increment to invalidate all persisted data

### Why IndexedDB?
Favorites and search history survive page refreshes and browser restarts for up to 24 hours without any backend.

---

## 6. SearchHistoryProvider

**File:** `apps/web/src/features/search/context/search-history-provider.tsx` (`"use client"`)

### Purpose
Manages recent search queries with optimistic mutations.

### Context Value
```typescript
interface SearchHistoryContextValue {
  searches: SearchEntry[];
  isLoaded: boolean;

  addSearch: (query: string, url: string, type?: "nlp" | "filter") => void;
  removeSearch: (id: string) => void;
  clearAll: () => void;
}

interface SearchEntry {
  id: string;
  query: string;
  url: string;
  timestamp: string;
  type: "nlp" | "filter";
}
```

### Behavior
- Stores up to 10 recent searches
- Uses React Query with IndexedDB persistence (survives refresh)
- Optimistic mutations — UI updates immediately, sync happens server-side
- Deduplicates by query string

### Hook: `useSearchHistory()`

---

## 7. FavoritesProvider

**File:** `apps/web/src/features/favorites/context/favorites-provider.tsx` (`"use client"`)

### Purpose
Manages saved/favorite vehicles by VIN.

### Context Value
```typescript
interface FavoritesContextValue {
  savedVins: string[];
  savedCount: number;
  isLoaded: boolean;

  addVehicle: (vin: string) => void;
  removeVehicle: (vin: string) => void;
  toggleVehicle: (vin: string) => void;
  isVehicleSaved: (vin: string) => boolean;
  clearAll: () => void;
}
```

### Behavior
- Stores VINs in React Query cache, persisted to IndexedDB
- Optimistic mutations — heart icon toggles instantly
- `isVehicleSaved(vin)` used by car cards to show filled/unfilled heart

### Hook: `useFavorites()`

---

## 8. LocationProvider

**File:** `apps/web/src/shared/providers/location-provider.tsx` (`"use client"`)

### Purpose
Manages user location (ZIP code, city, state) with fingerprint geo fallback.

### Context Value
```typescript
interface LocationContextValue {
  state: {
    displayZip: string;           // Fingerprint zip OR manual override
    displayCity: string;          // Fingerprint city (cleared if manual)
    displayState: string;         // Fingerprint state
    heroState: StateKey;          // Resolved from zip prefix → state mapping
    backgroundImage: string;      // Desktop hero image URL
    mobileBackgroundImage: string;
    isManualZip: boolean;
    isResolved: boolean;          // True once initialized
  };
  actions: {
    setZip: (zip: string) => void;     // Manual override, saves cookie
    clearManualZip: () => void;        // Revert to fingerprint geo
  };
}
```

### Initialization Flow
```
Server Side:
  1. LocationInit reads MANUAL_ZIP_COOKIE via cookies()
  2. Validates against ZIP_RE (/^\d{5}$/)
  3. Passes initialZip to LocationProvider

Client Side:
  4. If initialZip → use it immediately (no flash)
  5. If no initialZip → wait for Arrow fingerprintData.geo
  6. Resolve heroState from zip prefix ranges
  7. Set isResolved=true
```

### Cookie Management
- Cookie name: `arrow_manual_zip`
- Cookie duration: 30 days
- Set on `setZip()`, cleared on `clearManualZip()`
- Tracking events: `location_zip_changed`, `location_zip_cleared`

### Hook: `useLocation()`

---

## 9. SearchProvider (Route-Scoped)

**File:** `apps/web/src/features/search/context/search-context.tsx` (`"use client"`)

### Purpose
Full search state management — vehicles, filters, pagination, facets, smart filters.

**Not in root layout** — mounted only on `/used-cars/` pages via `<SearchWrapper>`.

### Context Value
```typescript
interface SearchContextValue {
  // Vehicle results
  vehiclePool: Vehicle[];
  totalCount: number;

  // Filter state
  filterState: FilterState;
  availableFilters: AvailableFilters;
  facetCounts: FacetCounts;
  smartFilters: SmartFilterGroup[];

  // Search
  searchQuery: string;
  labelFilter: string;
  refineSearchFilters: RefineSearchFilter[];

  // Pagination & Sort
  currentPage: number;
  sortOption: "recommended" | "low-high" | "high-low";

  // UI state
  isFilterOpen: boolean;
  progress: number;
  isProgressVisible: boolean;

  // Loading states
  isSearching: boolean;
  isInitialLoading: boolean;
  isFilterPending: boolean;
  loadingFacetSections: FacetSection[];

  // Actions
  applyFiltersSearch: (newFilterState: FilterState, opts?) => void;
  handleSearch: () => void;
  // + all setters
}
```

### Internal Architecture

```
SearchProvider ("use client")
  ├── useSearchState()      — All React state (vehicles, filters, pagination)
  ├── useDebouncedValue()   — 300ms debounce on search/filter payloads
  ├── useSearchQueries()    — React Query: vehicle search + filter counts
  └── useTransition()       — Non-blocking filter state updates
```

### Two Parallel React Query Hooks
```
useSearchQueries()
  ├── vehicleSearchQuery    → POST /api/search          (vehicles + smart filters)
  └── filtersQuery          → POST /api/search/filters   (facet counts only)
```

Both debounced at 300ms. Filter query only runs when `updatedSections.length > 0`.

### Hook: `useSearchContext()`

---

## 10. SRP Page Setup Flow

```
User navigates to /used-cars/sedan?q=toyota
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│  page.tsx (Server Component)                         │
│                                                      │
│  1. await Promise.all([params, searchParams])        │
│  2. resolveRoute(segments) → { type: "srp", ... }   │
│  3. Canonical URL enforcement (redirect if needed)   │
│                                                      │
│  return (                                            │
│    <SrpShell>              ← Server layout wrapper   │
│      <Suspense fallback={<VehicleGridSkeleton />}>   │
│        <SearchWrapper                                │
│          initialBodyType="Sedan"                     │
│          initialSearchQuery="toyota"                 │
│        />                                            │
│      </Suspense>                                     │
│    </SrpShell>                                       │
│  )                                                   │
└──────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│  SearchWrapper (Server Component — async)            │
│                                                      │
│  1. getInventoryPool() → vehicle pool                │
│  2. generateQuickFilterPills(pool) → NLP pills       │
│  3. fetchInitialSrpResults("Sedan", "toyota")        │
│     → "use cache" + cacheLife("srp")                 │
│     → returns 20 vehicles + totalCount               │
│                                                      │
│  return (                                            │
│    <SearchProvider                                   │
│      initialVehicles={results.vehicles}              │
│      initialTotalCount={results.totalCount}          │
│      key={clientKey}  ← forces remount on URL change │
│    >                                                 │
│      <Suspense>                                      │
│        <SearchClient initialQuickFilters={pills} />  │
│      </Suspense>                                     │
│    </SearchProvider>                                 │
│  )                                                   │
└──────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│  SearchProvider ("use client")                       │
│                                                      │
│  1. useSearchState() — init from server data         │
│  2. useDebouncedValue() — 300ms debounce             │
│  3. useSearchQueries() — React Query hooks           │
│     → vehicleSearchQuery (POST /api/search)          │
│     → filtersQuery (POST /api/search/filters)        │
│  4. Provides SearchContext to children               │
└──────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│  SearchClient ("use client")                         │
│                                                      │
│  1. Syncs URL ↔ React state bidirectionally          │
│  2. Builds activeFilters[] from FilterState          │
│  3. Renders:                                         │
│     ├── FilterSidebar (filter controls)              │
│     ├── SearchHero (search bar + quick filters)      │
│     └── VehicleResults (grid + pagination)           │
│         └── CarCard × N (with router.prefetch)       │
└──────────────────────────────────────────────────────┘
```

### SRP Data Flow on Filter Change

```
User selects "SUV" in filter sidebar
  ↓
handleApplyFilters(newFilterState)
  ↓
applyFiltersSearch(newFilterState)
  ↓
changedFacetSections() → ["Body Style"]
  ↓
startFilterTransition(() => {
  setFilterState(newState)
  setPendingFacetSections(["Body Style"])
  setLoadingFacetSections(["Body Style"])
})
  ↓
useDebouncedValue (300ms)
  ↓
React Query fires TWO parallel requests:
  ├── POST /api/search       → new vehicles + totalCount
  └── POST /api/search/filters → updated facet counts for "Body Style"
  ↓
Responses update context:
  ├── setVehiclePool(newVehicles)
  ├── setTotalCount(newCount)
  ├── setAvailableFilters(patched)
  ├── setFacetCounts(patched)
  └── setLoadingFacetSections([])  ← clears loading
  ↓
UI re-renders with new results
URL updates via router.replace()
```

---

## 11. VDP Page Setup Flow

```
User navigates to /used-cars/details/toyota/camry/xse/2024/5TDFZRBH5RS100015
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│  page.tsx (Server Component)                         │
│                                                      │
│  1. resolveRoute(segments) → { type: "details", ... }│
│  2. Canonical URL enforcement                        │
│  3. vehicleBundlePromise = getVehicleBundleCached()  │
│     → NOT awaited (enables streaming)                │
│                                                      │
│  return (                                            │
│    <Suspense fallback={<VdpSkeleton />}>             │
│      <UsedCarsDetails                                │
│        vehicleBundlePromise={vehicleBundlePromise}   │
│        make, model, trim, year, vin                  │
│      />                                              │
│    </Suspense>                                       │
│  )                                                   │
└──────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│  UsedCarsDetails (Server Component — async)          │
│                                                      │
│  1. await vehicleBundlePromise                       │
│     → { vinData, dealerInfo }                        │
│  2. Destructure all data from vinData                │
│  3. Render component tree:                           │
│     ├── VehiclePDP (Client — carousel, scroll)       │
│     │   ├── promotionSlot → <Suspense>               │
│     │   │   └── AuthAwarePromotions (Server)         │
│     │   └── testDriveSlot → <Suspense>               │
│     │       └── AuthAwarePromotions (Server)         │
│     ├── VehicleDetailsTabs (Client — tab switching)  │
│     ├── VehicleRating (Server)                       │
│     ├── DealerNotesSection (Server)                  │
│     └── DealerInfoCard (Server)                      │
└──────────────────────────────────────────────────────┘
```

(See separate VDP Implementation Flow document for full details.)

---

## 12. Context Initialization Timeline

```
t=0ms   Page HTML streams
        ├── ThemeProvider initializes (sync, reads system preference)
        ├── QueryProvider creates QueryClient (sync)
        ├── SearchHistoryProvider loads from IndexedDB (async, via RQ)
        └── FavoritesProvider loads from IndexedDB (async, via RQ)

t=0ms   LocationInit resolves (server-side cookie read)
        └── LocationProvider initializes with initialZip or null

t=~50ms ArrowProvider starts
        └── FingerprintClientProvider loads Fingerprint.js SDK

t=~200ms ProfileProvider bootstraps from cookies (fast path)
         └── sessionId, fingerprintId, profileId available

t=~500ms VisitorProfileProvider fetches visitor profile
         └── GET /api/v1/visitor-profile
         └── visitorProfile available, isReady=true

t=~300ms LocationProvider resolves fingerprint geo (if no manual zip)
         └── displayZip, heroState, backgroundImage set
         └── isResolved=true

--- Only on /used-cars/ routes ---

t=0ms   SearchWrapper fetches initial SRP data (server-side, cached)
        └── SearchProvider initializes with server vehicles
        └── SearchClient renders with initial data (no loading flash)

t=~300ms User interacts → debounced search query fires
         └── React Query fetches vehicles + filter counts
```

---

## 13. File Reference

### Root Layout
| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout — provider composition, async cookie read |
| `shared/providers/compose-providers.tsx` | `composeProviders()` utility |

### Global Providers (Root-Level)
| File | Provider | Hook |
|------|----------|------|
| `shared/providers/theme-provider.tsx` | ThemeProvider | `useTheme()` |
| `features/tracking/context/arrow-provider.tsx` | ArrowProvider | `useArrow()` |
| `features/tracking/context/profile-context.tsx` | ProfileProvider | (internal) |
| `features/tracking/context/fingerprint-client.tsx` | FingerprintClientProvider | (internal) |
| `features/tracking/context/visitor-profile.tsx` | VisitorProfileProvider | (internal) |
| `shared/providers/query-provider.tsx` | QueryProvider | (React Query hooks) |
| `features/search/context/search-history-provider.tsx` | SearchHistoryProvider | `useSearchHistory()` |
| `features/favorites/context/favorites-provider.tsx` | FavoritesProvider | `useFavorites()` |
| `shared/providers/location-provider.tsx` | LocationProvider | `useLocation()` |

### Route-Scoped Providers (Search Pages Only)
| File | Purpose |
|------|---------|
| `features/search/context/search-wrapper.tsx` | Server component — fetches initial SRP data |
| `features/search/context/search-context.tsx` | SearchProvider + useSearchContext |
| `features/search/context/search-context-state.ts` | `useSearchState()` — all search state |
| `features/search/context/search-context-queries.ts` | `useSearchQueries()` — React Query hooks |
| `features/search/context/search-context-types.ts` | TypeScript interfaces |
| `features/search/context/search-context-utils.ts` | `fetchVehicleSearch()`, `fetchFilters()` |
| `features/search/context/search-client.tsx` | Client component — URL sync, renders UI |

### API Routes (Search)
| File | Route | Purpose |
|------|-------|---------|
| `app/api/search/route.ts` | `POST /api/search` | Vehicle search + smart filters |
| `app/api/search/filters/route.ts` | `POST /api/search/filters` | Facet counts only |

---

## 14. Questions for Vercel Review

1. **Async server function in layout:** We use an async `LocationInit` function inside the layout to read cookies server-side. Is wrapping this in `<Suspense>` the correct Next.js 16 pattern for async operations in layouts?

2. **Provider composition:** We use `composeProviders()` to nest 5 client-side providers. Is there a performance concern with deeply nested client providers in the root layout? Should any of these be lazy-loaded?

3. **IndexedDB persistence:** We persist React Query caches (favorites, search history) to IndexedDB with a 24-hour TTL. Is this pattern compatible with Next.js server-side rendering, or could it cause hydration mismatches?

4. **Route-scoped SearchProvider:** We mount SearchProvider only on `/used-cars/` pages via `<SearchWrapper>`. The `key={clientKey}` forces remount when URL-derived inputs change. Is this the recommended pattern for route-scoped context, or should we use a different approach?

5. **Two-query search strategy:** We fire two parallel React Query requests (vehicles + filter counts) on every filter change. The filter query is conditional (`enabled: updatedSections.length > 0`). Is this efficient, or should we combine them into a single request?

6. **Debounce timing:** We debounce search/filter requests at 300ms. Is this appropriate for the `useTransition` + React Query combination, or does `useTransition` already handle batching?

7. **Arrow fingerprint in root layout:** The ArrowProvider (Fingerprint.js SDK) loads in the root layout for all pages. Should we defer this to only pages that need tracking, or is the root layout the correct place?
