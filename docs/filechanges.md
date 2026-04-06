Here's the complete list of every file changed across the entire cleanup (Batches 1–7 + reviewer feedback round). All paths relative to apps/web/src/.

web:dev: [browser] Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:
web:dev:
web:dev: - A server/client branch `if (typeof window !== 'undefined')`.
web:dev: - Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
web:dev: - Date formatting in a user's locale which doesn't match the server.
web:dev: - External changing data without sending a snapshot of it along with the HTML.
web:dev: - Invalid HTML tag nesting.
web:dev:
web:dev: It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.
web:dev:
web:dev: https://react.dev/link/hydration-mismatch
web:dev:
web:dev:   ...
web:dev:     <SearchClient initialQuickFilters={[...]}>
web:dev:       <div className="flex min-h...">
web:dev:         <FilterSidebar availableFilters={{...}} filterState={{...}} isOpen={false} loadingFacetSections={[...]} ...>
web:dev:           <aside className="fixed top-...">
web:dev:             <div>
web:dev:             <div className="flex flex-...">
web:dev:               <SidebarNav>
web:dev:               <SidebarFilters availableFilters={{...}} draftState={{...}} facetCounts={undefined} ...>
web:dev:                 <div className="relative f...">
web:dev:                   <div className="scrollbar-..." onScroll={function FilterSidebar.useCallback[handleScroll]} ...>
web:dev:                     <div className="pb-6 lg:pb-12">
web:dev:                       <FilterSectionPrice filterSections={{...}} ...>
web:dev:                         <FilterSection isLoading={false} isOpen={false} onToggle={function onToggle} ...>
web:dev:                           <div className="border-gra..." ref={function sectionRef}>
web:dev:                             <_c className="flex h-aut..." onClick={function onToggle} type="button" variant="search">
web:dev:                               <button className={"cursor-p..."} ref={null} onClick={function onToggle} type="button">
web:dev:                                 <span className="flex items...">
web:dev: -                                 <output
web:dev: -                                   aria-label="Price is updating"
web:dev: -                                   aria-live="polite"
web:dev: -                                   className="inline-block h-3 w-3 animate-spin rounded-full border border-gray-300 b..."
web:dev: -                                 >
web:dev:                                 ...
web:dev:                       ...
web:dev:                   ...
web:dev:         ...
web:dev:
web:dev:     at <unknown> (https://react.dev/link/hydration-mismatch)
web:dev:     at span (<anonymous>)
web:dev:     at FilterSection (src/features/search/components/filter-sidebar/filter-section.tsx:28:9)
web:dev:     at FilterSectionPrice (src/features/search/components/filter-sidebar/sections/filter-section-price.tsx:32:3)
web:dev:     at SidebarFilters (src/features/search/components/filter-sidebar/sidebar-filters.tsx:86:11)
web:dev:     at FilterSidebar (src/features/search/components/filter-sidebar/index.tsx:225:11)
web:dev:     at SearchClient (src/features/search/context/search-client.tsx:355:7)
web:dev:     at SearchWrapper (src/features/search/context/search-wrapper.tsx:69:9)
web:dev:     at UsedCarsPage (src/app/used-cars/[[...params]]/page.tsx:81:9)
web:dev:   26 |         variant="search"
web:dev:   27 |       >
web:dev: > 28 |         <span className="flex items-center gap-2 font-semibold text-[length:var(--text-md)] text-[var(--color-brand-text-primary)] leading-normal">
web:dev:      |         ^
web:dev:   29 |           {title}
web:dev:   30 |           {isLoading && (
web:dev:   31 |             <output
web:dev: Route / is rendering with server caches disabled. For this navigation, Component Metadata in React DevTools will not accurately reflect what is statically prerenderable and runtime prefetchable. See more info here: https://nextjs.org/docs/messages/cache-bypass-in-dev

PR Title: Modular codebase cleanup: decompose monolithic components + consolidate vehicle domain

PR Body:

Summary
Decompose large monolithic component files across VDP, search, my-garage, vehicle-card, and shared features by extracting types, constants, helpers, and sub-components into co-located sibling files
Consolidate scattered vehicle-related types and utilities into a canonical shared/vehicle/ domain (types, mappers, formatters, print-sheet components)
Convert all export * barrel files to explicit named exports for tighter public API control
Trim over-exported barrels (vdp/components 12→5, my-garage 5→1, search 27→2)
Merge team's in-flight changes: search-bar focus retry logic, search-hero progress bar, filter-sidebar a11y fix (div→button), search-client display query + reset consolidation, home-hero responsive breakpoints
What changed
Structural extractions (no behavioral changes):

vehicle-meta-bar.tsx — color swatches/helpers → .constants.ts, chips merged back inline
vehicle-pdp.tsx — scroll handler → hooks/use-sticky-scroll.ts
price-range-meter.tsx — magic numbers → .constants.ts
price-history-table.tsx — formatters → vdp/lib/formatters.tsx
my-garage-cards.tsx — 5 sub-card components → my-garage-sub-cards.tsx, interfaces → types.ts
my-garageclient.tsx — helpers → my-garage/lib/helpers.ts
vehicle-results.tsx — mapper → search/lib/vehicle-to-card-props.ts
search-context.tsx — facet helpers → search/lib/facet-utils.ts
custom-badge.tsx — constants, helpers, types → 3 sibling files
custom-chips.tsx — helpers, types → 2 sibling files
refine-search-modal.tsx — buildFilterOptions → .helpers.ts
Vehicle domain consolidation:

Created shared/vehicle/ with canonical types.ts, mappers.ts, formatters.ts
Moved print-sheet components from shared/components/ → shared/vehicle/components/
Eliminated 110 lines of duplicate types in vdp/services/types.ts (now re-exports from vdp/data/types.ts)
Barrel hygiene:

6 barrel files converted from export * → explicit named exports
3 barrels trimmed to only externally-consumed exports
Team changes merged:

search-bar.tsx — hasInteracted default, focus retry with exponential backoff
search-hero.tsx — progress bar in sticky header, min-h-20
search-client.tsx — itemsPerPage 20→12, displaySearchQuery (hyphen→space), consolidated resetFilters
search-wrapper.tsx — key prop moved from SearchClient to SearchProvider
filter-sidebar/index.tsx — overlay div→button for a11y
home-hero-static.config.ts — granular responsive breakpoints (m360–t900)

New Files Created (22)
#	Path	Description
1	shared/vehicle/types.ts	Canonical Vehicle interface
2	shared/vehicle/formatters.ts	formatPrice, formatMileage
3	shared/vehicle/mappers.ts	vehicleToCarCardProps re-export
4	shared/vehicle/index.ts	Vehicle domain barrel
5	shared/vehicle/components/vehicle-print-sheet.tsx	Print component (moved from shared/components/)
6	shared/vehicle/components/vehicle-print-sheet-sections.tsx	6 print sub-components (moved from shared/components/)
7	shared/vehicle/components/vehicle-print-sheet.constants.ts	Print styles (moved from shared/components/)
8	shared/components/custom-badge.constants.ts	Badge class maps, icon maps
9	shared/components/custom-badge-helpers.tsx	MaskedIcon, resolveIcon, isCustomVariant
10	shared/components/custom-badge.types.ts	CustomBadgeType, CustomBadgeProps
11	shared/components/custom-chips.types.ts	CustomChipType, FilterChipProps
12	shared/components/custom-chips.helpers.ts	resolveStateClass
13	features/vdp/components/vehicle-meta-bar.constants.ts	Color swatches, helpers
14	features/vdp/components/price-range-meter.constants.ts	Price multipliers, segments
15	features/vdp/hooks/use-sticky-scroll.ts	Scroll handler hook
16	features/vdp/lib/formatters.tsx	Date/price/change formatters
17	features/vehicle-card/components/refine-search-modal.helpers.ts	buildFilterOptions
18	features/my-garage/components/types.ts	Card prop interfaces
19	features/my-garage/components/my-garage-sub-cards.tsx	5 sub-card components
20	features/my-garage/lib/helpers.ts	parseDealerInfo, getBadgeType
21	features/search/lib/vehicle-to-card-props.ts	Vehicle → CarCardProps mapper
22	features/search/lib/facet-utils.ts	listEqual, mergeUniqueSections, changedFacetSections
Files Deleted (6)
#	Path	Reason
1	shared/entities/	Entire directory removed (renamed to shared/vehicle/)
2	shared/components/vehicle-print-sheet.tsx	Moved to shared/vehicle/components/
3	shared/components/vehicle-print-sheet-sections.tsx	Moved to shared/vehicle/components/
4	shared/components/vehicle-print-sheet.constants.ts	Moved to shared/vehicle/components/
5	features/vehicle-card/components/car-card-helpers.tsx	Merged into car-card.tsx
6	features/vdp/components/vehicle-meta-bar-chips.tsx	Merged into vehicle-meta-bar.tsx
Files Modified (37)
shared/
#	Path	Change
1	shared/types.ts	Re-exports from @shared/vehicle
2	shared/data/index.ts	export * → named exports
3	shared/components/print-button.tsx	Import path updated to @shared/vehicle/components/
4	shared/components/custom-badge.tsx	Rewritten (280→~80 lines)
5	shared/components/custom-chips.tsx	Rewritten (176→~85 lines)
features/vdp/
#	Path	Change
6	features/vdp/components/vehicle-meta-bar.tsx	Chips merged in (98→160 lines)
7	features/vdp/components/vehicle-pdp.tsx	Scroll logic extracted (316→~180 lines)
8	features/vdp/components/price-range-meter.tsx	Constants extracted (239→~120 lines)
9	features/vdp/components/price-history-table.tsx	Formatters extracted (141→~70 lines)
10	features/vdp/components/sticky-banner.tsx	Props moved to types.ts
11	features/vdp/components/index.ts	Trimmed 12→5 exports
12	features/vdp/data/types.ts	Added component prop types
13	features/vdp/data/index.ts	export * → named exports
14	features/vdp/services/types.ts	Replaced duplicates with re-exports from data/types
15	features/vdp/services/index.ts	export * → named exports
features/vehicle-card/
#	Path	Change
16	features/vehicle-card/components/car-card.tsx	Helpers merged in, badge logic inlined
17	features/vehicle-card/components/refine-search-modal.tsx	Filter logic extracted
features/my-garage/
#	Path	Change
18	features/my-garage/components/my-garage-cards.tsx	Sub-cards extracted (526→~140 lines)
19	features/my-garage/components/my-garageclient.tsx	Added missing imports/props
20	features/my-garage/components/my-garagewrapper.tsx	Removed dead prop
21	features/my-garage/index.ts	Trimmed 5→1 export
features/search/
#	Path	Change
22	features/search/components/vehicle-results.tsx	Mapper extracted
23	features/search/components/search-hero.tsx	Props moved to types
24	features/search/context/search-context.tsx	Helpers extracted
25	features/search/lib/url-filters.ts	Dead _setCsv removed
26	features/search/lib/mock-vehicles.ts	Imports from @shared/vehicle
27	features/search/index.ts	Trimmed 27→2 exports
28	features/search/services/index.ts	export * → named exports
features/landing/
#	Path	Change
29	features/landing/services/index.ts	export * → named exports
30	features/landing/components/arrow-inspected/inspection-feature-card.tsx	iconSrc ?? "" fix
31	features/landing/components/vehicle-quick-links/vehicle-quick-link-card.tsx	iconSrc ?? "" fix
32	features/landing/components/buying-process/buying-process-card.tsx	iconSrc ?? "" fix
33	features/landing/components/buying-process/buying-process-carousel.tsx	iconSrc ?? "" fix
features/tracking/
#	Path	Change
34	features/tracking/services/index.ts	export * → named exports
layout/
#	Path	Change
35	layout/header/location-block.tsx	Removed 12 lines dead code
36	layout/footer/footer-top.tsx	iconSrc ?? "" fix
app/
#	Path	Change
37	app/api/session/transform-fingerprint.ts	Fixed import source
38	app/tracking-demo/page.tsx	Fixed type mismatch
Summary Totals
Action	Count
New files	22
Deleted files	6
Modified files	38
Total files touched	66
New Folders Created

shared/vehicle/
shared/vehicle/components/
features/my-garage/lib/
features/vdp/lib/
features/vdp/hooks/
Folders Removed

shared/entities/          (renamed to shared/vehicle/)
