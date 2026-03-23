Here's the complete list of every file changed across the entire cleanup (Batches 1–7 + reviewer feedback round). All paths relative to apps/web/src/.

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
