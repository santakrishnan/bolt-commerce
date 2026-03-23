VDP + Search Components — React 19 / Vercel / Next.js Audit
Validated against: vercel-react-best-practices, vercel-composition-patterns, next-best-practices

CRITICAL (fix now)
1. useLayoutEffect with NO dependency array — price-range-meter.tsx:51-85
Rule: rerender-dependencies

Runs after every single render — re-adds/removes the resize listener each time, and may trigger infinite re-renders via setDotLeftPx / setAvgDotLeftPx.


// BAD — no deps array
useLayoutEffect(() => {
  const compute = () => { ... setDotLeftPx(...); setAvgDotLeftPx(...); };
  compute();
  window.addEventListener("resize", compute);
  return () => window.removeEventListener("resize", compute);
}); // ← missing []
Fix: Add [currentPrice, avgPrice] as dependencies (the values that affect the computation).

HIGH (should fix)
2. Three useState on every scroll tick — vehicle-pdp-sticky-client.tsx:52-60
Rule: rerender-transitions + rerender-use-ref-transient-values

Every scroll event calls setStickyScrollOffset, setShowStickyCTA, and setScrollDirection — three state updates = three potential re-renders per scroll frame.


// BAD — re-renders on every scroll
setStickyScrollOffset(offset > 0 ? offset : 0);
setShowStickyCTA(rect.top < headerHeight);
setScrollDirection(currentY > prevScrollY ? "down" : "up");
Fix: Either (a) batch into a single state object, or (b) use useRef for stickyScrollOffset/scrollDirection since only showStickyCTA (boolean threshold) drives visible UI changes — matches the rerender-derived-state rule (subscribe to boolean thresholds, not continuous values).

Note: The { passive: true } on the scroll listener (line 64) is already correct.

3. getActiveFilters() recomputed on every render — search-client.tsx:208-240
Rule: rerender-derived-state-no-effect

Creates a new array on every render (16+ addSingleFilter/addArrayFilters calls), passed to children as a prop. New reference = child re-renders even when filters haven't changed.


// BAD — runs unconditionally on every render
const getActiveFilters = () => { ... };
const activeFilters = getActiveFilters();
Fix: Wrap in useMemo:


const activeFilters = useMemo(() => {
  const filters = [];
  // ... same logic
  return filters;
}, [filterState, labelFilter, refineSearchFilters]);
4. Pointless useEffect calling getHeaderHeight() — vehicle-pdp.tsx:60-62
Rule: rerender-derived-state-no-effect

Calls getHeaderHeight() but discards the return value. The result is never stored in state or used anywhere.


// BAD — effect does nothing useful
useEffect(() => {
  getHeaderHeight();
}, [getHeaderHeight]);
Fix: Delete the effect and the getHeaderHeight callback entirely — they're dead code.

5. useDebouncedValue uses useEffect + setTimeout — search-context.tsx:85-94 + search-client.tsx:30-47
Rule: React 19 pattern preference

Two separate useDebouncedValue implementations using useState + useEffect + setTimeout.

search-context.tsx (line 276-277): Debounces TanStack Query keys to avoid API calls on every keystroke. This is a valid use of setTimeout debouncing — useDeferredValue wouldn't help because you need to delay the fetch, not the render.
search-client.tsx (line 152-161): Debounces state→URL serialization. This can be replaced with useDeferredValue since you're deferring a render-time computation (URL serialization), not a network call.
Fix for search-client.tsx only:


// BETTER — React 19 built-in
const deferredUrlState = useDeferredValue({
  filterState, searchQuery, page: currentPage, sortOption, labelFilter,
});
MEDIUM (recommended)
6. Inline object literal in props — vehicle-pdp.tsx:83-105
Rule: rerender-memo-with-default-value (related — unstable object reference)

Creates a new vehicle object on every render, passed to VehicleActionIcons:


// BAD — new object every render
<VehicleActionIcons
  vehicle={{
    title: vehicle.title,
    year: vehicle.year,
    // ... 14 more fields
  }}
/>
Fix: Extract to useMemo or pass vehicle prop directly if the child can accept the full type.

7. Filter sidebar scroll handler without startTransition — filter-sidebar/index.tsx:74-88
Rule: rerender-transitions

setScrollInfo(...) fires on every scroll event inside the sidebar. Non-urgent visual update.


// BAD — blocks on every scroll
setScrollInfo({ thumbTop, thumbHeight });
Fix: Wrap in startTransition:


const [, startTransition] = useTransition();
const handleScroll = useCallback(() => {
  // ...compute...
  startTransition(() => setScrollInfo({ thumbTop, thumbHeight }));
}, [startTransition]);
8. Complex focus retry in useEffect — search-bar.tsx:138-192
Rule: rerender-move-effect-to-event

60-line effect with exponential retry timers (50ms, 150ms, 300ms) fires on every value change. This is modeling a user interaction response (focus after typing) as state + effect.

Fix: Move focus logic into the onChange event handler where value is set, or into onQuickFilterSelect / onSuggestionSelect — the specific events that change value and need focus.

LOW / INFORMATIONAL
9. search-hero.tsx:54-59 — render-time state sync is CORRECT

const [localQuery, setLocalQuery] = useState(searchQuery);
const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
if (searchQuery !== prevSearchQuery) {
  setPrevSearchQuery(searchQuery);
  setLocalQuery(searchQuery);
}
This is the React-recommended pattern for "adjusting state during render" — better than useEffect because it avoids an extra render cycle. No change needed.

10. search-context.tsx:133 — uses use() correctly

export function useSearchContext() {
  const ctx = use(SearchContext); // ✓ React 19 use() instead of useContext()
Already follows react19-no-forwardref rule. Good.

11. search-hero.tsx:73 — uses use() for module-level promise

const dynamicPills = use(quickFiltersPromise); // ✓ React 19 pattern
Correctly uses React 19's use() hook for suspense-based data loading.

12. search-context.tsx:214 — uses useTransition correctly

const [, startFilterTransition] = useTransition();
// ...
startFilterTransition(() => {
  setFilterState(newFilterState);
  setSearchQuery(nextSearchQuery);
  // ...
});
Already follows the rerender-transitions rule for filter updates.
