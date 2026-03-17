# Screaming Architecture — Component Reorganization Plan

> **Status**: Proposal
> **Date**: March 2026
> **Scope**: `apps/web/src/` directory restructure

---

## Problem

Related code is scattered across 5+ directories per feature. Working on VDP requires touching:

```
components/features/vdp/          ← 35 flat component files
services/vdp/                     ← API service + mocks + types
lib/data/vehicle/                 ← vehicle data types + mock data
lib/queries/saved-vehicles.ts     ← query factory
hooks/use-optimistic-list-mutation.ts  ← shared hook
providers/favorites-provider.tsx  ← state management
```

This forces developers to mentally map across directories, slows onboarding, and makes feature deletion risky (orphaned files).

---

## Target Architecture

Adopt **feature-sliced screaming architecture**: the folder structure screams the business domain, not the technical role.

```
src/
├── app/                          ← Next.js routes (unchanged)
│   ├── page.tsx
│   ├── layout.tsx
│   ├── used-cars/[[...params]]/
│   ├── my-garage/
│   ├── favorites/
│   └── api/
│
├── features/                     ← One folder per business domain
│   ├── vdp/
│   │   ├── components/
│   │   │   ├── vehicle-pdp.tsx
│   │   │   ├── pricing-tab.tsx
│   │   │   ├── overview-tab.tsx
│   │   │   ├── features-tab.tsx
│   │   │   ├── specs.tsx
│   │   │   ├── badges-vehicle.tsx
│   │   │   ├── colors-vehicle.tsx
│   │   │   ├── dealer-info.tsx
│   │   │   ├── image-thumbnail-carousal.tsx
│   │   │   ├── image-preview-modal.tsx
│   │   │   ├── key-features.tsx
│   │   │   ├── prequalify-card.tsx
│   │   │   ├── test-drive-card.tsx
│   │   │   ├── trade-in-card.tsx
│   │   │   ├── vehicle-breadcrumb.tsx
│   │   │   ├── vehicle-meta-bar.tsx
│   │   │   ├── vehicle-rating.tsx
│   │   │   ├── vehicle-status.tsx
│   │   │   ├── vehicle-action-icons.tsx
│   │   │   ├── vehicle-details-tabs.tsx
│   │   │   ├── sticky-banner.tsx
│   │   │   ├── back-to-search.tsx
│   │   │   ├── price-and-wasprice.tsx
│   │   │   └── title.tsx
│   │   ├── hooks/
│   │   │   └── use-vehicle-details.ts
│   │   ├── services/
│   │   │   ├── vdp.service.ts
│   │   │   ├── vdp.mocks.ts
│   │   │   └── types.ts
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   └── index.ts              ← Public API
│   │
│   ├── search/
│   │   ├── components/
│   │   │   ├── search-hero.tsx
│   │   │   ├── vehicle-results.tsx
│   │   │   ├── filter-sidebar/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── filter-section.tsx
│   │   │   │   ├── sidebar-filters.tsx
│   │   │   │   └── types.ts
│   │   │   └── search-bar/
│   │   │       ├── search-bar.tsx
│   │   │       ├── search-input.tsx
│   │   │       ├── dropdown-suggestions.tsx
│   │   │       ├── pills-suggestions.tsx
│   │   │       ├── search-backdrop.tsx
│   │   │       └── services/
│   │   │           ├── vehicle-autocomplete.ts
│   │   │           └── mock-autocomplete.ts
│   │   ├── hooks/
│   │   │   ├── use-search.ts
│   │   │   ├── use-search-history.ts
│   │   │   ├── use-search-suggestions.ts
│   │   │   ├── use-search-navigation.ts
│   │   │   ├── use-voice-recognition.ts
│   │   │   └── __tests__/
│   │   │       ├── use-search-history.test.ts
│   │   │       └── use-search-suggestions.test.ts
│   │   ├── services/
│   │   │   ├── search.service.ts
│   │   │   ├── search-history-api.ts
│   │   │   └── mock-search-service.ts
│   │   ├── queries/
│   │   │   └── search-history.ts
│   │   ├── context/
│   │   │   ├── search-context.tsx
│   │   │   └── search-history-provider.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── favorites/
│   │   ├── components/
│   │   │   └── favorite-button.tsx
│   │   ├── services/
│   │   │   └── saved-vehicles-api.ts
│   │   ├── queries/
│   │   │   └── saved-vehicles.ts
│   │   ├── context/
│   │   │   └── favorites-provider.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── landing/
│   │   ├── components/
│   │   │   ├── home-hero/
│   │   │   │   ├── home-hero.tsx
│   │   │   │   ├── home-hero-static.tsx
│   │   │   │   ├── home-hero-search.tsx
│   │   │   │   ├── home-hero-title.tsx
│   │   │   │   ├── home-hero-known-user-content.tsx
│   │   │   │   └── user-context.tsx
│   │   │   ├── buying-process/
│   │   │   │   ├── buying-process.tsx
│   │   │   │   ├── buying-process-card.tsx
│   │   │   │   └── buying-process-carousel.tsx
│   │   │   ├── vehicle-type-selector/
│   │   │   │   ├── vehicle-type-selector.tsx
│   │   │   │   └── vehicle-type-card.tsx
│   │   │   ├── arrow-inspected/
│   │   │   │   ├── arrow-inspected-section.tsx
│   │   │   │   └── inspection-feature-card.tsx
│   │   │   ├── vehicle-quick-links/
│   │   │   │   ├── vehicle-quick-links-grid.tsx
│   │   │   │   └── vehicle-quick-link-card.tsx
│   │   │   └── customer-journey-carousel/
│   │   │       └── customer-journey-carousel.tsx
│   │   ├── services/
│   │   │   ├── landing.service.ts
│   │   │   └── landing.mocks.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── my-garage/
│   │   ├── components/
│   │   │   ├── my-garage-cards.tsx
│   │   │   ├── test-drive-banner.tsx
│   │   │   ├── vehicle-stats-grid.tsx
│   │   │   └── garage-info-card.tsx
│   │   ├── hooks/
│   │   │   ├── fetch-garage-cars.ts
│   │   │   └── fetch-because-viewed-cars.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── tracking/
│   │   ├── components/
│   │   │   └── feature-flag-debug.tsx
│   │   ├── hooks/
│   │   │   └── use-event-tracking.ts
│   │   ├── services/
│   │   │   ├── event-tracker.ts
│   │   │   ├── events.service.ts
│   │   │   ├── fingerprint.service.ts
│   │   │   ├── sealed.service.ts
│   │   │   └── visitor-profile.service.ts
│   │   ├── context/
│   │   │   ├── arrow-provider.tsx
│   │   │   ├── profile-context.tsx
│   │   │   ├── visitor-profile.tsx
│   │   │   └── fingerprint-client.tsx
│   │   ├── lib/
│   │   │   ├── client-api.ts
│   │   │   ├── server-api.ts
│   │   │   ├── sdk-transforms.ts
│   │   │   ├── encryption.ts
│   │   │   └── fingerprint-filter.ts
│   │   ├── config.ts
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── vehicle-preview/
│       ├── components/
│       │   └── vehicle-preview-modal.tsx
│       ├── types.ts
│       └── index.ts
│
├── shared/                       ← ONLY truly cross-cutting concerns
│   ├── components/
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── chips.tsx
│   │   ├── circular-progress.tsx
│   │   ├── color-swatch.tsx
│   │   ├── animated-section.tsx
│   │   ├── animated-counter.tsx
│   │   ├── snap-section.tsx
│   │   ├── print-button.tsx
│   │   ├── share-button.tsx
│   │   └── vehicle-print-sheet.tsx
│   ├── hooks/
│   │   ├── use-optimistic-list-mutation.ts
│   │   ├── use-is-mobile.ts
│   │   ├── use-viewport-height.ts
│   │   └── use-single-modal.ts
│   ├── providers/
│   │   ├── query-provider.tsx
│   │   ├── location-provider.tsx
│   │   └── theme-provider.tsx
│   ├── lib/
│   │   ├── indexeddb.ts
│   │   ├── compose-providers.tsx
│   │   ├── formatters.ts
│   │   ├── cookie-cache.ts
│   │   └── body-scroll-lock.ts
│   └── types.ts
│
├── layout/                       ← App shell (unchanged)
│   ├── header/
│   │   ├── header-nav.tsx
│   │   ├── auth-buttons.tsx
│   │   ├── favorites-button.tsx
│   │   ├── mobile-menu.tsx
│   │   └── location-block.tsx
│   ├── footer/
│   │   └── footer-navigation.tsx
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── nav.tsx
│
└── config/                       ← App-wide configuration
    ├── routes/
    │   ├── constants.ts
    │   ├── used-cars.ts
    │   ├── vdp.ts
    │   ├── srp.ts
    │   └── vehicle-segments.ts
    ├── flags/
    │   ├── flags.ts
    │   ├── client.ts
    │   ├── server.ts
    │   ├── feature-toggles.ts
    │   └── config.ts
    ├── fonts.ts
    └── messages/
        └── used-cars.ts
```

---

## Architectural Principles

### 1. The "3+ Rule" for `shared/`

A component lives in its feature folder until **3 or more features** import it. Only then promote it to `shared/`. This prevents premature abstraction and keeps features self-contained.

```
Used by 1 feature  → stays in that feature
Used by 2 features → stays in the first feature, imported by the second
Used by 3+ features → promote to shared/
```

### 2. Feature Public API via `index.ts`

Each feature exports only what other features need. Internal components, services, and hooks are **private** to the feature.

```ts
// features/favorites/index.ts — PUBLIC API
export { FavoritesProvider, useFavorites } from "./context/favorites-provider";
export { FavoriteButton } from "./components/favorite-button";
export type { FavoritesContextValue } from "./types";

// Internal files like saved-vehicles-api.ts are NOT exported
```

### 3. Import Rules

Features interact only through each other's public API:

```
features/vdp/  → features/favorites/index.ts     (public API)
features/vdp/  → features/favorites/services/     (FORBIDDEN)
features/vdp/  → shared/                          (always OK)
shared/        → features/                        (FORBIDDEN)
layout/        → features/                        (via public API)
app/           → features/                        (via public API)
```

**Dependency direction** (top imports from bottom, never upward):

```
  app/           (routes — consumes everything)
  layout/        (app shell — consumes features + shared)
  features/      (business domains — consume shared, each other's public API)
  shared/        (cross-cutting — no feature imports)
  config/        (pure configuration — no component imports)
```

### 4. Co-locate Tests

Tests live next to the code they test:

```
features/search/hooks/
  use-search-history.ts
  __tests__/
    use-search-history.test.ts
```

### 5. Feature Internal Organization

Each feature follows the same structure (include only the folders you need):

```
features/<name>/
├── components/     ← React components (TSX)
├── hooks/          ← Custom React hooks
├── services/       ← API calls, data fetching
├── queries/        ← TanStack Query key factories
├── context/        ← React context providers
├── lib/            ← Feature-specific utilities
├── constants.ts    ← Feature constants
├── types.ts        ← Feature TypeScript types
└── index.ts        ← Public API (barrel export)
```

Not every feature needs every subfolder. Small features like `favorites` may only have `components/`, `services/`, `queries/`, `context/`, and `index.ts`.

---

## Migration Map

What moves where:

| Current Location | Target Location | Notes |
|---|---|---|
| `components/features/vdp/*` | `features/vdp/components/` | 35 files, co-locate with service |
| `services/vdp/` | `features/vdp/services/` | Domain co-location |
| `lib/data/vehicle/` | `features/vdp/types.ts` | Domain types belong with feature |
| `components/features/search/*` | `features/search/components/` | Including filter-sidebar/ |
| `components/shared/search-bar/` | `features/search/components/search-bar/` | Only used in search contexts |
| `services/search/` | `features/search/services/` | Domain co-location |
| `services/search-history-api.ts` | `features/search/services/` | Domain co-location |
| `lib/queries/search-history.ts` | `features/search/queries/` | Domain co-location |
| `providers/search-history-provider.tsx` | `features/search/context/` | Domain co-location |
| `components/layout/search/` | `features/search/context/` | Search layout context |
| `lib/search/*` | `features/search/` | Search utilities |
| `hooks/use-search-navigation.ts` | `features/search/hooks/` | Search-specific hook |
| `services/saved-vehicles-api.ts` | `features/favorites/services/` | Domain co-location |
| `lib/queries/saved-vehicles.ts` | `features/favorites/queries/` | Domain co-location |
| `providers/favorites-provider.tsx` | `features/favorites/context/` | Domain co-location |
| `components/shared/favourite-button.tsx` | `features/favorites/components/` | Primary domain is favorites |
| `components/features/landing/*` | `features/landing/components/` | Already well-organized |
| `services/landing/` | `features/landing/services/` | Domain co-location |
| `components/features/mygarage/*` | `features/my-garage/components/` | Domain co-location |
| `lib/my-garage/*` | `features/my-garage/hooks/` | Domain co-location |
| `components/layout/my-garage/` | `features/my-garage/components/` | My garage layout |
| `components/features/vehicle-preview-modal/` | `features/vehicle-preview/components/` | Own domain |
| `components/features/card/*` | `features/vehicle-preview/components/` | Shared card components |
| `lib/arrow/*` | `features/tracking/` | Self-contained domain |
| `services/events/` | `features/tracking/services/` | Domain co-location |
| `services/fingerprint/` | `features/tracking/services/` | Domain co-location |
| `services/visitor-profile/` | `features/tracking/services/` | Domain co-location |
| `providers/query-provider.tsx` | `shared/providers/` | App-wide infrastructure |
| `providers/location-provider.tsx` | `shared/providers/` | Used everywhere |
| `providers/theme-provider.tsx` | `shared/providers/` | Used everywhere |
| `hooks/use-optimistic-list-mutation.ts` | `shared/hooks/` | Used by 2+ features |
| `hooks/use-is-mobile.ts` | `shared/hooks/` | Used everywhere |
| `hooks/use-viewport-height.ts` | `shared/hooks/` | Used everywhere |
| `hooks/use-single-modal.ts` | `shared/hooks/` | Used by 2+ features |
| `lib/indexeddb.ts` | `shared/lib/` | Used by 2+ features |
| `lib/compose-providers.tsx` | `shared/lib/` | App-wide utility |
| `lib/formatters.ts` | `shared/lib/` | Used everywhere |
| `lib/cookie-cache.ts` | `shared/lib/` | Used everywhere |
| `lib/body-scroll-lock.ts` | `shared/lib/` | Used everywhere |
| `lib/routes/` | `config/routes/` | App-wide config |
| `lib/flags/` | `config/flags/` | App-wide config |
| `lib/fonts.ts` | `config/fonts.ts` | App-wide config |
| `lib/messages/` | `config/messages/` | App-wide config |

---

## Migration Strategy

Migrate **one feature at a time**. Each migration is a single PR with only file moves (`git mv`) and import path updates. No logic changes.

### Phase 1: Smallest feature first — `favorites`

**Files to move**: 4
**Goal**: Validate the pattern, establish conventions.

1. Create `features/favorites/` structure
2. `git mv` the 4 files (provider, service, query factory, button)
3. Update all import paths (grep for old paths)
4. Update `index.ts` barrel export
5. Verify: `pnpm type-check && pnpm test && pnpm check`

### Phase 2: `search`

**Files to move**: ~25
**Goal**: Validate hooks/context co-location with a complex feature.

1. Create `features/search/` structure
2. Move search components, search-bar, hooks, services, context, queries
3. Update import paths across all consumers
4. Verify tests still pass

### Phase 3: `vdp`

**Files to move**: ~40
**Goal**: Validate component sub-grouping for a large feature.

1. Create `features/vdp/` structure
2. Move 35 components + service + types
3. Consider sub-grouping components by concern (pricing/, info/, layout/)
4. Update import paths

### Phase 4: `landing`

**Files to move**: ~20
**Goal**: Already well-organized internally, straightforward move.

### Phase 5: `my-garage`

**Files to move**: ~10
**Goal**: Merge scattered layout and feature components.

### Phase 6: `tracking`

**Files to move**: ~20
**Goal**: Consolidate the Arrow analytics system.

### Phase 7: Cleanup

1. Move remaining `shared/` components that don't meet the 3+ rule
2. Move `lib/routes/` and `lib/flags/` to `config/`
3. Delete empty directories
4. Update `tsconfig.json` path aliases if needed
5. Update README architecture section

---

## Path Alias Update

After migration, update `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./src/*"],
      // Optional: add feature shortcuts for deep imports
      "@features/*": ["./src/features/*"],
      "@shared/*": ["./src/shared/*"],
      "@config/*": ["./src/config/*"]
    }
  }
}
```

---

## Why This Is Scalable

| Concern | Current | After Migration |
|---|---|---|
| **Onboarding** | Hunt across 5+ dirs per feature | Open one folder, see everything |
| **Feature ownership** | Unclear boundaries | Team owns `features/<name>/` |
| **Feature deletion** | Risk of orphaned files | Delete one folder |
| **Code review** | Scattered diffs across dirs | Changes scoped to feature |
| **AI-assisted dev** | Large context needed | Co-located code = less context |
| **Lazy loading** | Manual code splitting | Feature folders map to routes |
| **Testing** | Tests far from source | Co-located tests |
| **Import clarity** | Deep path knowledge required | Public API via index.ts |

---

## Rules Enforcement

Add these to the project's linting/review guidelines:

1. **No cross-feature internal imports** — only import from `features/<name>/index.ts`
2. **No feature imports from `shared/`** — shared must remain dependency-free
3. **Promote to `shared/` only at 3+ consumers** — prevent premature abstraction
4. **Every feature has an `index.ts`** — defines the public API
5. **Tests co-located** — `__tests__/` adjacent to source files
