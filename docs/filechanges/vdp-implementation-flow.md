# VDP (Vehicle Detail Page) — Implementation Flow & Architecture

> **Purpose:** Technical reference for Vercel code review. Documents the Next.js 16 patterns,
> caching strategy, data flow, and server/client component boundaries used in the VDP feature.

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
12. [File Reference](#12-file-reference)
13. [Questions for Vercel Review](#13-questions-for-vercel-review)

---

## 1. Architecture Overview

The VDP uses a **two-call parallel architecture** to render a complete vehicle detail page:

```
                        ┌─────────────────────────────┐
                        │   page.tsx (Server Component) │
                        │                               │
                        │  getVehicleBundleCached(vin)  │
                        │         "use cache"            │
                        └──────────┬────────────────────┘
                                   │
                          Promise.all (parallel)
                          ┌────────┴────────┐
                          │                 │
                ┌─────────▼──────┐  ┌───────▼──────────┐
                │ fetchVinData   │  │ fetchDealerByVin  │
                │   Cached(vin)  │  │   Cached(vin)     │
                │  "use cache"   │  │  "use cache"      │
                └────────┬───────┘  └───────┬───────────┘
                         │                  │
                         ▼                  ▼
                   Arrow Server       Arrow Server
                   Client (HTTP)      Client (HTTP)
                         │                  │
                         ▼                  ▼
                  Backend VDP API    Backend Dealer API
                  /vdp/vehicles/:vin /vdp/dealers?vin=:vin
```

**Key design decisions:**
- **No waterfall:** Product data and dealer data fetch in parallel via `Promise.all`.
- **Single VIN data call:** All product data (vehicle details, specs, features, pricing, history, rating, status) comes from one `VinData` API call — no sequential dependency.
- **Shared cache:** Cached functions use `"use cache"` with VIN-only cache keys (no per-user headers), so the cache is shared across all users.
- **Separate uncached path:** API routes for client-side consumers use uncached functions that forward per-user tracking headers.

---

## 2. Routing & URL Structure

### Catch-All Route

```
apps/web/src/app/used-cars/[[...params]]/
```

The `[[...params]]` optional catch-all serves **two page types** from one route:

| Page Type | URL Pattern | Example |
|-----------|-------------|---------|
| **SRP** (Search Results) | `/used-cars`, `/used-cars/[make]`, `/used-cars/[make]/[model]` | `/used-cars/toyota/camry` |
| **VDP** (Vehicle Detail) | `/used-cars/details/[make]/[model]/[trim]/[year]/[vin]` | `/used-cars/details/toyota/camry/xse/2024/5TDFZRBH5RS100015` |

### Route Parsing

**File:** `src/config/routes/used-cars.ts`

```typescript
type UsedCarsRoute =
  | { type: "srp"; filters: SrpUrlFilters }
  | { type: "details"; make: string; model: string; trim: string; year: number; vin: string }
```

- `parseUsedCarsParams(segments)` → returns `UsedCarsRoute | null`
- Returns `null` for invalid URLs → triggers `notFound()`
- Canonical URL enforcement redirects mismatched casing

### VIN Validation

**File:** `src/config/routes/vehicle-segments.ts`

- VIN: exactly 17 chars, `/^[A-HJ-NPR-Z0-9]{17}$/` (excludes I, O, Q)
- Year: 4 digits, between 1900 and current year + 2
- Make/Model/Trim: lowercase alphanumeric slugs with hyphens
- Trim placeholder: `"-"` when trim is unavailable

---

## 3. Page Entry Point & Suspense Streaming

**File:** `apps/web/src/app/used-cars/[[...params]]/page.tsx`

```typescript
export default async function UsedCarsPage({ params, searchParams }: Props) {
  const [{ params: segments }, { q: initialSearchQuery }] = await Promise.all([
    params,         // Next.js 16: params is a Promise
    searchParams,   // Next.js 16: searchParams is a Promise
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

  // ── SRP Path ──
  return (
    <SrpShell>
      <Suspense fallback={<VehicleGridSkeleton />}>
        <SearchWrapper ... />
      </Suspense>
    </SrpShell>
  );
}
```

### Pattern: Promise Passing + Suspense ("Donut Pattern")

1. `page.tsx` starts `getVehicleBundleCached(vin)` — creates the promise, does **not** await it.
2. The promise is passed as a prop to `<UsedCarsDetails>`, which is wrapped in `<Suspense>`.
3. `<VdpSkeleton />` renders immediately as the fallback while data loads.
4. When the promise resolves, `UsedCarsDetails` renders and streams to the client.

This enables the **page shell to stream immediately** while data fetches happen server-side.

### Metadata Generation

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const route = resolveRoute(segments);
  const meta = getUsedCarsPageMetadata(route);
  return { title: meta.title, description: meta.description, openGraph: { ... } };
}
```

Generates dynamic titles like: `"2024 Toyota Camry XSE — VIN 5TDFZRBH5RS100015"`

---

## 4. Data Fetching — Dual-Path Architecture

We maintain two data-fetching paths for different consumers:

### Path A: Server Components (Cached, Direct Backend Call)

```
Server Component → fetchVinDataCached(vin) → Arrow Server Client → Backend API
```

- Uses `"use cache"` directive
- VIN-only cache key — shared across all users
- No per-user headers (no cookies, no Arrow tracking IDs)
- Called directly from server components (no proxy hop)

**File:** `features/vdp/services/vdp.service.ts`

```typescript
/**
 * Cached VIN data fetch — called directly from server components.
 * Uses "use cache" + cacheLife/cacheTag for ISR-style per-VIN caching.
 * Calls the backend API directly (no proxy hop through API routes).
 */
export async function fetchVinDataCached(vin: string): Promise<VinData> {
  "use cache";
  cacheLife("vdp");
  cacheTag("vdp", `vin-${vin}`);

  if (isMockMode()) return await fetchMockVinData(vin);

  try {
    return await getVdpClient().get<VinData>(`/vdp/vehicles/${vin}`);
  } catch (error) {
    // Log + fallback to mock
    return await fetchMockVinData(vin);
  }
}
```

### Path B: Client Components via API Route (Uncached, Per-User Headers)

```
Browser → fetch(/api/search/vehicle/[id]) → API Route → fetchVinData(vin, { ids, headers }) → Backend API
```

- No `"use cache"` — each request hits the backend
- Forwards per-user Arrow tracking headers (session ID, fingerprint, profile ID)
- Attaches `Authorization: Bearer <VDP_API_KEY>` on the server side
- Used for client-side data fetching where tracking context matters

**File:** `features/vdp/services/vdp.service.ts`

```typescript
/**
 * Uncached VIN data fetch — used by API route handlers that forward
 * per-user Arrow tracking headers. Do NOT add "use cache" here.
 */
export async function fetchVinData(vin: string, options: VdpFetchOptions = {}): Promise<VinData> {
  if (isMockMode()) return await fetchMockVinData(vin);

  try {
    return await getVdpClient().get<VinData>(`/vdp/vehicles/${vin}`, {
      ids: options.ids,
      headers: options.forwardHeaders,
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

  const ids = extractArrowIds(request);             // session, fingerprint, profile
  const forwardHeaders = extractForwardHeaders(request); // user-agent, referer, etc.

  const vinData = await fetchVinData(id, { ids, forwardHeaders });
  return NextResponse.json({ data: { vinData } });
}
```

### Why Two Paths?

| Concern | Server Component Path | API Route Path |
|---------|----------------------|----------------|
| **Cache** | Shared cache via `"use cache"` | No cache (per-user) |
| **Auth** | API key only (Bearer token) | API key + per-user tracking headers |
| **Performance** | Direct backend call (no proxy hop) | Browser → API route → backend |
| **Use case** | Initial page load (SSR) | Client-side navigation, SPA-style fetches |
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

| Parameter | Value | Meaning |
|-----------|-------|---------|
| `stale` | 300s (5 min) | Serve stale content while revalidating in background |
| `revalidate` | 300s (5 min) | Time-based revalidation interval |
| `expire` | 3600s (1 hr) | Hard expiry — cache entry evicted after this |

### Cache Tag Hierarchy

Each cached function applies granular cache tags for targeted invalidation:

```
getVehicleBundleCached(vin)
  Tags: "vdp", "bundle-{vin}"
  ├── fetchVinDataCached(vin)
  │     Tags: "vdp", "vin-{vin}"
  └── fetchDealerByVinCached(vin)
        Tags: "vdp", "dealer-vin-{vin}"
```

| Tag Pattern | Scope | Invalidation Effect |
|-------------|-------|---------------------|
| `"vdp"` | All VDP caches | Invalidates everything — vehicle data, dealer data, all bundles |
| `"vin-{VIN}"` | Single VIN's product data | Invalidates only that VIN's vehicle data |
| `"bundle-{VIN}"` | Single VIN's complete bundle | Invalidates vehicle + dealer for that VIN |
| `"dealer-vin-{VIN}"` | Dealer data by VIN | Invalidates dealer data for that VIN |
| `"dealer-{dealerId}"` | Dealer data by dealer ID | Invalidates dealer data across all VINs for that dealer |

### Layered Caching

The `"use cache"` directive is applied at **multiple levels** of the call chain:

```
getVehicleBundleCached(vin)    ← "use cache" with cacheLife("vdp")
  ├── fetchVinDataCached(vin)   ← "use cache" with cacheLife("vdp")
  └── fetchDealerByVinCached(vin) ← "use cache" with cacheLife("vdp")
```

Each layer independently caches its results. If `fetchVinDataCached` is called from a different composition (e.g., a different page), it still serves from cache.

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

### Usage Examples

```bash
# Revalidate a single VIN (when vehicle data changes)
curl -X POST /api/revalidate \
  -d '{ "tag": "vin-5TDFZRBH5RS100015", "secret": "..." }'

# Revalidate ALL VDP caches (deployment, schema change)
curl -X POST /api/revalidate \
  -d '{ "tag": "vdp", "secret": "..." }'

# Revalidate a specific dealer's data
curl -X POST /api/revalidate \
  -d '{ "tag": "dealer-toyota-fort-worth", "secret": "..." }'
```

### `revalidateTag(tag, "max")`

The `"max"` option ensures immediate invalidation — the next request will fetch fresh data, bypassing any stale window.

---

## 7. Prefetching & Cache Warming

### Vehicle Card Hover Prefetch

**File:** `features/vehicle-card/components/car-card.tsx`

```typescript
const handlePrefetch = useCallback(() => {
  if (vdpUrl !== "#") {
    router.prefetch(vdpUrl);  // Warms RSC payload + data cache
  }
}, [router, vdpUrl]);
```

When a user hovers over a vehicle card in SRP, `router.prefetch()` fires. This:
1. Prefetches the **RSC payload** (React Server Component output) for the VDP route.
2. Triggers `getVehicleBundleCached(vin)` on the server, warming the **data cache** for that VIN.

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

When the vehicle preview modal opens, the VDP route is prefetched. If the user clicks through to the full VDP, the page loads instantly from the warmed cache.

### Cache Warming Flow

```
User hovers vehicle card
  → router.prefetch("/used-cars/details/toyota/camry/xse/2024/VIN123")
    → Next.js fetches RSC payload from server
      → Server runs page.tsx
        → getVehicleBundleCached("VIN123")
          → Promise.all([fetchVinDataCached, fetchDealerByVinCached])
            → Results cached with "use cache" + cacheLife("vdp")

User clicks through to VDP
  → Instant navigation (RSC payload + data already cached)
```

---

## 8. Server/Client Component Boundaries

### Component Tree

```
page.tsx (Server)
├── <Suspense fallback={<VdpSkeleton />}>
│   └── UsedCarsDetails (Server, async) ← Awaits vehicleBundlePromise
│       ├── VehiclePDP (Client) ← MAIN CLIENT ISLAND
│       │   ├── ImageCarousel
│       │   ├── ImagePreviewModal
│       │   ├── VehicleStickyBanner
│       │   ├── VehicleTitle, VehiclePrice, VehicleBadges
│       │   ├── VehicleSpecsGrid, VehicleColors
│       │   ├── VehicleKeyFeatures
│       │   ├── VehicleDealerInfo
│       │   ├── VehicleActionIcons
│       │   ├── promotionSlot → <Suspense>
│       │   │   └── AuthAwarePromotions (Server) → VdpPromotionCards (Client)
│       │   └── testDriveSlot → <Suspense>
│       │       └── AuthAwarePromotions (Server) → VdpPromotionCards (Client)
│       ├── VehicleDetailsTabs (Server) ← Builds tab data, delegates to client
│       │   └── VehicleDetailsTabsClient (Client) ← Tab state management
│       │       ├── OverviewTab (Server-rendered content)
│       │       ├── FeaturesTab (Client) ← Expand/collapse state
│       │       ├── PricingTab (Client, dynamic import) ← Animations
│       │       └── HistoryTab (Server-rendered content)
│       ├── VehicleRating (Server)
│       ├── DealerNotesSection (Server)
│       └── DealerInfoCard (Server)
```

### Boundary Rationale

| Component | Server/Client | Why |
|-----------|---------------|-----|
| `UsedCarsDetails` | Server | Async data fetching, no interactivity |
| `VehiclePDP` | **Client** | Image carousel, scroll tracking, modals, useState |
| `VehicleDetailsTabs` | Server | Builds tab config from data, no state |
| `VehicleDetailsTabsClient` | **Client** | Active tab state management |
| `FeaturesTab` | **Client** | Expand/collapse toggle state |
| `PricingTab` | **Client** | Framer Motion animations, dynamic import for bundle splitting |
| `VehicleRating` | Server | Pure presentation |
| `DealerNotesSection` | Server | Pure presentation |
| `DealerInfoCard` | Server | Pure presentation |
| `AuthAwarePromotions` | Server | Reads `cookies()` for session check |
| `VdpPromotionCards` | **Client** | Reads visitor context via `useArrow()` hook |

### Slot Pattern for Promotion Cards

Promotion cards are passed as React slots through the server → client boundary:

```typescript
// details.tsx (Server)
<VehiclePDP
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
  vehicle={vehicleInfo}
/>
```

This allows `AuthAwarePromotions` (server component that reads cookies) to be rendered inside `VehiclePDP` (client component) via the children/slot pattern.

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

- **Bearer token auth:** Attaches `Authorization: Bearer <VDP_API_KEY>` header automatically.
- **Arrow tracking headers:** Optionally attaches `X-Arrow-Session-Id`, `X-Arrow-Fp-Id`, `X-Arrow-Profile-Id`, `X-Arrow-Fp-Eid` when `ids` option is provided.
- **Timeout:** `AbortController`-based timeout (default 15s, VDP uses 10s).
- **Retries:** Exponential backoff (`retryDelay * 2^attempt`). Only retries on status 0 (timeout/network) or >= 500.
- **Error parsing:** Non-OK responses produce `ArrowServerError` with status, code, service, body.
- **Singleton pattern:** Client is created once per service and reused.

### Header Forwarding (API Route Path Only)

```typescript
// Extracts Arrow IDs from request headers or cookies
extractArrowIds(request) → { sessionId, fingerprintId, profileId, eventId }

// Extracts safe-to-forward headers (user-agent, referer, x-forwarded-for, etc.)
extractForwardHeaders(request) → Record<string, string>
```

Forwarded headers whitelist: `user-agent`, `accept-language`, `referer`, `x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`, `x-request-id`, `x-correlation-id`, plus all Arrow tracking headers.

---

## 10. Type Definitions

**File:** `features/vdp/data/types.ts`

### VinData (Complete Product Data — Single API Call)

```typescript
interface VinData {
  dealerNotes: string;              // Dealer's vehicle description
  features: FeatureCategory[];      // Grouped feature lists
  featuresInitialCount: number;     // How many features to show initially
  history: HistoryData;             // Ownership, damage, service history
  priceHistory: PriceHistoryEntry[];// Date-stamped price changes
  pricing: PricingData;             // Current price, avg price, views, saves
  rating: RatingData;               // Star rating, review count, distribution
  specs: VehicleSpecData[];         // Key-value specification pairs
  vehicle: VehicleDetail;           // Core vehicle info (make, model, year, images...)
  vehicleStatus: VehicleStatusData; // Availability flags
}
```

### VehicleBundle (Page-Level Composite)

```typescript
interface VehicleBundle {
  vinData: VinData;                 // All product data
  dealerInfo: DealerInfo;           // Dealer contact and location
}
```

### DealerInfo

```typescript
interface DealerInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  dealershipImage: string;
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

### Mock Data Generation

- Sources 50 vehicles from search mock inventory
- Maps each vehicle to a deterministic profile from `vdp-profiles.json` (7 templates)
- Generates specs, features, ratings, pricing, history, and dealer data per VIN
- Uses VIN-based deterministic hashing for reproducible results
- Simulates 40ms network delay

### Fallback Behavior

All service functions fall back to mock data on error:

```typescript
try {
  return await getVdpClient().get<VinData>(`/vdp/vehicles/${vin}`);
} catch (error) {
  console.error("[VDPService] Upstream error:", error.message);
  return await fetchMockVinData(vin);  // Graceful degradation
}
```

---

## 12. File Reference

### Core Page Files

| File | Purpose |
|------|---------|
| `app/used-cars/[[...params]]/page.tsx` | Page entry — routing, Suspense, data promise creation |
| `app/used-cars/[[...params]]/views/details.tsx` | VDP composition — async server component, data unwrapping |
| `app/used-cars/[[...params]]/loading.tsx` | VDP skeleton for initial load |
| `app/used-cars/error.tsx` | Error boundary (client) |
| `app/used-cars/not-found.tsx` | 404 page |

### Service Layer

| File | Purpose |
|------|---------|
| `features/vdp/services/vdp.service.ts` | VIN data fetching (cached + uncached variants) |
| `features/vdp/services/dealer.service.ts` | Dealer data fetching (cached + uncached, by ID or VIN) |
| `features/vdp/services/vdp-cached.ts` | Bundle assembly — `Promise.all` composition |
| `features/vdp/services/vdp-api.ts` | Client-side API functions (browser → API route) |
| `features/vdp/services/vdp.mocks.ts` | Mock data generation and fallback |
| `features/tracking/lib/server-api.ts` | Arrow HTTP client with auth, retries, timeout |

### API Routes

| File | Route | Purpose |
|------|-------|---------|
| `app/api/search/vehicle/[id]/route.ts` | `GET /api/search/vehicle/:vin` | Client-side VIN data (per-user tracking) |
| `app/api/search/dealer/[vin]/route.ts` | `GET /api/search/dealer/:vin` | Client-side dealer data |
| `app/api/revalidate/route.ts` | `POST /api/revalidate` | On-demand cache invalidation |

### Components

| File | Server/Client | Purpose |
|------|---------------|---------|
| `features/vdp/components/vehicle-pdp.tsx` | Client | Main client island — carousel, scroll, modals |
| `features/vdp/components/vehicle-details-tabs.tsx` | Server | Tab definition builder |
| `features/vdp/components/vehicle-details-tabs-client.tsx` | Client | Tab state management |
| `features/vdp/components/features-tab.tsx` | Client | Expand/collapse |
| `features/vdp/components/pricing-tab.tsx` | Client | Animations (dynamic import) |
| `features/vdp/components/vehicle-rating.tsx` | Server | Pure presentation |
| `features/vdp/components/dealer-notes-section.tsx` | Server | Pure presentation |
| `features/vdp/components/dealer-info-card.tsx` | Server | Pure presentation |
| `features/vdp/components/auth-aware-promotions.tsx` | Server | Session check via cookies() |
| `features/vdp/components/vdp-promotion-cards.tsx` | Client | Promotion card rendering |
| `features/vdp/components/vdp-skeleton.tsx` | Server | Loading skeleton |

### Configuration

| File | Purpose |
|------|---------|
| `apps/web/next.config.ts` | `cacheLife` profiles, `cacheComponents: true` |
| `config/routes/used-cars.ts` | Route parsing, URL building |
| `config/routes/vehicle-segments.ts` | VIN/year/slug validation |
| `config/routes/constants.ts` | Route constants, API route builders |

### Types

| File | Purpose |
|------|---------|
| `features/vdp/data/types.ts` | All VDP type definitions (VinData, VehicleDetail, etc.) |
| `shared/data/dealer/dealer-data.ts` | DealerInfo, DealerNotes types |

---

## 13. Questions for Vercel Review

1. **Layered `"use cache"`:** We apply `"use cache"` at both the bundle level (`getVehicleBundleCached`) and the individual function level (`fetchVinDataCached`, `fetchDealerByVinCached`). Is this correct, or does the inner `"use cache"` become redundant when wrapped by an outer `"use cache"`?

2. **`cacheTag` granularity:** We use multiple tags per function (e.g., `cacheTag("vdp", "vin-{vin}")`). When `revalidateTag("vdp", "max")` is called, does this correctly invalidate all entries tagged with `"vdp"`, including those with additional tags?

3. **`revalidateTag(tag, "max")`:** Is the `"max"` option the correct way to force immediate invalidation, bypassing any stale window?

4. **Promise passing + Suspense:** We pass the promise as a prop (not awaiting it in `page.tsx`) and await it inside `UsedCarsDetails` which is wrapped in `<Suspense>`. Is this the recommended pattern for streaming SSR with `"use cache"` functions?

5. **`router.prefetch()` for cache warming:** We call `router.prefetch(vdpUrl)` on hover/modal-open to warm both the RSC payload cache and the data cache (via `"use cache"` functions). Does `router.prefetch()` correctly trigger the `"use cache"` functions on the server, or does it only prefetch the RSC payload?

6. **Singleton HTTP client:** We use a module-level singleton (`let _client = null`) for the Arrow server client. In a serverless/edge environment, is this safe, or should we create a new client per request?

7. **Mock fallback in cached functions:** When the backend errors, we fall back to mock data inside `"use cache"` functions. This means the mock data gets cached for 5 minutes. Is there a better pattern to avoid caching error fallbacks (e.g., throwing and handling at a higher level)?

8. **API route for client-side vs. direct backend call for server components:** We intentionally keep two paths — is this the recommended Next.js 16 pattern, or should client components also call the backend directly via server actions?

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `VDP_SERVICE_URL` | Backend VDP API base URL |
| `VDP_API_KEY` | Bearer token for VDP API authentication |
| `USE_MOCK_VDP` | Force mock mode (`"true"` to enable) |
| `REVALIDATION_SECRET` | Secret for on-demand revalidation endpoint |
| `ARROW_ENCRYPTION_KEY` | JWE encryption key for Arrow payloads |
