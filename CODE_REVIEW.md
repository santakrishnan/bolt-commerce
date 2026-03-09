# Arrow E-Commerce — Landing Page Code Review

**Date:** 2026-03-09
**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Embla Carousel
**Scope:** All landing page components, shared components, providers, layout, and data layer

---

## Severity Key

| Symbol | Severity | Definition |
|--------|----------|------------|
| 🔴 P1 | Critical | Broken, silent bugs, or data corruption |
| 🟡 P2 | High | Violates standards, causes regressions, hurts UX |
| 🟢 P3 | Medium | Quality, consistency, maintainability |
| 🔵 P4 | Low | Nice-to-have, style, documentation |

---

## 1. Bugs — Fix Immediately

### 1.1 🔴 CSS Typo — Double Dash (class silently ignored)

**File:** [`vehicle-quick-link-card.tsx:33`](apps/web/src/components/features/landing/vehicle-quick-links/vehicle-quick-link-card.tsx#L33)

```tsx
// BUG — "bg--white/70" has a double dash; Tailwind ignores this class entirely
backgroundColor || "bg--white/70"

// FIX
backgroundColor || "bg-white/70"
```

---

### 1.2 🔴 Broken Tailwind Class — Missing Closing Bracket

**File:** [`home-hero-known-user-content.tsx:274`](apps/web/src/components/features/landing/home-hero/home-hero-known-user-content.tsx#L274)

```tsx
// BUG — missing ] closes the first bracket, so the second class name leaks in
className="flex items-center justify-center gap-1 text-[length:var(--font-size-xs) text-foreground-600"

// FIX
className="flex items-center justify-center gap-1 text-[length:var(--font-size-xs)] text-foreground-600"
```

---

### 1.3 🔴 Invalid Tailwind Utility — `transition-height` Does Not Exist

**Files:** [`home-hero-search-wrapper.tsx:48`](apps/web/src/components/features/landing/home-hero/home-hero-search-wrapper.tsx#L48) and [`home-hero-search.tsx:48`](apps/web/src/components/features/landing/home-hero/home-hero-search.tsx#L48)

```tsx
// BUG — Tailwind has no "transition-height" utility; this silently does nothing
"fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px] transition-height ease-out"

// FIX — only opacity is being animated on this overlay
"fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px] transition-opacity ease-out"
```

---

### 1.4 🔴 `isLoading` in `CartProvider` Never Becomes `true`

**File:** [`cart-provider.tsx:37–74`](apps/web/src/components/providers/cart-provider.tsx#L37)

React batches both `setIsLoading(true)` and `setIsLoading(false)` in the same synchronous tick — the loading state is always `false`.

```tsx
// BUG — React batches these; isLoading is always false
const addToCart = useCallback((productId: string) => {
  setIsLoading(true);
  setItems((prev) => { ... });
  setIsLoading(false); // runs immediately, no async gap
}, []);

// FIX — use optimistic update or move loading into useTransition
const addToCart = useCallback((productId: string) => {
  setItems((prev) => { ... });
}, []);
```

Same bug exists in `removeFromCart` and `clearCart`.

---

## 2. Dead Code — Remove

### 2.1 🔴 `home-hero-search.tsx` — Unused Duplicate

**File:** [`home-hero-search.tsx`](apps/web/src/components/features/landing/home-hero/home-hero-search.tsx)

`home-hero/index.ts` exports `HomeHeroSearchWrapper as HomeHeroSearch` — meaning `home-hero-search.tsx` is never imported anywhere. It is a near-copy of `home-hero-search-wrapper.tsx` with subtle differences (missing `handleSearch()` on Enter, uses `bg-[var(--color-core-surfaces-card)]` instead of `bg-white`).

**Action:** Delete `home-hero-search.tsx`.

---

### 2.2 🔴 `HomeHeroCarousel` — Defined but Never Used

**File:** [`home-hero-carousel.tsx`](apps/web/src/components/features/landing/home-hero/home-hero-carousel.tsx)

`HomeHeroStatic` replaced this component. It contains a `_goToSlide` function (unused, underscore-prefixed). Still exported from both `home-hero/index.ts` and `landing/index.ts`, adding noise to the public API.

**Action:** Delete `home-hero-carousel.tsx`. Remove all re-exports.

---

### 2.3 🟡 `SearchBar` (search-bar/search-bar.tsx) — Unfinished Scaffold

**File:** [`search-bar/search-bar.tsx`](apps/web/src/components/features/landing/search-bar/search-bar.tsx)

```tsx
export function SearchBar({ placeholder = "Search...", onSearch: _onSearch }: SearchBarProps) {
  const _debouncedSearch = useDebounce(search, 300);
  // Effect would go here to call onSearch with debouncedSearch (commented out)
```

Both `_onSearch` and `_debouncedSearch` are unused. The effect is commented out. Never used anywhere in the app.

**Action:** Delete the file and remove from `landing/index.ts`.

---

### 2.4 🟡 `CartDrawer`, `ProductCard`, `CartProvider` — Generic Scaffold, Not Domain-Relevant

**Files:** [`cart-drawer.tsx`](apps/web/src/components/features/landing/cart-drawer/cart-drawer.tsx), [`product-card.tsx`](apps/web/src/components/features/landing/product-card/product-card.tsx), [`cart-provider.tsx`](apps/web/src/components/providers/cart-provider.tsx)

These are generic e-commerce boilerplate. The app is a car dealership — there is no "shopping cart" or generic `Product`. `CartProvider` uses `Math.random()` for prices. None of these are wired into the real landing page flow.

**Action:** Confirm with the team. If unused, delete. If needed for a future feature, add a clear `// TODO` and a feature flag.

---

### 2.5 🟡 `_goToSlide` Underscore Function in Carousel

**File:** [`home-hero-carousel.tsx:41`](apps/web/src/components/features/landing/home-hero/home-hero-carousel.tsx#L41)

```tsx
const _goToSlide = (index: number) => { setCurrentIndex(index); };
```

Defined but never called. Removed when the file itself is deleted (see 2.2), but the `_` prefix pattern should not be adopted as a style — unused code should be deleted, not suppressed.

---

### 2.6 🟡 `buying-process-carousel.tsx` — `_index` Unused Parameter

**File:** [`buying-process-carousel.tsx:107,150`](apps/web/src/components/features/landing/buying-process/buying-process-carousel.tsx#L107)

```tsx
// Remove _index — it is never used in either .map() callback
{steps.map((step, _index) => { ... })}
```

---

## 3. Duplicate Data Files — Consolidate

### 3.1 🔴 `inspection/features.ts` — Two Identical Files

- [`src/data/inspection/features.ts`](apps/web/src/data/inspection/features.ts)
- [`src/lib/data/inspection/features.ts`](apps/web/src/lib/data/inspection/features.ts)

Byte-for-byte identical. `ArrowInspectedSection` and `ArrowInspectedCarousel` use the `src/data/` path via relative imports (`../../../../data/inspection/features`), while `InspectionFeatureCard` uses `~/data/inspection/features`.

**Action:** Keep only `src/lib/data/inspection/features.ts`. Update all imports to `~/lib/data/inspection/features`. Delete `src/data/inspection/features.ts`.

---

### 3.2 🔴 `vehicle-types.ts` — Two Diverged Copies

- [`src/data/vehicles/vehicle-types.ts`](apps/web/src/data/vehicles/vehicle-types.ts) — image: `/images/categories/SEDAN.png`
- [`src/lib/data/vehicles/vehicle-types.ts`](apps/web/src/lib/data/vehicles/vehicle-types.ts) — image: `/images/categories/Sedan_732x348.png`

Same structure, different image assets. `VehicleTypeSelector` imports from `~/data/` (the old path). The VDP/search layer imports from `~/lib/data/`.

**Action:** Decide which image set is canonical, merge into `~/lib/data/vehicles/vehicle-types.ts`, delete the other, update `VehicleTypeSelector` import.

---

### 3.3 🟡 `src/data/` vs `src/lib/data/` — Confused Data Layer

The existence of two `data/` directories (`src/data/` and `src/lib/data/`) causes import inconsistency. The `src/data/` folder should be eliminated — all data should live under `src/lib/data/` which is the proper location for data access functions.

---

### 3.4 🟡 `lib/flags.ts` Flat File Alongside `lib/flags/` Directory

- [`src/lib/flags.ts`](apps/web/src/lib/flags.ts) — flat file
- [`src/lib/flags/`](apps/web/src/lib/flags/) — directory with 8 files

The flat file should be removed if the directory is the canonical source. Verify nothing imports from the flat file.

---

## 4. React 19 Standards

### 4.1 🟡 `FavoritesProvider` Uses Old React API

**File:** [`favorites-provider.tsx:101,107`](apps/web/src/components/providers/favorites-provider.tsx#L101)

```tsx
// OLD — React 16/17/18 patterns:
return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
// ...
const ctx = useContext(FavoritesContext);

// React 19 standard (how CartProvider and LocationProvider already do it):
return <FavoritesContext value={value}>{children}</FavoritesContext>;
// ...
const ctx = use(FavoritesContext);
```

All three providers should be consistent. `CartProvider` and `LocationProvider` are correct — fix `FavoritesProvider`.

---

### 4.2 🟡 IIFE Inside JSX — Anti-Pattern

**File:** [`home-hero-known-user-content.tsx:88–320`](apps/web/src/components/features/landing/home-hero/home-hero-known-user-content.tsx#L88)

```tsx
// ANTI-PATTERN — IIFE inside JSX is unreadable and untestable
{showCards && (() => {
  const cards: React.ReactNode[] = [];
  if (savedVehicle) { cards.push(<div>...</div>); }
  // ...
  return <>{cards}</>;
})()}

// CORRECT — extract to a named component
function KnownUserCards({ savedVehicle, preQualifiedVehicle, tradeInOffer, ... }) {
  return (
    <>
      {savedVehicle && <SavedVehicleCard vehicle={savedVehicle} />}
      {preQualifiedVehicle && <TestDriveCard vehicle={preQualifiedVehicle} />}
      {tradeInOffer && <TradeInCard offer={tradeInOffer} />}
    </>
  );
}
```

Extracting also enables applying `React.memo` and individual error boundaries per card.

---

### 4.3 🟢 Private Section Components in `page.tsx` Should Be Separate Files

**File:** [`page.tsx:103–145`](apps/web/src/app/page.tsx#L103)

`VehicleFinderQuickLinks` and `CustomerJourneyCarouselSection` are private async server components defined at the bottom of `page.tsx`. Both contain meaningful fetch/flag logic.

**Move to:**
- `components/features/landing/vehicle-quick-links/vehicle-quick-links-section.tsx`
- `components/features/landing/customer-journey-carousel/customer-journey-section.tsx`

---

### 4.4 🟢 `await Promise.resolve(value)` Is Unnecessary

**File:** [`lib/data/index.ts:26,49`](apps/web/src/lib/data/index.ts#L26)

```tsx
// Redundant — function is already async, just return the value
return await Promise.resolve(20_847);

// Fix
return 20_847;
```

---

## 5. Type Centralization

### 5.1 🟡 `SavedVehicle` Duplicates Fields from `VehicleDetail`

**File:** [`home-hero-known-user-content.tsx:8–17`](apps/web/src/components/features/landing/home-hero/home-hero-known-user-content.tsx#L8)

`SavedVehicle` (year, make, model, price, image, vin, mileage, stockNumber) overlaps heavily with [`VehicleDetail`](apps/web/src/lib/data/vehicle/types.ts) from `lib/data/vehicle/types.ts`.

**Action:** Extend or derive from `VehicleDetail` using `Pick<VehicleDetail, 'year' | 'make' | ...>` or align the shape.

---

### 5.2 🟡 `VehicleFinderOption` / `VehicleFinderOptionStatic` — Redundant Pair

**File:** [`vehicle-quick-links/data.ts:1–12`](apps/web/src/components/features/landing/vehicle-quick-links/data.ts)

```tsx
// Two interfaces that differ by only one field — unnecessary
interface VehicleFinderOption { id; title; vehicleCount: number; icon; }
interface VehicleFinderOptionStatic { id; title; icon; } // same minus vehicleCount

// Fix — one type, optional count
interface VehicleFinderOption {
  id: string;
  title: string;
  icon: 'price-tag' | 'badge' | 'arrow-down' | 'speedometer';
  vehicleCount?: number;
}
```

---

### 5.3 🟡 `PromotionFlags` Type Lives in a Component File

**File:** [`customer-journey-carousel.tsx:8`](apps/web/src/components/features/landing/customer-journey-carousel/customer-journey-carousel.tsx#L8)

`PromotionFlags` is consumed by `page.tsx` (via `CustomerJourneyCarouselSection`) and re-exported through `landing/index.ts`. As a domain type it belongs in `lib/data/` or a dedicated `types/` file.

---

### 5.4 🟢 `formatPrice` Redefined Inside a Component

**File:** [`home-hero-known-user-content.tsx:58–63`](apps/web/src/components/features/landing/home-hero/home-hero-known-user-content.tsx#L58)

```tsx
// Defined inline — should use the existing lib
const formatPrice = (price: number) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", minimumFractionDigits: 0,
}).format(price);
```

[`lib/formatters.ts`](apps/web/src/lib/formatters.ts) exists for exactly this purpose. Add `formatCurrency` there and import it.

---

### 5.5 🔵 `parseDealerInfo` Should Be in `lib/formatters.ts`

**File:** [`my-garageclient.tsx:12–18`](apps/web/src/components/layout/my-garage/my-garageclient.tsx#L12)

```tsx
function parseDealerInfo(miles: string) {
  const parts = miles.split(" - ");
  return { dealerName: parts[0] ?? miles, distance: parts[1] ?? "" };
}
```

This is a pure string utility. Move to `lib/formatters.ts`.

---

## 6. File Naming & Organization

### 6.1 🔴 Missing Hyphens in `my-garage` Component Names

**Files:** [`my-garageclient.tsx`](apps/web/src/components/layout/my-garage/my-garageclient.tsx), [`my-garagewrapper.tsx`](apps/web/src/components/layout/my-garage/my-garagewrapper.tsx)

Convention across the entire project is `kebab-case` for all component files.

| Current | Should Be |
|---------|-----------|
| `my-garageclient.tsx` | `my-garage-client.tsx` |
| `my-garagewrapper.tsx` | `my-garage-wrapper.tsx` |

---

### 6.2 🟡 Flat File + Directory Coexistence in `layout/`

- `layout/footer.tsx` (contains `Footer`) coexists with `layout/footer/` (sub-components)
- `layout/header.tsx` (contains `Header`) coexists with `layout/header/` (sub-components)

**Standard pattern (used everywhere else):** move the parent component into the directory.

```
layout/footer/
  footer.tsx        ← rename from layout/footer.tsx
  footer-bottom.tsx
  footer-navigation.tsx
  footer-top.tsx
  index.ts          ← exports { Footer } from ./footer
```

---

### 6.3 🟢 Orphaned Layout Files Without Subdirectories

`layout/nav.tsx` and `layout/sidebar.tsx` are standalone flat files inconsistent with the directory-per-component pattern used for header, footer, and my-garage.

---

### 6.4 🟢 `SearchBar` Export Name Conflicts with the Real Search

`landing/index.ts` exports `SearchBar` (the dead scaffold) while the actual functional search is `HomeHeroSearch`. This naming confusion should be resolved when deleting the scaffold.

---

## 7. Animation Issues

### 7.1 🟡 `AnimatedSection` Re-Animates on Scroll-Back

**File:** [`animated-section.tsx:32`](apps/web/src/components/shared/animated-section.tsx#L32)

```tsx
// Current — re-triggers animation every time element exits/re-enters viewport
viewport={{ once: false, amount: 0.15 }}

// Fix — standard landing page behaviour (animate once, stay visible)
viewport={{ once: true, amount: 0.15 }}
```

---

### 7.2 🟡 `performTransitionToA` / `performTransitionToB` — ~90 Lines Duplicated

**File:** [`customer-journey-carousel.tsx:374–560`](apps/web/src/components/features/landing/customer-journey-carousel/customer-journey-carousel.tsx#L374)

The two functions are structurally identical — only "A" and "B" are swapped. This is the single biggest structural issue in the animation code.

```tsx
// Current: two ~90-line functions
function performTransitionToB(targetIndex, dir) { ... }
function performTransitionToA(targetIndex, dir) { ... }

// Fix: one parameterized function
function performTransition(
  from: 'A' | 'B',
  to: 'A' | 'B',
  targetIndex: number,
  dir: Direction
) {
  const setFromImage = from === 'A' ? setContainerAStyle : setContainerBStyle;
  const setToImage   = to  === 'A' ? setContainerAStyle : setContainerBStyle;
  // ...
}
```

---

### 7.3 🟡 `BuyingProcessCarousel` Reimplements Touch/Swipe from Scratch

**File:** [`buying-process-carousel.tsx`](apps/web/src/components/features/landing/buying-process/buying-process-carousel.tsx)

Custom `touchstart`/`touchmove`/`touchend` listeners + manual `translateX` math + `containerRef.offsetWidth` polling — while `embla-carousel-react` (already a project dependency) handles all of this in a few lines.

```tsx
// Current: 80+ lines of custom touch logic

// Fix: use Embla which is already installed
import useEmblaCarousel from 'embla-carousel-react';
const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
```

---

### 7.4 🟡 `will-change-transform` Overused in Customer Journey Carousel

**File:** [`customer-journey-carousel.tsx`](apps/web/src/components/features/landing/customer-journey-carousel/customer-journey-carousel.tsx)

`will-change-transform` is applied to the outer containers, image containers, text containers, AND all three stagger child elements simultaneously — that's up to 7 GPU layers promoted at once. This can actually hurt performance on low-end devices.

**Fix:** Apply `will-change` only to the element actively undergoing a CSS transition, and remove it after the transition ends.

---

### 7.5 🔵 `CustomerJourneyCarousel` Could Use Framer Motion

The entire A/B double-buffer animation system with `setTimeout` chains, `requestAnimationFrame` double-taps, and manual opacity/transform state management is complex custom code. Framer Motion (`AnimatePresence` + `motion.div`) is already a dependency and handles all this:

```tsx
// The entire animation system could be replaced with:
<AnimatePresence mode="wait">
  <motion.div
    key={currentIndex}
    initial={{ opacity: 0, x: 60 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -60 }}
    transition={{ duration: 0.6 }}
  >
    <SlideContent slide={currentSlide} />
  </motion.div>
</AnimatePresence>
```

---

## 8. CSS & Tailwind Standards

### 8.1 🟡 Import Alias Inconsistency — `@/` vs `~/`

**File:** [`header.tsx:7`](apps/web/src/components/layout/header.tsx#L7)

```tsx
// Uses @/ alias — every other file in the project uses ~/
import { cn } from "@/lib/utils";

// Fix — match the rest of the codebase
import { cn } from "~/lib/utils";
```

---

### 8.2 🟡 Hardcoded `bg-red-500` vs Design Token Inconsistency

**File:** [`home-hero-search.tsx:117`](apps/web/src/components/features/landing/home-hero/home-hero-search.tsx#L117) and [`home-hero-search-wrapper.tsx:117`](apps/web/src/components/features/landing/home-hero/home-hero-search-wrapper.tsx#L117)

The same Search button uses `bg-red-500 hover:bg-red-600` (raw Tailwind color) in one place and `bg-[var(--color-actions-primary)]` (design token) in another. Within the same file, the desktop button uses raw red while the mobile button uses the token.

**Fix:** Always use `bg-[var(--color-actions-primary)]` — never `bg-red-500` directly.

---

### 8.3 🟡 Inline `style` Prop with Pixel Values Instead of Tailwind in `footer.tsx`

**File:** [`footer.tsx:17–19`](apps/web/src/components/layout/footer.tsx#L17)

```tsx
// Current — inline styles with raw pixel values
style={{ paddingTop: "48px", paddingBottom: "48px" }}
// ...also gap="32px", gap="40px"

// Fix — use Tailwind utilities
className="pt-12 pb-12"   // 48px = 3rem = Tailwind py-12
```

---

### 8.4 🟢 Verify `w-131` Is Defined in Theme Scale

**File:** [`home-hero-search-wrapper.tsx:55`](apps/web/src/components/features/landing/home-hero/home-hero-search-wrapper.tsx#L55)

```tsx
className={cn("relative w-full lg:w-131", ...)}
```

Standard Tailwind only goes to `w-96`. `w-131` must be a custom extension in `tailwind.config.js`. The config file is empty (`tailwind.config.js` is 1 line). If not defined in the UI theme package, this class is silently ignored.

**Fix:** Use explicit arbitrary value: `lg:w-[32.75rem]`.

---

### 8.5 🟢 `HomeHeroTitle` Has Redundant `lg:` Classes That Mirror `md:`

**File:** [`home-hero-title.tsx:10`](apps/web/src/components/features/landing/home-hero/home-hero-title.tsx#L10)

```tsx
// md: and lg: set the same values — the lg: classes are redundant
md:text-left md:text-[length:var(--font-size-4xl)] lg:text-left lg:text-[length:var(--font-size-4xl)]

// Fix — remove the lg: duplicates (they inherit from md:)
md:text-left md:text-[length:var(--font-size-4xl)]
```

---

### 8.6 🔵 Magic Pixel Heights in Known-User Cards

**File:** [`home-hero-known-user-content.tsx`](apps/web/src/components/features/landing/home-hero/home-hero-known-user-content.tsx)

`h-[160px]`, `h-[190px]`, `h-[220px]`, `h-[72px]`, `pb-[5px]` are all magic numbers. These should map to spacing tokens:

```tsx
// Replace magic heights with semantic tokens or Tailwind scale
h-[160px] → h-40   // 160px = 10rem = Tailwind h-40
h-[190px] → no standard; consider h-[var(--card-height-sm)]
h-[220px] → no standard; consider h-[var(--card-height-md)]
```

At minimum, extract them as named constants at the top of the file.

---

### 8.7 🟢 Duplicate JSDoc on `saveManualZipToCookie`

**File:** [`location-provider.tsx:34–37`](apps/web/src/components/providers/location-provider.tsx#L34)

The JSDoc comment `/** Save manual zip to cookie (expires in 30 days) */` is pasted twice consecutively. Remove one.

---

### 8.8 🟢 Unnecessary `document` Type Cast

**File:** [`location-provider.tsx:45,56`](apps/web/src/components/providers/location-provider.tsx#L45)

```tsx
// Unnecessary — document.cookie is already string in lib.dom.d.ts
(document as { cookie: string }).cookie = cookieValue;

// Fix
document.cookie = cookieValue;
```

---

## 9. Accessibility

### 9.1 🟡 `<Image>` Used as Interactive Button (Mic Button)

**File:** [`home-hero-search-wrapper.tsx:107–116`](apps/web/src/components/features/landing/home-hero/home-hero-search-wrapper.tsx#L107)

```tsx
// BAD — <img role="button"> is not keyboard-accessible (no Enter/Space handler)
<Image
  role="button"
  tabIndex={0}
  onClick={() => setShowMicModal(true)}
  alt="Microphone"
/>

// FIX — wrap in a <button>
<button type="button" onClick={() => setShowMicModal(true)} aria-label="Voice search">
  <Image alt="" aria-hidden="true" src="/images/search_mic.svg" ... />
</button>
```

---

### 9.2 🟡 `<section>` for Decorative Background Element

**File:** [`home-hero-static.tsx:40`](apps/web/src/components/features/landing/home-hero/home-hero-static.tsx#L40)

```tsx
// BAD — a background image container is not a semantic landmark
<section aria-label="Hero background" className={bgClass}>

// FIX — use a non-semantic, hidden div
<div aria-hidden="true" role="presentation" className={bgClass}>
```

---

### 9.3 🟢 `<Image>` Missing `aria-hidden` When Decorative

Throughout `home-hero-stats.tsx` and `inspection-feature-card.tsx`, images that carry descriptive `alt` text are fine. But icon images inside buttons/links that already have text labels should use `alt=""` + `aria-hidden="true"` to avoid screen reader redundancy.

---

## 10. Data Layer

### 10.1 🟡 `landing-data.json` Imported 8× Independently in One File

**File:** [`lib/data/index.ts`](apps/web/src/lib/data/index.ts)

Each of the 8 exported functions individually dynamic-imports the same JSON file. While module caching prevents redundant I/O, this is verbose and unclear.

```tsx
// Current — repeated in every function
export async function getHeroData() {
  const data = await import("~/data/landing-data.json");
  return data.default.hero;
}
export async function getVehicleTypes() {
  const data = await import("~/data/landing-data.json"); // again
  return data.default.vehicleTypes;
}

// Fix — import once at module level
import landingData from "~/data/landing-data.json";
export async function getHeroData() { return landingData.hero; }
export async function getVehicleTypes() { return landingData.vehicleTypes; }
```

---

### 10.2 🟡 Multiple `lib/data/index.ts` Functions Appear Unused

`getHeroData`, `getVehiclesAvailable`, `getVehicleTypes`, `getHowToBuy`, `getFindVehicle`, `getPrequalify`, `getArrowInspected` all read from `landing-data.json` but the landing page components source their data directly from their own local files (e.g., `inspectionFeatures` from `data/inspection/features.ts`).

**Action:** Audit which of these functions are actually called. Remove the unused ones.

---

### 10.3 🟢 `nav.tsx` Header Links Are Hardcoded Twice (Desktop + Mobile)

**File:** [`header.tsx:186–207, 328–355`](apps/web/src/components/layout/header.tsx#L186)

```tsx
// "Buy", "Finance", "Why Arrow" defined in both desktop nav and mobile menu
// Fix — extract to a constant
const NAV_LINKS = [
  { label: "Buy", href: "/buy" },
  { label: "Finance", href: "/finance" },
  { label: "Why Arrow", href: "/why-arrow" },
] as const;
```

---

## 11. `my-garageclient.tsx` — Repeated CarCard Rendering Logic

**File:** [`my-garageclient.tsx`](apps/web/src/components/layout/my-garage/my-garageclient.tsx)

The badge resolution logic (lines 124–131, 180–187, and the third grid) is copy-pasted three times:

```tsx
// Repeated 3× — should be extracted
let badgeType: "excellent" | "priceDrop" | "available" | undefined;
if (firstLabel === "Excellent Price") { badgeType = "excellent"; }
else if (firstLabel === "Price Drop") { badgeType = "priceDrop"; }
else if (firstLabel) { badgeType = "available"; }
```

Similarly, `CarCard` receives hardcoded `exteriorColor="White"`, `exteriorColorSolid="#FFFFFF"`, `interiorColor="Black"`, `interiorColorHex="#000000"` — these should come from the vehicle data, not be hardcoded.

---

## 12. Next.js Config

**File:** [`next.config.ts`](apps/web/next.config.ts)

- `cacheComponents: true` — this is **not a documented Next.js config option**. It may be silently ignored. Verify it is intentional.
- `optimizePackageImports` only lists `lucide-react`. Consider adding `framer-motion` and `@tfs-ucmp/ui` which are heavy imports.
- `remotePatterns: []` is set but no remote image hosts are allowed — verify all `<Image>` `src` props are local paths only.

---

## 13. `FooterBottom` — `section` Prop Anti-Pattern

**File:** [`footer-bottom.tsx`](apps/web/src/components/layout/footer/footer-bottom.tsx)

```tsx
// Anti-pattern — one component with a discriminating "section" prop
// that renders two completely different UIs
export function FooterBottom({ section }: { section: "contact" | "copyright" }) {
  if (section === "contact") { return <>...</>; }
  return <div>...</div>; // copyright
}
```

This violates the Single Responsibility Principle. Split into two clearly named components:
- `FooterContact`
- `FooterCopyright`

---

## Priority Action Plan

### 🔴 Fix Now (P1 — Bugs / Broken)

| # | Issue | File |
|---|-------|------|
| 1 | `bg--white/70` CSS typo | `vehicle-quick-link-card.tsx:33` |
| 2 | Missing `]` in CSS class | `home-hero-known-user-content.tsx:274` |
| 3 | `transition-height` invalid Tailwind class | `home-hero-search-wrapper.tsx:48` |
| 4 | `isLoading` always `false` in CartProvider | `cart-provider.tsx:37–74` |
| 5 | Delete `home-hero-search.tsx` (dead duplicate) | `home-hero/home-hero-search.tsx` |
| 6 | Delete `home-hero-carousel.tsx` (dead code) | `home-hero/home-hero-carousel.tsx` |
| 7 | Consolidate `data/inspection/features.ts` → single file | 2 identical files |
| 8 | Consolidate `data/vehicles/vehicle-types.ts` → single file | 2 diverged files |

### 🟡 Next Sprint (P2 — Standards / Quality)

| # | Issue | File |
|---|-------|------|
| 9 | `FavoritesProvider` → React 19 `use()` + `<Context value>` | `favorites-provider.tsx` |
| 10 | IIFE in JSX → named component | `home-hero-known-user-content.tsx` |
| 11 | `AnimatedSection` → `once: true` | `animated-section.tsx` |
| 12 | `@/` → `~/` import alias | `header.tsx:7` |
| 13 | `performTransitionToA/B` → single `performTransition()` | `customer-journey-carousel.tsx` |
| 14 | `BuyingProcessCarousel` → replace with Embla | `buying-process-carousel.tsx` |
| 15 | Fix mic Image button accessibility | `home-hero-search-wrapper.tsx:107` |
| 16 | Fix `<section>` → `<div aria-hidden>` for background | `home-hero-static.tsx:40` |
| 17 | Rename `my-garageclient.tsx` / `my-garagewrapper.tsx` | `layout/my-garage/` |
| 18 | Delete `SearchBar` scaffold + `ProductCard` scaffold | `search-bar/`, `product-card/` |
| 19 | `formatPrice` → import from `lib/formatters.ts` | `home-hero-known-user-content.tsx` |
| 20 | Move footer/header flat files into their directories | `layout/footer.tsx`, `header.tsx` |
| 21 | `will-change-transform` — reduce to active element only | `customer-journey-carousel.tsx` |
| 22 | `bg-red-500` → `bg-[var(--color-actions-primary)]` | `home-hero-search-wrapper.tsx` |
| 23 | `FooterBottom` → split into `FooterContact` + `FooterCopyright` | `footer-bottom.tsx` |
| 24 | Deduplicate CarCard badge logic in `my-garageclient.tsx` | `my-garageclient.tsx` |

### 🟢 Backlog (P3 — Consistency)

| # | Issue | File |
|---|-------|------|
| 25 | `VehicleFinderOption` / `VehicleFinderOptionStatic` → one type | `vehicle-quick-links/data.ts` |
| 26 | `PromotionFlags` → move to `lib/types/` | `customer-journey-carousel.tsx` |
| 27 | `SavedVehicle` → align with `VehicleDetail` | `home-hero-known-user-content.tsx` |
| 28 | `NAV_LINKS` constant for desktop + mobile nav | `header.tsx` |
| 29 | `landing-data.json` — import once, remove unused functions | `lib/data/index.ts` |
| 30 | `parseDealerInfo` → move to `lib/formatters.ts` | `my-garageclient.tsx` |
| 31 | Verify `w-131` in theme scale or use arbitrary value | `home-hero-search-wrapper.tsx` |
| 32 | Remove redundant `lg:` classes in `HomeHeroTitle` | `home-hero-title.tsx` |
| 33 | `document.cookie` unnecessary type cast | `location-provider.tsx` |
| 34 | Remove duplicate JSDoc in `location-provider.tsx` | `location-provider.tsx` |
| 35 | `await Promise.resolve(value)` → `return value` | `lib/data/index.ts` |
| 36 | `cacheComponents: true` — verify this is a real Next.js config key | `next.config.ts` |
| 37 | VehicleTypeSelector to use canonical `~/lib/data/vehicles/vehicle-types` | `vehicle-type-selector.tsx` |
| 38 | `AnimatedSection` delay `0.1` repeated 5× in `page.tsx` — consider progressive delay | `page.tsx` |
