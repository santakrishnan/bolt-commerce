# Search Page Layout Best Practices Audit

**Date:** April 1, 2026
**Scope:** `apps/web/src/features/search/` · `apps/web/src/app/used-cars/[[...params]]/` · `apps/web/src/app/layout.tsx`
**Framework context:** Next.js 15 (App Router, RSC), TanStack Query v5

---

## Render Chain

```
app/layout.tsx (RSC)
  └─ SyncProviders (QueryProvider, SearchHistoryProvider, …) — client
       └─ Suspense → LocationInit (async RSC)
            └─ used-cars/page.tsx (async RSC)
                 └─ SrpShell (RSC)                    ← layout wrapper
                      └─ Suspense[fallback=null]
                           └─ SearchWrapper (async RSC)  ← data bootstrap
                                └─ SearchProvider (client context)
                                     └─ Suspense[fallback=null]
                                          └─ SearchClient (client)
                                               ├─ SearchHero (client)
                                               ├─ FilterSidebar (client)
                                               └─ VehicleResults (client)
```

---

## 🔴 Critical

### 1. `useEffect` missing dependency array — runs on every render

**File:** `apps/web/src/features/search/context/search-client.tsx` — line 161

```tsx
useEffect(() => {
  if (prevPageRef.current === currentPage) return;
  prevPageRef.current = currentPage;
  window.scrollTo({ top: 0, behavior: "smooth" });
}); // ← no dep array — fires on every render
```

Every state update in `SearchClient` (e.g., a filter change, a sort change) triggers this effect and evaluates `window.scrollTo`. On most renders `prevPageRef.current === currentPage` short-circuits, but the effect is still scheduled and run by the React scheduler on every single render, including high-frequency ones during debounced typing.

**Fix:** Add `[currentPage]` as the dependency array.

```tsx
useEffect(() => {
  if (prevPageRef.current === currentPage) return;
  prevPageRef.current = currentPage;
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [currentPage]);
```

---

### 2. Both `Suspense` fallbacks are `null` — visible blank flash on load

**Files:**
- `apps/web/src/features/search/context/search-wrapper.tsx` — line 58
- `apps/web/src/app/used-cars/[[...params]]/page.tsx` — line 82

```tsx
// search-wrapper.tsx
<Suspense fallback={null}>
  <SearchClient initialQuickFilters={suggestedPills} />
</Suspense>

// used-cars/page.tsx
<SrpShell initialBodyType={route.filters.bodyType}>
  <Suspense fallback={null}>
    <SearchWrapper ... />
  </Suspense>
</SrpShell>
```

`SearchWrapper` is the entire above-the-fold SRP content (hero + filter + results). `fallback={null}` means the user sees only the gray `bg-gray-50` shell from `SrpShell` while:

1. The async RSC (`SearchWrapper`) resolves server-side data
2. The client bundle hydrates

This creates a visible blank flash, especially on slow connections or cold-start serverless deployments.

**Fix:** Add a meaningful skeleton that mirrors the real layout dimensions — a hero bar placeholder + a grid of skeleton cards — so layout shift is minimised and the page appears populated immediately.

```tsx
<Suspense fallback={<SrpSkeleton />}>
  <SearchWrapper ... />
</Suspense>
```

---

### 3. TanStack Query → `useEffect` → Context state anti-pattern

**File:** `apps/web/src/features/search/context/search-context-queries.ts` — line 57

Every time a query resolves, a `useEffect` fires and calls 3–4 `setState` callbacks from context — producing a **second render pass** after TanStack Query already triggered one:

```
Query resolves → TanStack re-renders (render 1)
  → useEffect scheduled
    → setState × 4 (setVehiclePool, setTotalCount, setSmartFilters, setAppliedFilters)
      → another render cycle (render 2)
```

This doubles the render cost on every search response and creates an intermediate "stale UI" frame where the query data has resolved but the context state has not yet updated.

The correct TanStack Query pattern exposes transformed data directly from the hook return value using `select`, removing the need for syncing effects entirely:

```ts
// Instead of useEffect + multiple setState callbacks:
const vehicleSearchQuery = useQuery({
  queryKey: ["vehicle-search", request],
  queryFn: () => fetchVehicleSearch(request),
  select: (data) => ({
    vehicles: data.vehicles,
    totalCount: Math.min(data.totalCount, data.metadata.inventorySize),
    smartFilters: data.smartFilters ?? [],
    appliedFilters: data.appliedFilters ?? [],
  }),
  ...
});

// Expose directly:
return {
  vehicles: vehicleSearchQuery.data?.vehicles ?? initialVehicles,
  totalCount: vehicleSearchQuery.data?.totalCount ?? initialTotalCount,
  isSearching: vehicleSearchQuery.isFetching,
};
```

---

### 4. Bidirectional effect URL sync — race condition risk

**File:** `apps/web/src/features/search/context/search-client.tsx` — line 169

Three mutable refs (`hydratedFromUrl`, `isInternalUpdate`, `lastSerializedUrlState`) guard a two-effect system that bidirectionally syncs URL → state and state → URL:

```
Effect A: searchParams changes → parse → setState (URL→state)
Effect B: debouncedUrlState changes → router.replace (state→URL)
```

This pattern is a known source of:

- **Stale closure bugs:** React batches state updates — if multiple state setters fire in Effect A, the next render may not reflect all changes before Effect B reads them.
- **Back-navigation race:** When a user presses the browser back button, `isInternalUpdate.current` may still be `true` from a previous internal navigation, which causes the URL change to be silently swallowed.
- **Infinite loop risk:** Any timing difference between the two 250ms debounces can cause an Effect A update to trigger Effect B which triggers Effect A again.

**Preferred pattern:** Treat `useSearchParams` as the single read source of truth and use a single effect exclusively for URL *writes*. Avoid the double-effect bidirectional coupling. Libraries like `nuqs` are purpose-built for this and handle Next.js's `router.replace` batching correctly.

---

## 🟡 High

### 5. Fat context (30+ fields) — all consumers re-render on any field change

**File:** `apps/web/src/features/search/context/search-context-types.ts`

`SearchContextValue` exposes 30+ fields in a single context. React context re-renders every consumer whenever *any* field in the value changes. `VehicleResults`, `SearchHero`, and `FilterSidebar` all call `useSearchContext()` and subscribe to the whole object.

**Example:** Toggling `isFilterOpen` causes `VehicleResults` (the entire card grid) to re-render even though it doesn't use that field.

The `useMemo` on `contextValue` in `search-context.tsx` does not help here — it prevents unnecessary value recreation, but a new memoized value still triggers all consumers.

**Fix:** Split the context by update frequency:

```ts
// Stable — setter refs from useState are always the same reference
const SearchActionsContext = createContext<SearchActions>()

// High-frequency — changes on every search
const SearchResultsContext = createContext<SearchResults>()

// Low-frequency UI state
const SearchUIContext = createContext<SearchUIState>()
```

Components then subscribe only to what they need, eliminating cross-concerns re-renders.

---

### 6. 20 independent `useState` calls with derived-state-via-effects

**File:** `apps/web/src/features/search/context/search-context-state.ts`

`useSearchState` manages approximately 20 independent `useState` atoms. Several of these are derived from others and kept in sync via `useEffect`:

- `pendingFacetSections` is derived from `filterState` changes
- `loadingFacetSections` mirrors `pendingFacetSections` with removals from query results
- `searchId` / `filterId` are reset when `searchQuery` changes
- `appliedFilters` are merged into `filterState` via a ref-guarded effect

Each `setState` call in these effects triggers another render pass. This cascades: a single `applyFiltersSearch` call can produce 4–6 sequential render passes as effects fire and chain.

**Fix:** Colocate co-dependent state into a `useReducer` where transitions are atomic. Alternatively, derive `pendingFacetSections` and `loadingFacetSections` during render from the primary state — they don't need to be stored in state at all if they can be computed synchronously.

---

### 7. Unstable `callbacks` object created on every render

**File:** `apps/web/src/features/search/context/search-context.tsx` — line 97

The `callbacks` object literal passed to `useSearchQueries` is constructed at call-site on every render:

```tsx
useSearchQueries(
  debouncedSearchRequest,
  debouncedFilterRequest,
  {
    setVehiclePool,      // stable setState ref ✓
    setTotalCount,       // stable setState ref ✓
    setSearchId,         // stable setState ref ✓
    // ...
  },                     // ← new object every render ✗
  hasServerData
);
```

While the individual function values are stable (React guarantees `setState` identity), the wrapping object is a new reference every render. Effect dep arrays inside `useSearchQueries` that reference `callbacks.setSmartFilters` etc. will resolve to stable functions — but this is only safe because of React internals, not by design. Any refactor that wraps a callback (e.g., adding a log around `setVehiclePool`) would silently break the dep array invariant.

**Fix:** Either pass the callbacks individually as named arguments, or stabilise the object with `useRef`:

```ts
const callbacksRef = useRef(callbacks);
callbacksRef.current = callbacks; // always fresh, stable reference
```

---

### 8. `SrpShell` silently ignores `initialBodyType` prop

**File:** `apps/web/src/features/search/components/srp-shell.tsx`

```tsx
interface SrpShellProps {
  initialBodyType?: string; // declared in interface
}

export function SrpShell({ children }: SrpShellProps) {
  // initialBodyType is never destructured or used
  return <div className="flex min-h-screen flex-col bg-gray-50">{children}</div>;
}
```

The prop is declared in the interface, passed from `used-cars/page.tsx`, but the component body ignores it. This is a missed SSR opportunity: the shell renders before `SearchWrapper` resolves, so it is the ideal place to render a server-side heading or breadcrumb (e.g., "Used SUVs" when `initialBodyType = "suv"`) that is present on the first byte of HTML without waiting for the async data layer.

**Fix:** Either remove the prop from the interface and the call-site, or use it to render a conditional heading in the server shell.

---

### 9. `allModalFilterMeta` memo on static data — should be module-level constant

**File:** `apps/web/src/features/search/context/search-client.tsx`

```tsx
const allModalFilterMeta = useMemo(() => {
  const { allFilters } = buildFilterOptions(mockVehicles); // mockVehicles is module-level constant
  const ids = new Set<string>();
  const labelLower = new Set<string>();
  // ...
  return { ids, labelLower };
}, []); // empty deps array
```

`mockVehicles` is a module-level static import. `useMemo(() => ..., [])` with an empty dep array is equivalent to computing once per component *mount* — but `SearchClient` is unmounted and remounted on every route change (the `key` prop on `SearchProvider` forces this). This means the entire `buildFilterOptions` computation runs on every SRP navigation.

Since the input is static, this should be computed **once at module load**:

```ts
// Outside the component, at module scope:
const { allFilters } = buildFilterOptions(mockVehicles);
const ALL_MODAL_FILTER_IDS = new Set(allFilters.flatMap(f => [f.id, slugify(f.label)]));
const ALL_MODAL_FILTER_LABELS = new Set(allFilters.map(f => f.label.toLowerCase()));
```

---

### 10. No error boundary around `SearchWrapper` async RSC

**File:** `apps/web/src/features/search/context/search-wrapper.tsx` / `apps/web/src/app/used-cars/[[...params]]/page.tsx`

```tsx
// used-cars/page.tsx
<SrpShell initialBodyType={route.filters.bodyType}>
  <Suspense fallback={null}>
    <SearchWrapper ... />  {/* ← no error boundary */}
  </Suspense>
</SrpShell>
```

`SearchWrapper` calls `fetchInitialSrpResults` which is a `"use cache"` async function. If the cache layer throws (network error, stale cache invalidation, unexpected data shape), the error propagates up to `used-cars/error.tsx`. That boundary discards the entire SRP tree including all client providers, showing a full-page error.

The page should degrade gracefully — an SRP with no initial results is still functional (the client-side TanStack Query will attempt a fresh fetch). Add a local error boundary that renders an empty-state SRP instead of a full-page error:

```tsx
<SrpShell initialBodyType={route.filters.bodyType}>
  <ErrorBoundary fallback={<SearchWrapperFallback />}>
    <Suspense fallback={<SrpSkeleton />}>
      <SearchWrapper ... />
    </Suspense>
  </ErrorBoundary>
</SrpShell>
```

---

## 🟢 Medium

### 11. `hasServerData` wrongly evaluates to `false` for zero-result pages

**File:** `apps/web/src/features/search/context/search-context-queries.ts` — line 38

```ts
// search-context.tsx
const hasServerData = initialVehicles.length > 0;

// search-context-queries.ts
staleTime: hasServerData ? 30_000 : 20_000,
```

A valid SRP that returns 0 results (e.g., a very specific filter combination) will set `hasServerData = false`, causing TanStack Query to treat the cache as cold and refetch more aggressively on window focus. A legitimate empty result is a just as valid a server response as a non-empty one.

**Fix:** Pass an explicit flag rather than inferring from result count:

```tsx
// SearchProvider props
initialDataFetched?: boolean; // true when SSR call was made, regardless of result count

// In useSearchQueries
staleTime: initialDataFetched ? 30_000 : 20_000,
```

---

### 12. Debounce compounding: context at 300ms, URL sync at 250ms

**Files:**
- `apps/web/src/features/search/context/search-context.tsx` — line 83 (`useDebouncedValue(..., 300)`)
- `apps/web/src/features/search/context/search-client.tsx` — line 231 (`useDebouncedValue(..., 250)`)

The search request debounce (300ms) and the URL serialization debounce (250ms) run independently. The URL updates 50ms *before* the search fires, meaning a user copy-pasting the URL mid-interaction will get a URL that reflects a filter state for which no search has been issued yet.

For filter chip interactions (already-committed discrete actions), no URL debounce is needed — the URL should update synchronously. Reserve the 250ms debounce for text input only.

---

### 13. `JSON.stringify` used to build a React component `key` — unstable

**File:** `apps/web/src/features/search/context/search-wrapper.tsx` — line 52

```tsx
const clientKey = `${initialBodyType ?? ""}|${initialSearchQuery ?? ""}|${JSON.stringify(initialUrlFilters ?? {})}`;
```

`JSON.stringify` serialises object keys in insertion order. Two semantically identical `initialUrlFilters` objects with different property insertion order will produce different key strings, forcing an unnecessary full remount of `SearchProvider` and all its descendants — losing TanStack Query's in-memory cache and triggering a fresh search.

**Fix:** Sort keys before serializing, or use a stable hash function:

```ts
function stableStringify(obj: object): string {
  return JSON.stringify(obj, Object.keys(obj).sort());
}
```

---

### 14. `removeFilter` is an unstabilised 80-line switch inside the render function

**File:** `apps/web/src/features/search/context/search-client.tsx`

The `removeFilter` inline function is approximately 80 lines of switch-case logic performing immutable state updates. It is:

- **Not wrapped in `useCallback`** — recreated as a new function reference on every render
- **Passed as `onRemoveFilter` to both `SearchHero` and `VehicleResults`** — causing those components to consider themselves changed on every render even if they are memoized

The logic itself is a pure transformation: `(filterState, type, value) → FilterState`. Extract it to a module-level pure function in `url-filters.ts`:

```ts
// url-filters.ts
export function removeFilterFromState(
  state: FilterState,
  type: string,
  value: string
): FilterState { ... }
```

Then in the component:

```tsx
const removeFilter = useCallback(
  (type: string, value: string) => {
    const nextState = removeFilterFromState(filterState, type, value);
    applyFiltersSearch(nextState, { searchQuery, labelFilter, refineFilters: refineSearchFilters });
  },
  [filterState, applyFiltersSearch, searchQuery, labelFilter, refineSearchFilters]
);
```

---

### 15. `applyFiltersSearch` falsely typed as `Promise<void>` but returns a no-op promise

**Files:**
- `apps/web/src/features/search/context/search-context-types.ts` — line 22
- `apps/web/src/features/search/context/search-context-state.ts` — line 205

```ts
// Type declares:
applyFiltersSearch: (newFilterState: FilterState, opts?: ...) => Promise<void>;

// Implementation returns:
return Promise.resolve(); // immediately resolved, transition still pending
```

The implementation wraps state updates in `startFilterTransition` (synchronous scheduling) and returns `Promise.resolve()` — a promise that resolves before the transition completes. Any caller that `await applyFiltersSearch(...)` will proceed immediately while the UI is still in a pending transition state.

In React 19, `startTransition` returns a `Promise` that resolves when the transition is committed. Use that directly:

```ts
// React 19
const [isPending, startFilterTransition] = useTransition();

const applyFiltersSearch = useCallback((...) => {
  return startFilterTransition(() => {
    // setState calls
  }); // returns Promise<void> that resolves on commit
}, [...]);
```

If React 18 compatibility is required, correct the return type to `void` to prevent callers from false-awaiting it.

---

## Findings Summary

| # | File | Issue | Severity |
|---|---|---|---|
| 1 | `context/search-client.tsx:161` | `useEffect` with no dep array — runs every render | 🔴 Critical |
| 2 | `context/search-wrapper.tsx:58` + `page.tsx:82` | `fallback={null}` on above-the-fold Suspense | 🔴 Critical |
| 3 | `context/search-context-queries.ts:57` | Query → useEffect → setState double-render anti-pattern | 🔴 Critical |
| 4 | `context/search-client.tsx:169` | Bidirectional effect URL sync — race condition | 🔴 Critical |
| 5 | `context/search-context-types.ts` | 30+ field fat context — all consumers re-render on any change | 🟡 High |
| 6 | `context/search-context-state.ts` | 20 `useState` calls with cascading derived-state effects | 🟡 High |
| 7 | `context/search-context.tsx:97` | Unstable `callbacks` object literal per render | 🟡 High |
| 8 | `components/srp-shell.tsx` | `initialBodyType` prop declared but never used | 🟡 High |
| 9 | `context/search-client.tsx` | `allModalFilterMeta` `useMemo` on static data — should be module constant | 🟡 High |
| 10 | `context/search-wrapper.tsx` + `page.tsx` | No error boundary around async RSC — degrades to full-page error | 🟡 High |
| 11 | `context/search-context-queries.ts:38` | `hasServerData` false for 0-result pages — aggressive refetch | 🟢 Medium |
| 12 | `context/search-context.tsx:83` + `search-client.tsx:231` | URL debounce fires before search debounce — stale shareable links | 🟢 Medium |
| 13 | `context/search-wrapper.tsx:52` | `JSON.stringify` for component key — insertion-order unstable | 🟢 Medium |
| 14 | `context/search-client.tsx` | `removeFilter` 80-line unstabilised inline function | 🟢 Medium |
| 15 | `context/search-context-types.ts:22` | `applyFiltersSearch` typed `Promise<void>` but resolves before transition commits | 🟢 Medium |

### Recommended Fix Priority

1. **#1** — Perf regression affecting every render in the search tree
2. **#2** — Direct UX degradation on every page load
3. **#3** — Extra render cycle on every search response
4. **#4** — Back-navigation reliability / race condition
5. **#5** — Re-render cascade eliminating benefit of TanStack Query caching
6. **#8, #9, #13** — Quick wins (prop cleanup, module constant, stable key)
7. **#6, #7, #10, #11, #14, #15** — Architecture improvements
