# VDP (Vehicle Detail Page) — Implementation Flow & Architecture

> **Purpose:** Technical reference for Vercel code review. Documents the Next.js 16 patterns,
> caching strategy, data fetching, prefetching, streaming, and server/client component boundaries.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Routing & URL Structure](#2-routing--url-structure)
3. [Page Entry Point & Suspense Streaming](#3-page-entry-point--suspense-streaming)
4. [Data Fetching — Dual-Path Architecture](#4-data-fetching--dual-path-architecture)
5. [Caching Strategy (`"use cache"` + `cacheLife` + `cacheTag`)](#5-caching-strategy-use-cache--cachelife--cachetag)
6. [On-Demand Revalidation](#6-on-demand-revalidation)
7. [Prefetching & Cache Warming](#7-prefetching--cache-warming)
8. [Server/Client Component Boundaries](#8-serverclient-component-boundaries)
9. [Arrow Server Client (HTTP Layer)](#9-arrow-server-client-http-layer)
10. [Type Definitions](#10-type-definitions)
11. [Mock Data System](#11-mock-data-system)
12. [Complete Request Lifecycle](#12-complete-request-lifecycle)
13. [File Reference](#13-file-reference)
14. [Questions for Vercel Review](#14-questions-for-vercel-review)

---

## 1. Architecture Overview

The VDP uses a **two-call parallel architecture** to render a complete vehicle detail page:

```
                        ┌─────────────────────────────────┐
                        │   page.tsx (Server Component)     │
                        │                                   │
                        │  getVehicleBundleCached(vin)      │
                        │  → Promise NOT awaited            │
                        │  → Passed to child in <Suspense>  │
                        └──────────┬────────────────────────┘
                                   │
                     ┌─────────────▼─────────────┐
                     │  "use cache"               │
                     │  cacheLife("vdp")           │
                     │  cacheTag("vdp", "bundle-") │
                     │                             │
                     │  Promise.all (parallel)      │
                     │  ┌──────────┬──────────┐    │
                     │  │          │          │    │
                     │  ▼          ▼          │    │
                     │ fetchVin  fetchDealer  │    │
                     │ DataCached ByVinCached │    │
                     │ "use cache" "use cache"│    │
                     └──────────────────────────┘
                          │          │
                          ▼          ▼
                    Backend API  Backend API
                    /vdp/vehicles /vdp/dealers
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **No waterfall** | Product data and dealer data fetch in parallel via `Promise.all` |
| **Single VIN data call** | All product data (vehicle, specs, features, pricing, history, rating, status) from one `VinData` API call |
| **Shared cache** | `"use cache"` with VIN-only keys — no per-user headers, shared across all users |
| **Separate uncached path** | API routes for client-side consumers forward per-user tracking headers |
| **Promise passing** | Promise started in `page.tsx`, awaited in child — enables streaming via `<Suspense>` |

---

## 2. Routing & URL Structure

### Catch-All Route

```
apps/web/src/app/used-cars/[[...params]]/
```

The `[[...params]]` optional catch-all serves **two page types**:

| Page Type | URL Pattern | Example |
|-----------|-------------|---------|
| **SRP** | `/used-cars`, `/used-cars/[make]/[model]` | `/used-cars/toyota/camry` |
| **VDP** | `/used-cars/details/[make]/[model]/[trim]/[year]/[vin]` | `/used-cars/details/toyota/camry/xse/2024/5TDFZRBH5RS100015` |

### Route Parsing

**File:** `config/routes/used-cars.ts`

```typescript
type UsedCarsRoute =
  | { type: "srp"; filters: SrpUrlFilters }
  | { type: "details"; make: string; model: string; trim: string; year: number; vin: string }
```

### VIN Validation

**File:** `config/routes/vehicle-segments.ts`

| Field | Rule |
|-------|------|
| VIN | 17 chars, `/^[A-HJ-NPR-Z0-9]{17}$/` (excludes I, O, Q) |
| Year | 4 digits, 1900 to current year + 2 |
| Make/Model/Trim | Lowercase alphanumeric slugs with hyphens |
| Trim placeholder | `"-"` when trim unavailable |

Invalid segments → `notFound()` → 404 page.

---

## 3. Page Entry Point & Suspense Streaming

**File:** `apps/web/src/app/used-cars/[[...params]]/page.tsx`

```typescript
export default async function UsedCarsPage({ params, searchParams }: Props) {
  // Unwrap both promises in parallel (Next.js 16 pattern)
  const [{ params: segments }, { q: initialSearchQuery }] = await Promise.all([
    params,
    searchParams,
  ]);
  const route = resolveRoute(segments);

  // Canonical URL enforcement
  const canonicalPath = buildUsedCarsPath(route);
  if (currentPath !== canonicalPath) {
    redirect(canonicalPath);
  }

  // ── VDP Path ──
  if (route.type === "details") {
    // Start the promise WITHOUT awaiting — enables streaming
    const vehicleBundlePromise = getVehicleBundleCached(route.vin);

    return (
      <Suspense fallback={<VdpSkeleton />}>
        <UsedCarsDetails
          vehicleBundlePromise={vehicleBundlePromise}
          make={route.make}
          model={route.model}
          trim={route.trim}
          vin={route.vin}
          year={route.year}
        />
      </Suspense>
    );
  }
}
```

### Streaming Pattern: Promise Passing + Suspense ("Donut Pattern")

```
Timeline:
  t=0ms    page.tsx creates promise, renders <Suspense>
  t=0ms    <VdpSkeleton /> streams to browser (instant shell)
  t=~200ms Backend responds, promise resolves
  t=~200ms <UsedCarsDetails> renders, streams to browser
  t=~200ms Page fully visible (no loading spinner)
```

1. `page.tsx` starts `getVehicleBundleCached(vin)` — creates the promise, does **not** await it.
2. The promise is passed as a prop to `<UsedCarsDetails>`.
3. `<VdpSkeleton />` renders immediately as the Suspense fallback.
4. When the promise resolves, `UsedCarsDetails` renders and streams to the client.

### Details Component

**File:** `apps/web/src/app/used-cars/[[...params]]/views/details.tsx`

```typescript
export async function UsedCarsDetails({ vehicleBundlePromise, ... }: Props) {
  // Await the promise here (inside Suspense boundary)
  const { vinData, dealerInfo } = await vehicleBundlePromise;

  const {
    vehicle: vehicleInfo, pricing, priceHistory, history,
    specs, features, featuresInitialCount, rating, vehicleStatus,
  } = vinData;

  return (
    <div>
      <VehiclePDP
        vehicle={vehicleInfo}
        dealerInfo={dealerInfo}
        promotionSlot={
          <Suspense fallback={<PromotionCardsSkeleton />}>
            <AuthAwarePromotions variant="prequal" />
          </Suspense>
        }
        testDriveSlot={
          <Suspense fallback={<TestDriveCardSkeleton />}>
            <AuthAwarePromotions variant="test-drive" />
          </Suspense>
        }
      />
      <VehicleDetailsTabs ... />
      <VehicleRating ... />
      <DealerNotesSection ... />
      <DealerInfoCard ... />
    </div>
  );
}
```

### Metadata Generation

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Generates: "2024 Toyota Camry XSE — VIN 5TDFZRBH5RS100015"
  return { title, description, openGraph: { title, type: "website" } };
}
```

---

## 4. Data Fetching — Dual-Path Architecture

Two data-fetching paths serve different consumers:

### Path A: Server Components (Cached, Direct Backend Call)

```
Server Component → fetchVinDataCached(vin) → Arrow Server Client → Backend API
                   "use cache"
                   VIN-only cache key
                   No per-user headers
```

**File:** `features/vdp/services/vdp.service.ts`

```typescript
export async function fetchVinDataCached(vin: string): Promise<VinData> {
  "use cache";
  cacheLife("vdp");
  cacheTag("vdp", `vin-${vin}`);

  if (isMockMode()) return await fetchMockVinData(vin);

  try {
    return await getVdpClient().get<VinData>(`/vdp/vehicles/${vin}`);
  } catch (error) {
    console.error("[VDPService] Upstream error:", error.message);
    return await fetchMockVinData(vin);
  }
}
```

### Path B: Client Components via API Route (Uncached, Per-User Headers)

```
Browser → fetch(/api/search/vehicle/[id]) → API Route → fetchVinData(vin, { ids, headers }) → Backend
                                              ↑ Extracts Arrow tracking IDs
                                              ↑ Forwards per-user headers
```

**File:** `features/vdp/services/vdp.service.ts`

```typescript
export async function fetchVinData(vin: string, options: VdpFetchOptions = {}): Promise<VinData> {
  // No "use cache" — each request hits the backend
  if (isMockMode()) return await fetchMockVinData(vin);

  try {
    return await getVdpClient().get<VinData>(`/vdp/vehicles/${vin}`, {
      ids: options.ids,              // Arrow session/fingerprint/profile
      headers: options.forwardHeaders, // user-agent, referer, etc.
    });
  } catch (error) {
    return await fetchMockVinData(vin);
  }
}
```

**API Route Handler:** `app/api/search/vehicle/[id]/route.ts`

```typescript
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const ids = extractArrowIds(request);
  const forwardHeaders = extractForwardHeaders(request);

  const vinData = await fetchVinData(id, { ids, forwardHeaders });
  return NextResponse.json({ data: { vinData } });
}
```

### Why Two Paths?

| Concern | Server Component Path | API Route Path |
|---------|----------------------|----------------|
| **Cache** | Shared via `"use cache"` | No cache (per-user) |
| **Auth** | API key only (Bearer token) | API key + per-user tracking |
| **Performance** | Direct backend call | Browser → API route → backend |
| **Use case** | Initial page load (SSR/streaming) | Client-side navigation, SPA-style |
| **Personalization** | None (shared cache) | Per-user tracking context |

---

## 5. Caching Strategy (`"use cache"` + `cacheLife` + `cacheTag`)

### Cache Configuration

**File:** `apps/web/next.config.ts`

```typescript
const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    landing: { stale: 900, revalidate: 900, expire: 3600 },
    profile: { stale: 300, revalidate: 600, expire: 3600 },
    vdp:     { stale: 300, revalidate: 300, expire: 3600 },
    srp:     { stale: 300, revalidate: 300, expire: 3600 },
  },
};
```

### VDP Cache Profile

| Parameter | Value | Behavior |
|-----------|-------|----------|
| `stale` | 300s (5 min) | Serve stale content immediately, revalidate in background |
| `revalidate` | 300s (5 min) | Time-based revalidation interval |
| `expire` | 3600s (1 hr) | Hard expiry — cache entry evicted |

### Cache Tag Hierarchy

```
getVehicleBundleCached(vin)        "use cache"
  Tags: "vdp", "bundle-{vin}"
  ├── fetchVinDataCached(vin)      "use cache"
  │     Tags: "vdp", "vin-{vin}"
  └── fetchDealerByVinCached(vin)  "use cache"
        Tags: "vdp", "dealer-vin-{vin}"
```

| Tag Pattern | Scope | Invalidation Effect |
|-------------|-------|---------------------|
| `"vdp"` | All VDP caches | Invalidates everything |
| `"vin-{VIN}"` | Single VIN's product data | Invalidates only that VIN |
| `"bundle-{VIN}"` | Single VIN's complete bundle | Invalidates vehicle + dealer |
| `"dealer-vin-{VIN}"` | Dealer by VIN | Invalidates dealer for that VIN |
| `"dealer-{dealerId}"` | Dealer by ID | Invalidates across all VINs |

### Layered Caching

`"use cache"` is applied at **multiple levels**:

```
getVehicleBundleCached     ← "use cache" (L1)
  ├── fetchVinDataCached    ← "use cache" (L2)
  └── fetchDealerByVinCached← "use cache" (L2)
```

Each layer caches independently. If `fetchVinDataCached` is called from a different composition, it still serves from its own cache.

---

## 6. On-Demand Revalidation

**File:** `apps/web/src/app/api/revalidate/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const { tag, secret } = await request.json();

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(tag, "max");
  return Response.json({ revalidated: true, tag, now: Date.now() });
}
```

### Usage

```bash
# Revalidate a single VIN
POST /api/revalidate { "tag": "vin-5TDFZRBH5RS100015", "secret": "..." }

# Revalidate ALL VDP caches
POST /api/revalidate { "tag": "vdp", "secret": "..." }

# Revalidate a specific dealer
POST /api/revalidate { "tag": "dealer-toyota-fort-worth", "secret": "..." }
```

`revalidateTag(tag, "max")` — the `"max"` option forces immediate invalidation, bypassing any stale window.

---

## 7. Prefetching & Cache Warming

### Car Card Hover Prefetch (SRP → VDP)

**File:** `features/vehicle-card/components/car-card.tsx`

```typescript
const handlePrefetch = useCallback(() => {
  if (vdpUrl !== "#") {
    router.prefetch(vdpUrl);
  }
}, [router, vdpUrl]);

// Triggered on:
// - onMouseEnter (hover)
// - onFocus (keyboard navigation)
```

### Vehicle Preview Modal Prefetch

**File:** `features/vehicle-preview/components/vehicle-preview-modal.tsx`

```typescript
// Prefetch VDP route when modal opens — warms both the router cache
// (RSC payload) and the data cache (via "use cache" service functions).
useEffect(() => {
  if (isOpen && vdpUrl) {
    router.prefetch(vdpUrl);
  }
}, [isOpen, vdpUrl, router]);
```

### How Prefetch Warms the Cache

```
User hovers car card in SRP
  ↓
router.prefetch("/used-cars/details/toyota/camry/xse/2024/VIN123")
  ↓
Next.js fetches RSC payload from server
  ↓
Server runs page.tsx → getVehicleBundleCached("VIN123")
  ↓
Promise.all([fetchVinDataCached, fetchDealerByVinCached])
  ↓
Results cached via "use cache" + cacheLife("vdp")
  ↓
User clicks car card → navigation is nearly instant
  ↓
RSC payload + data both served from cache
```

---

## 8. Server/Client Component Boundaries

### Component Tree

```
page.tsx (Server)
├── <Suspense fallback={<VdpSkeleton />}>
│   └── UsedCarsDetails (Server, async)
│       ├── VehiclePDP (Client) ← MAIN CLIENT ISLAND
│       │   ├── ImageCarousel (Client)
│       │   ├── VehicleStickyBanner (Client)
│       │   ├── promotionSlot → <Suspense>
│       │   │   └── AuthAwarePromotions (Server) → VdpPromotionCards (Client)
│       │   └── testDriveSlot → <Suspense>
│       │       └── AuthAwarePromotions (Server) → VdpPromotionCards (Client)
│       ├── VehicleDetailsTabs (Server → Client delegate)
│       │   └── VehicleDetailsTabsClient (Client)
│       │       ├── OverviewTab
│       │       ├── FeaturesTab (Client — expand/collapse)
│       │       ├── PricingTab (Client — dynamic import, animations)
│       │       └── HistoryTab
│       ├── VehicleRating (Server)
│       ├── DealerNotesSection (Server)
│       └── DealerInfoCard (Server)
```

### Boundary Rationale

| Component | Server/Client | Why |
|-----------|---------------|-----|
| `UsedCarsDetails` | **Server** | Async data fetching, no interactivity |
| `VehiclePDP` | **Client** | Image carousel, scroll tracking, modals, useState |
| `VehicleDetailsTabs` | Server → Client | Builds tab config server-side, delegates to client for state |
| `FeaturesTab` | **Client** | Expand/collapse toggle state |
| `PricingTab` | **Client** | Framer Motion animations, dynamic import |
| `VehicleRating` | **Server** | Pure presentation, no interactivity |
| `DealerNotesSection` | **Server** | Pure presentation |
| `DealerInfoCard` | **Server** | Pure presentation |
| `AuthAwarePromotions` | **Server** | Reads `cookies()` for session check |
| `VdpPromotionCards` | **Client** | Reads visitor context via `useArrow()` |

### Slot Pattern for Promotion Cards

Promotion cards are passed as React slots through the server → client boundary:

```typescript
// details.tsx (Server)
<VehiclePDP
  promotionSlot={
    <Suspense fallback={<PromotionCardsSkeleton />}>
      <AuthAwarePromotions variant="prequal" />  // Server — reads cookies
    </Suspense>
  }
  vehicle={vehicleInfo}
/>
```

This allows `AuthAwarePromotions` (server component that reads cookies) to render inside `VehiclePDP` (client component) via the children/slot pattern. Each slot has its own `<Suspense>` boundary for independent streaming.

---

## 9. Arrow Server Client (HTTP Layer)

**File:** `features/tracking/lib/server-api.ts`

### Client Factory

```typescript
const client = createArrowServerClient({
  baseUrl: process.env.VDP_SERVICE_URL,
  authToken: process.env.VDP_API_KEY,   // → Authorization: Bearer <token>
  serviceName: "VDPService",
  timeout: 10_000,                       // 10s timeout
  retries: 1,                            // 1 retry on failure
});
```

### Features

| Feature | Implementation |
|---------|---------------|
| **Bearer auth** | `Authorization: Bearer <VDP_API_KEY>` on every request |
| **Tracking headers** | `X-Arrow-Session-Id`, `X-Arrow-Fp-Id`, `X-Arrow-Profile-Id` (opt-in) |
| **Timeout** | `AbortController`-based (default 15s, VDP uses 10s) |
| **Retries** | Exponential backoff (`500ms * 2^attempt`), only on 500+ or network errors |
| **Error parsing** | `ArrowServerError` with status, code, service, body |
| **Singleton** | Created once per service, module-level variable |

### Header Forwarding (API Route Path Only)

```typescript
extractArrowIds(request)
  → { sessionId, fingerprintId, profileId, eventId }

extractForwardHeaders(request)
  → { user-agent, accept-language, referer, x-forwarded-for, ... }
```

---

## 10. Type Definitions

**File:** `features/vdp/data/types.ts`

### VinData (Complete Product Data — Single API Call)

```typescript
interface VinData {
  dealerNotes: string;
  features: FeatureCategory[];
  featuresInitialCount: number;
  history: HistoryData;
  priceHistory: PriceHistoryEntry[];
  pricing: PricingData;
  rating: RatingData;
  specs: VehicleSpecData[];
  vehicle: VehicleDetail;
  vehicleStatus: VehicleStatusData;
}
```

### VehicleBundle (Page-Level Composite)

```typescript
interface VehicleBundle {
  vinData: VinData;
  dealerInfo: DealerInfo;
}
```

---

## 11. Mock Data System

**File:** `features/vdp/services/vdp.mocks.ts`

### Mock Mode Detection

```typescript
function isMockMode(): boolean {
  return !process.env.VDP_SERVICE_URL || process.env.USE_MOCK_VDP === "true";
}
```

### Fallback Behavior

All service functions fall back to mock data on backend error:

```typescript
try {
  return await getVdpClient().get<VinData>(`/vdp/vehicles/${vin}`);
} catch (error) {
  console.error("[VDPService] Upstream error:", error.message);
  return await fetchMockVinData(vin);  // Graceful degradation
}
```

**Note:** Mock data gets cached for 5 minutes via `"use cache"`. If the backend is down, the mock fallback is served to all users for the stale duration.

---

## 12. Complete Request Lifecycle

### First Visit (Cold Cache)

```
t=0ms    Browser requests /used-cars/details/toyota/camry/xse/2024/VIN123
t=0ms    Next.js runs page.tsx server-side
t=0ms    getVehicleBundleCached(VIN123) starts
         → Cache MISS → calls backend
t=0ms    <VdpSkeleton /> streams to browser (user sees loading state)
t=~200ms Backend responds
         → fetchVinDataCached: VinData cached (tag: "vdp", "vin-VIN123")
         → fetchDealerByVinCached: DealerInfo cached (tag: "vdp", "dealer-vin-VIN123")
         → getVehicleBundleCached: Bundle cached (tag: "vdp", "bundle-VIN123")
t=~200ms <UsedCarsDetails> renders and streams to browser
t=~200ms Full page visible, client hydration begins
```

### Subsequent Visit (Warm Cache, within 5min stale window)

```
t=0ms    Browser requests same VDP URL
t=0ms    getVehicleBundleCached(VIN123) → Cache HIT
t=0ms    <UsedCarsDetails> renders immediately (no backend call)
t=~50ms  Full page visible (near-instant)
```

### Prefetch Flow (SRP → VDP)

```
t=0ms    User hovers car card in SRP
t=0ms    router.prefetch("/used-cars/details/.../VIN123")
t=~100ms Next.js fetches RSC payload from server
         → Triggers getVehicleBundleCached(VIN123)
         → Backend called, result cached
t=~300ms Prefetch complete (user still on SRP)

... user clicks card ...

t=0ms    router.push() → instant navigation
         → RSC payload served from router cache
         → Data served from "use cache"
         → No loading state visible
```

### Revalidation Flow

```
Backend sends webhook: price changed for VIN123
  ↓
POST /api/revalidate { "tag": "vin-VIN123", "secret": "..." }
  ↓
revalidateTag("vin-VIN123", "max")
  → Invalidates fetchVinDataCached cache for VIN123
  ↓
Next request for VIN123 → Cache MISS → fresh backend call
  → New data cached for next 5 minutes
```

---

## 13. File Reference

### Page Files
| File | Purpose |
|------|---------|
| `app/used-cars/[[...params]]/page.tsx` | Route entry — Suspense + promise creation |
| `app/used-cars/[[...params]]/views/details.tsx` | Async server component — data unwrapping |
| `app/used-cars/[[...params]]/loading.tsx` | VDP skeleton |
| `app/used-cars/error.tsx` | Error boundary (client) |
| `app/used-cars/not-found.tsx` | 404 page |

### Service Layer
| File | Purpose |
|------|---------|
| `features/vdp/services/vdp.service.ts` | VIN data: cached + uncached variants |
| `features/vdp/services/dealer.service.ts` | Dealer data: cached + uncached, by ID or VIN |
| `features/vdp/services/vdp-cached.ts` | Bundle assembly — `Promise.all` composition |
| `features/vdp/services/vdp-api.ts` | Client-side API functions (browser → API route) |
| `features/vdp/services/vdp.mocks.ts` | Mock data generation and fallback |
| `features/tracking/lib/server-api.ts` | Arrow HTTP client (auth, retries, timeout) |

### API Routes
| File | Route | Purpose |
|------|-------|---------|
| `app/api/search/vehicle/[id]/route.ts` | `GET /api/search/vehicle/:vin` | Client-side VIN data |
| `app/api/search/dealer/[vin]/route.ts` | `GET /api/search/dealer/:vin` | Client-side dealer data |
| `app/api/revalidate/route.ts` | `POST /api/revalidate` | On-demand cache invalidation |

### Components
| File | Server/Client | Purpose |
|------|---------------|---------|
| `features/vdp/components/vehicle-pdp.tsx` | Client | Main island — carousel, scroll, modals |
| `features/vdp/components/vehicle-details-tabs.tsx` | Server→Client | Tab config builder + state |
| `features/vdp/components/features-tab.tsx` | Client | Expand/collapse |
| `features/vdp/components/pricing-tab.tsx` | Client | Animations (dynamic import) |
| `features/vdp/components/vehicle-rating.tsx` | Server | Pure presentation |
| `features/vdp/components/dealer-notes-section.tsx` | Server | Pure presentation |
| `features/vdp/components/dealer-info-card.tsx` | Server | Pure presentation |
| `features/vdp/components/auth-aware-promotions.tsx` | Server | Session check via cookies() |
| `features/vdp/components/vdp-skeleton.tsx` | Server | Loading skeleton |

### Prefetching
| File | Trigger | Purpose |
|------|---------|---------|
| `features/vehicle-card/components/car-card.tsx` | Mouse hover / focus | Warms RSC payload + data cache |
| `features/vehicle-preview/components/vehicle-preview-modal.tsx` | Modal open | Warms VDP before "Full Details" click |

### Configuration
| File | Purpose |
|------|---------|
| `apps/web/next.config.ts` | `cacheLife` profiles, `cacheComponents: true` |
| `config/routes/used-cars.ts` | Route parsing, URL building |
| `config/routes/vehicle-segments.ts` | VIN/year/slug validation |

---

## 14. Questions for Vercel Review

1. **Layered `"use cache"`:** We apply `"use cache"` at both the bundle level (`getVehicleBundleCached`) and individual function level (`fetchVinDataCached`, `fetchDealerByVinCached`). Is this correct, or does the inner `"use cache"` become redundant when wrapped by an outer `"use cache"`?

2. **`cacheTag` granularity:** We use multiple tags per function (e.g., `cacheTag("vdp", "vin-{vin}")`). When `revalidateTag("vdp", "max")` is called, does this correctly invalidate all entries tagged with `"vdp"`?

3. **`revalidateTag(tag, "max")`:** Is the `"max"` option the correct way to force immediate invalidation, bypassing any stale window?

4. **Promise passing + Suspense:** We pass the promise as a prop (not awaiting in `page.tsx`) and await it inside `UsedCarsDetails` wrapped in `<Suspense>`. Is this the recommended Next.js 16 pattern for streaming with `"use cache"` functions?

5. **`router.prefetch()` for cache warming:** Does `router.prefetch()` correctly trigger `"use cache"` functions on the server, or does it only prefetch the RSC payload without running the data functions?

6. **Singleton HTTP client:** We use a module-level singleton for the Arrow server client. In serverless/edge environments, is this safe?

7. **Mock fallback in cached functions:** When the backend errors, we cache mock data for 5 minutes. Is there a better pattern to avoid caching error fallbacks?

8. **Dual-path architecture (server direct + API routes):** Is keeping two paths (cached for SSR, uncached for client-side) the recommended Next.js 16 pattern, or should client components use server actions instead of API routes?

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `VDP_SERVICE_URL` | Backend VDP API base URL |
| `VDP_API_KEY` | Bearer token for VDP API |
| `USE_MOCK_VDP` | Force mock mode (`"true"`) |
| `REVALIDATION_SECRET` | Secret for revalidation endpoint |
