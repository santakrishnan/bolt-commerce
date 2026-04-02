# SRP Code Audit — JIRA Stories

> **Project:** Arrow E-commerce
> **Component:** Search Results Page (SRP)
> **Audit Date:** April 1, 2026
> **Scope:** `features/search/`, `app/used-cars/[[...params]]/`, `app/api/search/`

---

## Epic: SRP Code Quality & Performance Improvements

**Epic Description:**
Address findings from the SRP code audit covering React performance anti-patterns, Next.js 16 pattern adoption, accessibility, dead code cleanup, and scalable architecture improvements. Organized into 3 tiers by effort and risk.

---

## Tier 1 — Quick Wins

**Sprint Estimate:** 1–2 hours total | **Risk:** None | **Dependencies:** None

---

### Story 1.1: Fix `useEffect` missing dependency array in SearchClient

**Type:** Bug
**Priority:** Critical
**Points:** 1
**Labels:** `performance`, `react-anti-pattern`

**Description:**
`useEffect` on line 161 of `search-client.tsx` has no dependency array. It runs on every render, scheduling `window.scrollTo` evaluation on every state update (filter change, sort change, typing, etc.). The early return guard (`prevPageRef.current === currentPage`) prevents visible bugs, but the effect is still invoked by the React scheduler on every render cycle.

**File:** `apps/web/src/features/search/context/search-client.tsx:161`

**Current Code:**
```ts
useEffect(() => {
  if (prevPageRef.current === currentPage) return;
  prevPageRef.current = currentPage;
  window.scrollTo({ top: 0, behavior: "smooth" });
}); // ← no dep array
```

**Fix:**
```ts
useEffect(() => {
  if (prevPageRef.current === currentPage) return;
  prevPageRef.current = currentPage;
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [currentPage]);
```

**Acceptance Criteria:**
- [ ] `useEffect` has `[currentPage]` dependency array
- [ ] Scroll-to-top still works on page change
- [ ] No scroll triggered on filter/sort/search changes
- [ ] Existing tests pass

---

### Story 1.2: Fix `SrpShell` unused `initialBodyType` prop

**Type:** Improvement
**Priority:** Medium
**Points:** 1
**Labels:** `dead-code`, `cleanup`

**Description:**
`SrpShell` declares `initialBodyType` in its props interface but never destructures or uses it. The prop is passed from `page.tsx` but discarded. Either use it for a server-rendered heading (SSR benefit — visible on first byte) or remove it from the interface and call site.

**File:** `apps/web/src/features/search/components/srp-shell.tsx:5,18`

**Current Code:**
```ts
interface SrpShellProps {
  children?: ReactNode;
  initialBodyType?: string; // ← declared
}

export function SrpShell({ children }: SrpShellProps) { // ← not destructured
  return <div className="...">{children}</div>;
}
```

**Option A — Use it:**
```ts
export function SrpShell({ children, initialBodyType }: SrpShellProps) {
  return (
    <div className="...">
      {initialBodyType && (
        <h1 className="sr-only">Used {initialBodyType} vehicles</h1>
      )}
      {children}
    </div>
  );
}
```

**Option B — Remove it:**
Remove `initialBodyType` from `SrpShellProps` and from `page.tsx` call site.

**Acceptance Criteria:**
- [ ] Prop is either used or removed from interface + call site
- [ ] No TypeScript errors
- [ ] If used: heading appears in HTML source on first byte (SSR)

---

### Story 1.3: Move `allModalFilterMeta` to module scope

**Type:** Improvement
**Priority:** Medium
**Points:** 1
**Labels:** `performance`, `optimization`

**Description:**
`allModalFilterMeta` is computed inside a `useMemo(() => ..., [])` with an empty dependency array. The input (`mockVehicles`) is a module-level constant that never changes. However, because `SearchClient` is remounted on every SRP navigation (via the `key` prop on `SearchProvider`), the `useMemo` recomputes on every page visit.

Moving this to module scope computes it once at import time.

**File:** `apps/web/src/features/search/context/search-client.tsx:418-428`

**Current Code:**
```ts
const allModalFilterMeta = useMemo(() => {
  const { allFilters } = buildFilterOptions(mockVehicles);
  const ids = new Set<string>();
  const labelLower = new Set<string>();
  for (const f of allFilters) {
    ids.add(f.id);
    ids.add(slugify(f.label));
    labelLower.add(f.label.toLowerCase());
  }
  return { ids, labelLower };
}, []);
```

**Fix:**
```ts
// Module scope — computed once at import time
const _allFilterMeta = (() => {
  const { allFilters } = buildFilterOptions(mockVehicles);
  const ids = new Set<string>();
  const labelLower = new Set<string>();
  for (const f of allFilters) {
    ids.add(f.id);
    ids.add(slugify(f.label));
    labelLower.add(f.label.toLowerCase());
  }
  return { ids, labelLower };
})();

// Inside component — use directly
const allModalFilterMeta = _allFilterMeta;
```

**Acceptance Criteria:**
- [ ] Computation runs once at module load, not per mount
- [ ] `applyRefineFilters` still works correctly
- [ ] No behavior change in refine search modal

---

### Story 1.4: Replace `hasServerData` with explicit `initialDataFetched` flag

**Type:** Bug
**Priority:** Low
**Points:** 1
**Labels:** `correctness`

**Description:**
`hasServerData` is derived from `initialVehicles.length > 0`. A valid SRP that returns 0 results (e.g., very narrow filter) sets `hasServerData = false`, causing React Query to use a shorter `staleTime` (20s vs 30s) and refetch more aggressively on window focus. A legitimate empty result is just as valid a server response as a non-empty one.

**File:** `apps/web/src/features/search/context/search-context.tsx:34`

**Current Code:**
```ts
const hasServerData = initialVehicles.length > 0;
```

**Fix:**
Add `initialDataFetched` prop to `SearchProviderProps`:
```ts
interface SearchProviderProps {
  // ... existing props
  initialDataFetched?: boolean;
}
```

In `SearchWrapper`:
```ts
<SearchProvider initialDataFetched={true} ... />
```

In `SearchProvider`:
```ts
const hasServerData = initialDataFetched ?? initialVehicles.length > 0;
```

**Acceptance Criteria:**
- [ ] 0-result pages use `staleTime: 30_000` (same as non-empty)
- [ ] No refetch-on-focus for valid empty results
- [ ] Backward compatible — defaults to current behavior if prop not passed

---

### Story 1.5: Stable component key in `SearchWrapper`

**Type:** Improvement
**Priority:** Low
**Points:** 1
**Labels:** `correctness`

**Description:**
`JSON.stringify(initialUrlFilters ?? {})` is used to build the `key` prop on `SearchProvider`. `JSON.stringify` serializes object keys in insertion order. Two semantically identical objects with different property insertion order produce different key strings, causing unnecessary full remount of the SearchProvider tree (losing React Query cache, resetting all state).

**File:** `apps/web/src/features/search/context/search-wrapper.tsx:46`

**Current Code:**
```ts
const clientKey = `${initialBodyType ?? ""}|${initialSearchQuery ?? ""}|${JSON.stringify(initialUrlFilters ?? {})}`;
```

**Fix:**
```ts
function stableStringify(obj: Record<string, unknown>): string {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

const clientKey = `${initialBodyType ?? ""}|${initialSearchQuery ?? ""}|${stableStringify(initialUrlFilters ?? {})}`;
```

**Acceptance Criteria:**
- [ ] Key is stable regardless of property insertion order
- [ ] SearchProvider only remounts when actual filter values change
- [ ] Existing behavior preserved for different filter values

---

### Story 1.6: Change `applyFiltersSearch` return type to `void`

**Type:** Improvement
**Priority:** Low
**Points:** 1
**Labels:** `type-safety`

**Description:**
`applyFiltersSearch` is typed as `Promise<void>` but returns `Promise.resolve()` immediately — before the `startFilterTransition` completes. Any caller that `await`s this gets a false signal that the transition is done. Change the return type to `void` to prevent misleading usage.

**Files:**
- `apps/web/src/features/search/context/search-context-state.ts:140`
- `apps/web/src/features/search/context/search-context-types.ts:21-29`

**Fix:**
- Remove `return Promise.resolve()` from `applyFiltersSearch`
- Change type from `Promise<void>` to `void` in `SearchContextValue`
- Update any callers that `await` it (e.g., the `appliedFilters` merge effect at line 196)

**Acceptance Criteria:**
- [ ] Return type is `void`
- [ ] No callers `await` the function
- [ ] TypeScript compiles cleanly

---

### Story 1.7: Remove no-op `search-client-wrapper.tsx`

**Type:** Improvement
**Priority:** Low
**Points:** 1
**Labels:** `dead-code`, `cleanup`

**Description:**
`search-client-wrapper.tsx` is a `"use client"` component that wraps `SearchClient` (also `"use client"`) with zero additional logic. It exists solely as a default export proxy. Import `SearchClient` directly in `search-wrapper.tsx`.

**File:** `apps/web/src/features/search/context/search-client-wrapper.tsx`

**Current Code:**
```ts
"use client";
export default function SearchClientWrapper(props: SearchClientProps) {
  return <SearchClient {...props} />;
}
```

**Fix:**
- Delete `search-client-wrapper.tsx`
- Update `search-wrapper.tsx` to import `SearchClient` directly
- Add default export to `search-client.tsx` if needed, or use named import

**Acceptance Criteria:**
- [ ] Wrapper file deleted
- [ ] `SearchWrapper` imports `SearchClient` directly
- [ ] No behavior change

---

### Story 1.8: Gate artificial API latency behind `NODE_ENV`

**Type:** Improvement
**Priority:** Medium
**Points:** 1
**Labels:** `performance`

**Description:**
Both `/api/search` and `/api/search/filters` have hardcoded `setTimeout` delays (200ms and 150ms) that simulate network latency. These run in all environments including production.

**Files:**
- `apps/web/src/app/api/search/route.ts:226-227`
- `apps/web/src/app/api/search/filters/route.ts:49-50`

**Current Code:**
```ts
const latencyMs = 200;
await new Promise((resolve) => setTimeout(resolve, latencyMs));
```

**Fix:**
```ts
if (isDev) {
  await new Promise((resolve) => setTimeout(resolve, 200));
}
```

Note: `isDev` is already defined at the top of both files.

**Acceptance Criteria:**
- [ ] No artificial delay in production
- [ ] Latency simulation preserved in development
- [ ] Both API routes updated

---

### Story 1.9: Fix CSS syntax error in `SearchHero`

**Type:** Bug
**Priority:** Medium
**Points:** 1
**Labels:** `bug`, `css`

**Description:**
Malformed Tailwind `className` on the separator pipe character. The `text-[var(` and `--color-brand-border-medium)]` are split incorrectly.

**File:** `apps/web/src/features/search/components/search-hero.tsx:173`

**Current Code:**
```html
<span className="--color-brand-border-medium)] my-1 text-[var( md:hidden">|</span>
```

**Fix:**
```html
<span className="my-1 text-[var(--color-brand-border-medium)] md:hidden">|</span>
```

**Acceptance Criteria:**
- [ ] Separator pipe renders with correct color
- [ ] Only visible on mobile (hidden on md+)
- [ ] No Tailwind build warnings

---

### Story 1.10: Fix hardcoded `appliedFilters` in mock response

**Type:** Bug
**Priority:** Medium
**Points:** 1
**Labels:** `mock-data`, `correctness`

**Description:**
`runMockFacetedSearch` returns a static `appliedFilters` array regardless of the actual search query or filter state. This causes the UI to always show "SUV" and "Under 100k mi" as applied filters in the chip bar.

**File:** `apps/web/src/features/search/lib/mock-faceted-search.ts:287-290`

**Current Code:**
```ts
appliedFilters: [
  { field: "bodyStyle", value: "SUV", displayText: "SUV" },
  { field: "distance", value: "100", displayText: "Under 100k mi" },
],
```

**Fix:**
Derive `appliedFilters` from the `filterState` in the request. Build an `AppliedFilter[]` from non-default filter selections.

**Acceptance Criteria:**
- [ ] `appliedFilters` reflects actual filter state from request
- [ ] Empty when no filters are active
- [ ] Existing tests updated

---

## Tier 2 — Medium Effort, High Value

**Sprint Estimate:** 6–8 hours total | **Risk:** Low–Medium | **Dependencies:** Tier 1 complete

---

### Story 2.1: Add `SrpSkeleton` for Suspense fallbacks

**Type:** Improvement
**Priority:** High
**Points:** 3
**Labels:** `ux`, `performance`, `next-js-16`

**Description:**
Both SRP Suspense boundaries use `fallback={null}`, causing a visible blank flash while `SearchWrapper` (async RSC) resolves server-side data and the client bundle hydrates. The user sees only the gray `bg-gray-50` shell from `SrpShell`.

Create a `SrpSkeleton` component that mirrors the SRP layout dimensions — hero bar placeholder + grid of skeleton cards — so layout shift is minimized and the page appears populated immediately.

**Files to modify:**
- Create: `apps/web/src/features/search/components/srp-skeleton.tsx`
- Modify: `apps/web/src/app/used-cars/[[...params]]/page.tsx:81`
- Modify: `apps/web/src/features/search/context/search-wrapper.tsx:58`

**Fix:**
```tsx
// page.tsx
<Suspense fallback={<SrpSkeleton />}>
  <SearchWrapper ... />
</Suspense>

// search-wrapper.tsx
<Suspense fallback={<SrpSkeleton compact />}>
  <SearchClient ... />
</Suspense>
```

**Acceptance Criteria:**
- [ ] `SrpSkeleton` renders hero bar placeholder + 6 card skeletons
- [ ] Matches dimensions of real SRP layout (no layout shift)
- [ ] Visible during SSR cold start and client hydration
- [ ] Both Suspense boundaries use the skeleton

---

### Story 2.2: Stabilize `callbacks` object in `SearchProvider`

**Type:** Improvement
**Priority:** High
**Points:** 2
**Labels:** `performance`, `react-anti-pattern`

**Description:**
The `callbacks` object passed to `useSearchQueries` is an inline object literal, creating a new reference on every render. While individual `setState` functions inside are stable (React guarantee), the wrapping object is not. This makes dependency arrays in `useSearchQueries` effects fragile — any refactor that wraps a callback would silently break the dep array invariant.

**File:** `apps/web/src/features/search/context/search-context.tsx:93-109`

**Fix:**
Wrap in `useMemo`:
```ts
const callbacks = useMemo(() => ({
  setVehiclePool,
  setTotalCount,
  setSearchId,
  // ...
}), [setVehiclePool, setTotalCount, setSearchId, ...]);
```

Or use `useRef` pattern:
```ts
const callbacksRef = useRef(callbacks);
callbacksRef.current = callbacks;
```

**Acceptance Criteria:**
- [ ] `callbacks` object is stable across renders
- [ ] `useSearchQueries` effects don't fire on callback identity changes
- [ ] Search results still update correctly

---

### Story 2.3: Add error boundary around `SearchWrapper`

**Type:** Improvement
**Priority:** High
**Points:** 2
**Labels:** `resilience`, `ux`

**Description:**
If `SearchWrapper`'s `fetchInitialSrpResults` throws (cache error, unexpected data shape), the error propagates to `used-cars/error.tsx`, replacing the entire SRP tree with a full-page error. The SRP should degrade gracefully — an empty-state SRP with client-side React Query retrying is better than a full-page error.

**File:** `apps/web/src/app/used-cars/[[...params]]/page.tsx:80-86`

**Fix:**
```tsx
<SrpShell initialBodyType={route.filters.bodyType}>
  <ErrorBoundary fallback={<SearchWrapperFallback />}>
    <Suspense fallback={<SrpSkeleton />}>
      <SearchWrapper ... />
    </Suspense>
  </ErrorBoundary>
</SrpShell>
```

`SearchWrapperFallback` renders a `SearchProvider` with empty initial vehicles — React Query will attempt a fresh fetch client-side.

**Acceptance Criteria:**
- [ ] Server data fetch failure shows empty SRP, not full-page error
- [ ] Client-side React Query retries automatically
- [ ] Error is logged server-side
- [ ] User can still interact with search bar and filters

---

### Story 2.4: Wrap `removeFilter`, `resetFilters`, `applyRefineFilters` in `useCallback`

**Type:** Improvement
**Priority:** High
**Points:** 3
**Labels:** `performance`, `react-anti-pattern`

**Description:**
Three functions in `SearchClient` are plain arrow functions recreated on every render and passed as props to `SearchHero` and `VehicleResults`:
- `removeFilter` (~120 lines, switch statement)
- `resetFilters` (~8 lines)
- `applyRefineFilters` (~40 lines)

Additionally, 5 inline arrow functions are passed as props:
- `onSearch={() => setCurrentPage(1)}` (x2)
- `onSearchChange={(query) => { ... }}` (x1)
- `onToggleFilter={() => setIsFilterOpen(true)}` (x2)

All cause unnecessary re-renders of the entire card grid.

**File:** `apps/web/src/features/search/context/search-client.tsx:286-541`

**Fix:**
1. Extract `removeFilter` switch logic to a pure function in `lib/filter-utils.ts`
2. Wrap all 3 functions in `useCallback` with correct deps
3. Extract inline arrow functions to stable `useCallback` references

**Acceptance Criteria:**
- [ ] `removeFilter`, `resetFilters`, `applyRefineFilters` wrapped in `useCallback`
- [ ] All inline prop callbacks extracted to stable references
- [ ] No unnecessary VehicleResults re-renders on unrelated state changes
- [ ] Filter removal still works for all 15+ filter types

---

### Story 2.5: Deduplicate `SearchHero` JSX

**Type:** Improvement
**Priority:** Medium
**Points:** 2
**Labels:** `code-quality`, `maintainability`

**Description:**
`SearchHero` renders two nearly-identical header blocks (~120 lines each) — one for the sticky header (when hero is not visible) and one for the main hero section. The sort dropdown, filter button, vehicle count, and separator are duplicated.

**File:** `apps/web/src/features/search/components/search-hero.tsx:92-365`

**Fix:**
Extract shared header content to a `<SearchHeaderBar>` component. Render it once in the main hero and conditionally show the sticky version using CSS `position: sticky` or an intersection observer.

**Acceptance Criteria:**
- [ ] No duplicated JSX blocks
- [ ] Sticky behavior preserved
- [ ] Sort/filter/count display identical in both states

---

### Story 2.6: Fix `vehicleCount` cap vs `paginatedVehicles` inconsistency

**Type:** Bug
**Priority:** Medium
**Points:** 1
**Labels:** `correctness`

**Description:**
`vehicleCount` is capped at 100, `totalPages` is computed from it, but `paginatedVehicles = vehicles` renders all vehicles without slicing. Pagination UI shows pages based on the cap, but the full array is rendered.

**File:** `apps/web/src/features/search/components/vehicle-results.tsx:194-196`

**Current Code:**
```ts
const vehicleCount = Math.max(0, Math.min(totalCount, 100));
const totalPages = Math.ceil(vehicleCount / itemsPerPage);
const paginatedVehicles = vehicles; // ← not sliced
```

**Fix:**
Either remove the 100 cap or apply it consistently:
```ts
const paginatedVehicles = vehicles.slice(0, vehicleCount);
```

**Acceptance Criteria:**
- [ ] Displayed vehicles match pagination page count
- [ ] No orphan vehicles beyond the last page

---

### Story 2.7: Add Zod validation on API route POST bodies

**Type:** Improvement
**Priority:** Medium
**Points:** 2
**Labels:** `security`, `robustness`

**Description:**
Both `/api/search` and `/api/search/filters` cast request body with `as Partial<...>` without schema validation. `pageSize` is unbounded, arrays have no length limits, and JSON parse failures are silently swallowed (`body = {}`).

**Files:**
- `apps/web/src/app/api/search/route.ts:204-209`
- `apps/web/src/app/api/search/filters/route.ts:26-31`

**Fix:**
Add Zod schemas (project already has Zod as a dependency):
```ts
const SearchRequestSchema = z.object({
  filterState: FilterStateSchema,
  page: z.number().int().min(1).max(100).optional(),
  pageSize: z.number().int().min(1).max(50).optional(),
  sortOption: z.enum(["recommended", "low-high", "high-low"]).optional(),
  searchQuery: z.string().max(200).optional(),
  // ...
});
```

Return `400` with structured error on validation failure instead of silently defaulting.

**Acceptance Criteria:**
- [ ] Both routes validate request body with Zod
- [ ] `pageSize` capped at 50
- [ ] Invalid JSON returns 400 with error details
- [ ] Existing tests updated

---

### Story 2.8: Extract duplicate helper functions to shared module

**Type:** Improvement
**Priority:** Low
**Points:** 1
**Labels:** `code-quality`, `dry`

**Description:**
`mileageLabelFromOption` and `priceLabelFromOption` are defined identically in `vehicle-results.tsx` and `smart-filter-chip.tsx`. Extract to a shared `lib/smart-filter-utils.ts`.

**Files:**
- `apps/web/src/features/search/components/vehicle-results.tsx:77-99`
- `apps/web/src/features/search/components/smart-filter-chip.tsx`

**Fix:**
Create `apps/web/src/features/search/lib/smart-filter-utils.ts` with both functions. Import in both components.

**Acceptance Criteria:**
- [ ] Single source of truth for both functions
- [ ] Both components import from shared module
- [ ] No behavior change

---

### Story 2.9: Deduplicate `SmartFilterChip` rendering in `VehicleResults`

**Type:** Improvement
**Priority:** Low
**Points:** 1
**Labels:** `code-quality`, `dry`

**Description:**
The same `SmartFilterChip` map is rendered in two locations in `VehicleResults` (lines 269-283 and 357-372) with nearly identical logic. Extract to a shared sub-component.

**File:** `apps/web/src/features/search/components/vehicle-results.tsx:269-283, 357-372`

**Acceptance Criteria:**
- [ ] Single `<SmartFilterChips>` component rendered once
- [ ] Conditionally shown based on `activeFilterCount`

---

### Story 2.10: Clean up dead URL parsing code

**Type:** Improvement
**Priority:** Low
**Points:** 1
**Labels:** `dead-code`, `cleanup`

**Description:**
`parseSearchUrlState` reads 15+ URL params (`bodyStyles`, `sort`, `page`, `exteriorColors`, etc.) that will never exist in the URL. The SRP URL is limited to `/used-cars/<bodyType>` and `?q=<search>`. This dead code is misleading for future developers.

**File:** `apps/web/src/features/search/lib/url-filters.ts:67-86`

**Fix:**
Simplify `parseSearchUrlState` to only parse `q`:
```ts
export function parseSearchUrlState(searchParams: URLSearchParams): ParsedSearchUrlState {
  return {
    searchQuery: searchParams.get("q") ?? undefined,
  };
}
```

Remove unused `parseCsv`, `parsePositiveInt` helpers if no other consumers.

**Acceptance Criteria:**
- [ ] Only `q` param parsed from URL
- [ ] Dead parsing code removed
- [ ] URL sync still works for search query

---

## Tier 3 — Architecture Improvements

**Sprint Estimate:** 10–16 hours total | **Risk:** Medium–High | **Dependencies:** Tier 1 + Tier 2 complete
**Recommendation:** Each story is a separate PR with before/after performance measurements.

---

### Story 3.1: Replace Query → useEffect → setState with React Query `select`

**Type:** Improvement
**Priority:** High
**Points:** 5
**Labels:** `architecture`, `performance`

**Description:**
Every time a React Query resolves, a `useEffect` fires and calls 3-4 `setState` callbacks — producing a second render pass after React Query already triggered one. This doubles render cost on every search response.

The correct React Query pattern exposes transformed data directly via `select`, removing the need for syncing effects entirely.

**File:** `apps/web/src/features/search/context/search-context-queries.ts:61-131`

**Current Flow:**
```
Query resolves → React Query re-renders (render 1)
  → useEffect scheduled
    → setState × 4 (setVehiclePool, setTotalCount, setSmartFilters, setAppliedFilters)
      → another render cycle (render 2)
```

**Target Flow:**
```
Query resolves → React Query re-renders with selected data (render 1 only)
  → context reads directly from query result
```

**Fix:**
```ts
const vehicleSearchQuery = useQuery({
  queryKey: ["vehicle-search", request],
  queryFn: () => fetchVehicleSearch(request),
  select: (data) => ({
    vehicles: data.vehicles,
    totalCount: Math.min(data.totalCount, data.metadata.inventorySize),
    smartFilters: data.smartFilters ?? [],
    appliedFilters: data.appliedFilters ?? [],
    searchId: data.metadata.searchId,
  }),
});

// Expose directly — no useEffect, no setState
return {
  vehicles: vehicleSearchQuery.data?.vehicles ?? initialVehicles,
  totalCount: vehicleSearchQuery.data?.totalCount ?? initialTotalCount,
};
```

**Impact:** Eliminates 3 `useEffect` hooks and ~15 `setState` calls per search response.

**Acceptance Criteria:**
- [ ] All 3 `useEffect` hooks in `search-context-queries.ts` removed
- [ ] Query data consumed directly via `select`
- [ ] Vehicle results update in single render pass
- [ ] Existing search behavior preserved
- [ ] Performance measurement: before/after render count per search

---

### Story 3.2: Split fat SearchContext into 3 focused contexts

**Type:** Improvement
**Priority:** High
**Points:** 5
**Labels:** `architecture`, `performance`

**Description:**
`SearchContextValue` has 34 fields in a single context. React context re-renders every consumer when any field changes. `VehicleResults`, `SearchHero`, and `FilterSidebar` all call `useSearchContext()` and subscribe to everything. Example: toggling `isFilterOpen` causes the entire card grid to re-render.

**File:** `apps/web/src/features/search/context/search-context-types.ts`

**Fix — Split into 3 contexts:**

```ts
// Stable — setter refs never change identity
const SearchActionsContext = createContext<{
  applyFiltersSearch: (...) => void;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setSortOption: Dispatch<SetStateAction<SortOption>>;
  setFilterState: Dispatch<SetStateAction<FilterState>>;
  // ... all setters
}>();

// High-frequency — changes on every search
const SearchResultsContext = createContext<{
  vehiclePool: Vehicle[];
  totalCount: number;
  availableFilters: AvailableFilters;
  facetCounts: FacetCounts;
  smartFilters: SmartFilterGroup[];
  isSearching: boolean;
  isInitialLoading: boolean;
}>();

// Low-frequency — UI state
const SearchUIContext = createContext<{
  isFilterOpen: boolean;
  progress: number;
  isProgressVisible: boolean;
  filterState: FilterState;
  searchQuery: string;
  sortOption: SortOption;
  currentPage: number;
}>();
```

Components subscribe only to what they need:
- `VehicleResults` → `useSearchResults()` + `useSearchActions()`
- `FilterSidebar` → `useSearchUI()` + `useSearchActions()`
- `SearchHero` → `useSearchUI()` + `useSearchActions()`

**Acceptance Criteria:**
- [ ] 3 separate contexts created
- [ ] All consumers updated to use specific context hooks
- [ ] Toggling `isFilterOpen` does NOT re-render `VehicleResults`
- [ ] Changing `sortOption` does NOT re-render `FilterSidebar`
- [ ] Performance measurement: before/after render count for each component

---

### Story 3.3: Consolidate 19 `useState` calls into `useReducer`

**Type:** Improvement
**Priority:** Medium
**Points:** 5
**Labels:** `architecture`, `maintainability`

**Description:**
`useSearchState` manages 19 independent `useState` atoms. Several are derived from others via `useEffect`, creating cascading render passes. A single `applyFiltersSearch` call can trigger 4-6 sequential renders as effects fire and chain.

The `appliedFilters` merge effect (lines 148-197) is particularly fragile — it has `applyFiltersSearch` and `filterState` in its deps, creating a potential infinite loop guarded only by a ref-based signature check.

**File:** `apps/web/src/features/search/context/search-context-state.ts`

**Fix:**
Consolidate co-dependent state into a `useReducer`:
```ts
type SearchAction =
  | { type: "APPLY_FILTERS"; filterState: FilterState; opts?: ApplyOpts }
  | { type: "SET_RESULTS"; vehicles: Vehicle[]; totalCount: number }
  | { type: "SET_PAGE"; page: number }
  | { type: "SET_SORT"; sort: SortOption }
  | { type: "SET_QUERY"; query: string }
  | { type: "RESET" };

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  // Atomic transitions — no cascading effects
}
```

Derive `pendingFacetSections` and `loadingFacetSections` during render from primary state — they don't need to be stored in state.

**Acceptance Criteria:**
- [ ] Single `useReducer` replaces 19 `useState` calls
- [ ] `appliedFilters` merge logic moves into reducer (no effect)
- [ ] `applyFiltersSearch` dispatches a single action
- [ ] No cascading effect chains
- [ ] Existing behavior preserved

---

### Story 3.4: Remove client-side `computeAvailableFiltersSync`

**Type:** Improvement
**Priority:** Medium
**Points:** 3
**Labels:** `performance`, `architecture`

**Description:**
`computeAvailableFiltersSync` runs disjunctive faceting (O(n*15)) synchronously on the client main thread inside the FilterSidebar's `useMemo`. This duplicates work already done server-side via `/api/search/filters`. It blocks the main thread for 50-100ms per filter interaction.

**File:** `apps/web/src/features/search/components/filter-sidebar/index.tsx:96-105`

**Fix:**
Remove client-side computation. Use the `availableFilters` from the search context (already populated by the `/api/search/filters` API response). For "live preview" during draft filter changes, debounce and call the server endpoint instead.

**Acceptance Criteria:**
- [ ] `computeAvailableFiltersSync` not imported in any client component
- [ ] Filter availability comes from server response
- [ ] No main thread blocking during filter interactions
- [ ] Filter sidebar still shows correct available/disabled chips

---

### Story 3.5: Remove `mockVehicles` from client bundles

**Type:** Improvement
**Priority:** Medium
**Points:** 3
**Labels:** `bundle-size`, `performance`

**Description:**
`mockVehicles` (56KB, 50 vehicles with deep nested features) is imported into 5+ client components. It's used for static computations that should happen server-side or at build time.

**Files importing client-side:**
- `search-client.tsx:12` — for `buildFilterOptions` (static, Story 1.3 addresses this)
- `filter-sidebar/index.tsx` — via `computeAvailableFiltersSync` (Story 3.4 addresses this)
- `refine-search-modal.tsx` — for filter option labels
- `favorites/page.tsx` — for VIN lookup
- `my-garageclient.tsx` — for vehicle estimation

**Fix:**
- After Story 1.3 and 3.4, most client imports are eliminated
- For remaining consumers: move data lookup to API routes or server actions
- Mark `mock-vehicles.ts` with a `"server-only"` import guard

**Acceptance Criteria:**
- [ ] `mockVehicles` not imported in any `"use client"` file
- [ ] Client bundle size reduced by ~56KB per bundle
- [ ] Functionality preserved via server-side data access

---

### Story 3.6: Simplify URL sync to single effect

**Type:** Improvement
**Priority:** Low
**Points:** 2
**Labels:** `code-quality`, `simplification`

**Description:**
The current URL sync uses 3 mutable refs (`hydratedFromUrl`, `isInternalUpdate`, `lastSerializedUrlState`) and 2 `useEffect` hooks to bidirectionally sync `?q=` between URL and state. Since the URL only contains `q=`, this can be a single effect that writes `searchQuery` to the URL.

**File:** `apps/web/src/features/search/context/search-client.tsx:155-260`

**Fix:**
Replace with a single effect:
```ts
useEffect(() => {
  const currentQ = searchParams.get("q") ?? "";
  if (currentQ !== searchQuery) {
    const nextUrl = searchQuery ? `${pathname}?q=${encodeURIComponent(searchQuery)}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }
}, [debouncedSearchQuery, pathname, router]);
```

Remove `hydratedFromUrl`, `isInternalUpdate`, `lastSerializedUrlState` refs.

**Acceptance Criteria:**
- [ ] Single `useEffect` for URL sync
- [ ] 3 mutable refs removed
- [ ] `?q=` param updates on search query change
- [ ] Browser back button works correctly
- [ ] No infinite loops

---

## Summary Table

| Story | Title | Tier | Points | Priority |
|-------|-------|------|--------|----------|
| 1.1 | Fix `useEffect` missing dep array | T1 | 1 | Critical |
| 1.2 | Fix `SrpShell` unused prop | T1 | 1 | Medium |
| 1.3 | Move `allModalFilterMeta` to module scope | T1 | 1 | Medium |
| 1.4 | Replace `hasServerData` with explicit flag | T1 | 1 | Low |
| 1.5 | Stable component key | T1 | 1 | Low |
| 1.6 | Fix `applyFiltersSearch` return type | T1 | 1 | Low |
| 1.7 | Remove no-op wrapper | T1 | 1 | Low |
| 1.8 | Gate API latency behind `NODE_ENV` | T1 | 1 | Medium |
| 1.9 | Fix CSS syntax error in `SearchHero` | T1 | 1 | Medium |
| 1.10 | Fix hardcoded `appliedFilters` in mock | T1 | 1 | Medium |
| 2.1 | Add `SrpSkeleton` for Suspense fallbacks | T2 | 3 | High |
| 2.2 | Stabilize callbacks object | T2 | 2 | High |
| 2.3 | Add error boundary around `SearchWrapper` | T2 | 2 | High |
| 2.4 | Wrap functions in `useCallback` + extract | T2 | 3 | High |
| 2.5 | Deduplicate `SearchHero` JSX | T2 | 2 | Medium |
| 2.6 | Fix pagination cap inconsistency | T2 | 1 | Medium |
| 2.7 | Add Zod validation on API routes | T2 | 2 | Medium |
| 2.8 | Extract duplicate helper functions | T2 | 1 | Low |
| 2.9 | Deduplicate `SmartFilterChip` rendering | T2 | 1 | Low |
| 2.10 | Clean up dead URL parsing code | T2 | 1 | Low |
| 3.1 | React Query `select` pattern | T3 | 5 | High |
| 3.2 | Split fat context into 3 | T3 | 5 | High |
| 3.3 | Consolidate `useState` into `useReducer` | T3 | 5 | Medium |
| 3.4 | Remove client-side faceting | T3 | 3 | Medium |
| 3.5 | Remove `mockVehicles` from client bundles | T3 | 3 | Medium |
| 3.6 | Simplify URL sync to single effect | T3 | 2 | Low |

**Total Story Points:** 51
- Tier 1: 10 points (10 stories)
- Tier 2: 16 points (10 stories)
- Tier 3: 23 points (6 stories)
