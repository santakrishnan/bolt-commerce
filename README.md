# Arrow E-commerce Monorepo

A modern, production-ready e-commerce monorepo built with Next.js 16, React 19, Turborepo, Tailwind CSS 4, shadcn/ui, TanStack Query, and Biome.

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router, Turbopack) | 16.1.x |
| UI Library | React (Server Components, `use()` API) | 19.2.x |
| Styling | Tailwind CSS (CSS-first config) | 4.1.x |
| Components | shadcn/ui + Radix UI primitives | latest |
| Server State | TanStack React Query | 5.90.x |
| Animation | Framer Motion | 12.x |
| Monorepo | Turborepo + PNPM workspaces | 2.8.x / 10.29.x |
| Linting/Formatting | Biome v2 + Ultracite presets | 2.3.x |
| Testing | Vitest + Testing Library | 2.1.x |
| Type Safety | TypeScript (strict mode) | 5.7.x |
| Identity | Fingerprint.js Pro (sealed results) | 2.7.x / 4.1.x |
| Encryption | jose (JWE A256KW + A256GCM) | 6.1.x |
| Validation | Zod | 4.3.x |
| Git Hooks | Husky + lint-staged | 9.x / 15.x |
| Deployment | Docker (standalone) / Vercel | - |

## Monorepo Structure

```
arrow-ecommerce/
├── apps/
│   └── web/                          # Next.js e-commerce app
│       ├── src/
│       │   ├── app/                  # App Router pages & API routes
│       │   ├── components/
│       │   │   ├── features/         # Domain-specific components
│       │   │   │   ├── card/         # Car card components
│       │   │   │   ├── landing/      # Landing page sections
│       │   │   │   ├── mygarage/     # My Garage feature
│       │   │   │   ├── search/       # Search & filter sidebar
│       │   │   │   ├── vdp/          # Vehicle Detail Page
│       │   │   │   └── vehicle-preview-modal/
│       │   │   ├── layout/           # Header, footer, page wrappers
│       │   │   ├── providers/        # React context providers
│       │   │   └── shared/           # Reusable app-level components
│       │   ├── hooks/                # Custom React hooks
│       │   ├── lib/                  # Business logic & utilities
│       │   │   ├── arrow/            # Arrow tracking / Fingerprint SDK
│       │   │   ├── auth/             # Auth (sealed cookies)
│       │   │   ├── data/             # Static & mock data
│       │   │   ├── flags/            # Feature flags (Vercel flags SDK)
│       │   │   ├── routes/           # URL builders & constants
│       │   │   └── search/           # Search logic & filters
│       │   ├── services/             # API service layer
│       │   │   ├── events/           # Event tracking service
│       │   │   ├── fingerprint/      # Fingerprint resolution (sealed + server API)
│       │   │   ├── landing/          # Landing page data service
│       │   │   ├── search/           # Vehicle search service
│       │   │   ├── vdp/              # Vehicle Detail Page service
│       │   │   └── visitor-profile/  # Visitor profile service
│       │   └── data/                 # JSON configs & mock datasets
│       └── public/                   # Static assets (fonts, images)
├── packages/
│   ├── ui/                           # Shared component library (@tfs-ucmp/ui)
│   ├── ui-theme/                     # CSS-only design tokens (@tfs-ucmp/ui-theme)
│   ├── shared/                       # Shared hooks, providers, utils (@tfs-ucmp/shared)
│   ├── utils/                        # cn, formatters, slugify, validators
│   └── config/
│       ├── typescript/               # Shared tsconfig (base, nextjs, react-library)
│       └── vitest/                   # Shared Vitest configs + test utils
├── turbo.json
├── pnpm-workspace.yaml
├── biome.json
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 20
- PNPM >= 10

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp apps/web/.env.local.example apps/web/.env.local

# Start development server (uses Turbopack)
pnpm dev

# Build all apps and packages
pnpm build

# Run tests
pnpm test
```

## App Router Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (Server Component) |
| `/used-cars` | Vehicle search results (SRP) |
| `/used-cars/:make/:model/:trim/:year/:vin` | Vehicle Detail Page (VDP) |
| `/favorites` | Saved vehicles |
| `/my-garage` | Personalized garage |
| `/dealer-notes` | Dealer notes |
| `/api/session` | Session bootstrap (fingerprint) |
| `/api/events/track` | Event tracking endpoint |
| `/api/search` | Vehicle search API |
| `/api/visitor-profile` | Visitor profile API |
| `/api/health` | Health check |

The `/used-cars/[[...params]]` catch-all route handles both the SRP (search results) and VDP (vehicle details) based on URL shape.

## Provider Architecture

Providers are composed in the root layout using a `composeProviders` utility. The nesting order (outermost to innermost):

```
ThemeProvider                         # Light/dark mode (CSS class toggle)
  ArrowProvider                       # Composite: 4 nested layers
    FingerprintClientProvider          #   Fingerprint.js Pro SDK wrapper
      ProfileProvider                  #   Session bootstrap + ID resolution
        VisitorProfileProvider         #   Auto-fetches visitor profile (5-min TTL)
          ArrowBridge                  #   Merges into unified ArrowContext
            LocationInit               # Async Server Component (reads zip cookie)
              LocationProvider         # Zip code, hero state, background images
                QueryProvider          # TanStack QueryClient + IndexedDB persistence
                  FavoritesProvider    # Saved vehicles (optimistic mutations)
                    SearchHistoryProvider  # Recent searches (optimistic mutations)
                      CartProvider     # Shopping cart (in-memory)
                        Header + {children}
Footer (outside providers — pure Server Component)
```

`LocationInit` is an async Server Component that reads the manual-zip cookie via `cookies()` inside a `<Suspense>` boundary, passing `initialZip` to `LocationProvider` so the first HTML paint contains the correct zip code with zero client-side flash.

### Provider Summary

| Provider | State Type | Persistence | Exposed Hook |
|----------|-----------|-------------|--------------|
| `ThemeProvider` | Client (React state) | None | `useTheme()` |
| `ArrowProvider` | Client (React state) | httpOnly cookies | `useArrow()`, `useArrowSafe()`, `useArrowClient()`, `useEventTracking()` |
| `LocationProvider` | Client (React state) | Cookie (`arrow_manual_zip`, 30 days) | `useLocation()` |
| `QueryProvider` | N/A (infrastructure) | IndexedDB (2 keys) | TanStack hooks |
| `FavoritesProvider` | Server (TanStack Query) | IndexedDB via mock API | `useFavorites()` |
| `SearchHistoryProvider` | Server (TanStack Query) | IndexedDB via mock API | `useSearchHistory()` |
| `CartProvider` | Client (React state) | None | `useCart()` |
| `SearchProvider` | Client (React state) | None (route-level) | `useSearchContext()` |

### State Management Strategy

- **Server state** (data from APIs): TanStack React Query with optimistic mutations, `staleTime: 30s`, `gcTime: 5min`, `retry: 1`
- **Client state** (UI/preferences): React Context + `useState`/`useCallback`/`useMemo`
- **Shared mutation pattern**: `useOptimisticListMutation` hook extracts the cancel-snapshot-update-rollback-invalidate boilerplate used by both `FavoritesProvider` and `SearchHistoryProvider`

## Arrow Tracking System

The Arrow SDK is a multi-layer abstraction over Fingerprint.js Pro for visitor identification, session management, and event tracking.

### Session Bootstrap Flow

1. Client POSTs `{ mode: "bootstrap" }` to `/api/session`
2. If valid httpOnly cookies exist, server returns tracking IDs + FED-safe data (no SDK call)
3. If not, client calls Fingerprint SDK, extracts sealed result, POSTs `{ mode: "initialize", sealedResult }` to `/api/session`
4. Server decrypts sealed result (AES-256-GCM), resolves/creates profile, sets httpOnly cookies

### Event Tracking

Events are **fire-and-forget** at all call sites. The `useEventTracking()` hook:
- Reads IDs from `useArrowSafe()` (degrades to `"anonymous"` outside ArrowProvider)
- POSTs to `/api/events/track` (or `NEXT_PUBLIC_EVENT_SERVICE_URL`) with a 10-second timeout
- Supports optional JWE encryption of event payloads
- Calls `invalidateProfile()` after each event to bust the visitor profile cache

The BFF route handler validates the request, forwards to the upstream analytics service (or logs locally in mock mode with a 10-second timeout), then calls `revalidateTag` to bust the server-side profile cache.

### Security Design

Full fingerprint event data (IP, user-agent, bot scores, VPN, proxy, tampering) **never reaches the client**. Only `visitorId`, `incognito`, and `location` are exposed in React state. All sensitive data stays server-side in httpOnly cookies.

## Services Layer

All services follow the same pattern: upstream API call with auth header, graceful fallback to mock data when the service URL env var is unset.

| Service | Mock When | Upstream Endpoint | Caching |
|---------|-----------|-------------------|---------|
| Landing | `LANDING_SERVICE_URL` unset | `/stats`, `/vehicle-finder/*` | `use cache` — `cacheLife("landing")` (15 min stale) |
| Search | `SEARCH_SERVICE_URL` unset | `/vehicles/search` | None (dynamic) |
| VDP | `VDP_SERVICE_URL` unset | `/vehicles/:id`, `/vehicles/vin/:vin` | `use cache` (5 min stale) |
| Visitor Profile | `PROFILE_SERVICE_URL` unset | `/profiles/resolve`, `/profiles/:id` | `use cache` — `cacheLife("profile")` (5 min stale) |
| Events | `EVENT_TRACKING_URL` unset | POST to upstream | None |
| Fingerprint | `FINGERPRINT_SECRET_API_KEY` unset | Fingerprint Server API v4 | `use cache` — `cacheLife("days")` |
| Saved Vehicles | Always mock | IndexedDB-backed in-memory | TanStack Query cache |
| Search History | Always mock | IndexedDB-backed in-memory | TanStack Query cache |

## Packages

### `@tfs-ucmp/ui`

Shared React component library built on Radix UI primitives, CVA, and Tailwind. Exports:

- **Components**: Accordion, AlertDialog, Badge, Breadcrumb, Button, Card, Carousel, Chip, Collapsible, Dialog, DropdownMenu, Heading, Input, Pagination, ScrollArea, Select, Tabs
- **Hooks**: `use-debounce`, `use-media-query`
- **Lib**: `cn` utility, vehicle types, inspection features
- **Icons**: Lucide icons re-exported

```tsx
import { Button, Heading, cn } from "@tfs-ucmp/ui";
```

### `@tfs-ucmp/ui-theme`

CSS-only design token package. No JavaScript — pure CSS using Tailwind v4's `@theme` directive.

- **Multi-brand**: `arrow` theme (Toyota red, ToyotaType font) and `acme` theme
- **Light/dark mode**: CSS custom properties with prefers-color-scheme
- **Token categories**: Colors, spacing, radius, typography, shadows

```css
/* In your app's globals.css */
@import "@tfs-ucmp/ui-theme/themes/arrow";
```

### `@tfs-ucmp/shared`

Shared hooks (`use-debounce`, `use-media-query`), providers (`ThemeProvider`), and utils (`formatters`, `strings`, `validators`).

### `utils`

Lightweight utilities: `cn` (clsx + tailwind-merge), `formatters`, `slugify`, `validators`.

### `@arrow/tsconfig`

Shared TypeScript configs: `base.json`, `nextjs.json`, `react-library.json`. Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`.

### `@arrow/vitest-config`

Shared Vitest configs with built-in Next.js mocks (`next/navigation`, `next/image`, `matchMedia`, `IntersectionObserver`).

## Styling

Tailwind CSS 4 with CSS-first configuration. No `tailwind.config.js` at runtime.

```css
/* apps/web/src/app/globals.css */
@import "@tfs-ucmp/ui-theme/themes/arrow";     /* Theme + Tailwind entry */
@source "../../../../packages/ui/src";           /* Scan UI package for classes */

@theme inline {
  --font-sans: var(--font-toyota-type), system-ui, -apple-system, sans-serif;
}
```

**Custom font**: ToyotaType (12 weights/styles) loaded via `next/font/local` with `display: swap` and `preload: true` for zero layout shift.

## Environment Variables

Create `.env.local` in `apps/web/`:

### Required

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FINGERPRINT_API_KEY` | Fingerprint.js Pro public API key |

### Optional — Client

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_EVENT_SERVICE_URL` | Event tracking endpoint (default: `/api/events`) |
| `NEXT_PUBLIC_FINGERPRINT_REGION` | Fingerprint region: `us`, `eu`, `ap` |
| `NEXT_PUBLIC_FINGERPRINT_ENDPOINT` | Custom Fingerprint endpoint |
| `NEXT_PUBLIC_USE_FPJS_PROXY` | Route FP requests through `/api/fpjs` proxy (`"true"`) |
| `NEXT_PUBLIC_ARROW_ENCRYPTION_KEY` | JWE encryption key for event payloads |
| `NEXT_PUBLIC_PROFILE_SERVICE_URL` | Profile service URL |
| `NEXT_PUBLIC_API_URL` | Public API base URL |

### Optional — Server

| Variable | Description |
|----------|-------------|
| `FINGERPRINT_SECRET_API_KEY` | Fingerprint Server API v4 secret key |
| `FINGERPRINT_SEALED_KEY` | AES-256-GCM sealed result decryption key |
| `ARROW_ENCRYPTION_KEY` | Server-side JWE decryption key |
| `PROFILE_SERVICE_URL` | Visitor profile service URL (mock if unset) |
| `PROFILE_API_KEY` | Profile service auth token |
| `EVENT_TRACKING_URL` | Upstream analytics service URL (mock if unset) |
| `EVENT_API_KEY` | Event service auth token |
| `SEARCH_SERVICE_URL` | Vehicle search service URL (mock if unset) |
| `SEARCH_API_KEY` | Search service auth token |
| `LANDING_SERVICE_URL` | Landing data service URL (mock if unset) |
| `LANDING_API_KEY` | Landing service auth token |
| `VDP_SERVICE_URL` | Vehicle Detail Page service URL (mock if unset) |
| `VDP_API_KEY` | VDP service auth token |

### Mock Mode Flags

| Variable | Description |
|----------|-------------|
| `USE_MOCK_PROFILE` | Force mock profile service |
| `USE_MOCK_SEARCH` | Force mock search service |
| `USE_MOCK_LANDING` | Force mock landing service |
| `USE_MOCK_VDP` | Force mock VDP service |

See `apps/web/.env.local.example` for all available variables.

## Available Commands

```bash
# Development
pnpm dev              # Start all apps in dev mode (Turbopack)
pnpm build            # Build all apps and packages
pnpm start            # Start production server

# Code Quality
pnpm check            # Check code for issues (Biome + Ultracite)
pnpm fix              # Auto-fix issues
pnpm fix:unsafe       # Apply unsafe fixes
pnpm doctor           # Validate tooling setup
pnpm type-check       # Type-check all packages

# Testing
pnpm test             # Run all tests (Vitest)
pnpm test:watch       # Watch mode
pnpm test:ui          # Vitest UI
pnpm test:coverage    # With coverage report (in apps/web)

# Utilities
pnpm clean            # Clean all build artifacts
pnpm gen              # Run Turbo code generators
pnpm ui:add           # Add shadcn/ui component to packages/ui
```

## Linting & Formatting

This project uses **Biome v2** with **Ultracite** presets (replaces ESLint + Prettier).

**Presets**: `ultracite/biome/core`, `ultracite/biome/next`, `ultracite/biome/react`

Key rules:
- `useExhaustiveDependencies`: error
- `useImportType`: error
- `noArrayIndexKey`: error
- `noForEach`: error
- `noExplicitAny`: warn
- `noNonNullAssertion`: warn

Formatting: 2 spaces, double quotes, trailing commas (ES5), semicolons always, 100 char line width.

Pre-commit hooks via Husky + lint-staged run `biome check --write` and `ultracite fix` on staged files.

## Testing

Vitest with `@testing-library/react` and built-in Next.js mocks.

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("MyComponent", () => {
  it("should render", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

Built-in mocks (auto-configured): `next/navigation`, `next/image`, `matchMedia`, `IntersectionObserver`.

## Deployment

### Docker

```bash
docker compose up --build
```

Multi-stage Dockerfile: Node 22 Alpine, PNPM corepack, `output: "standalone"` for minimal production image. Health check: `GET /api/health`.

### Vercel

1. Connect repository to Vercel
2. Set root directory to `apps/web`
3. Vercel auto-detects Next.js and configures build settings

## AI-Assisted Development

This project includes agent skills in `.agents/` for AI-assisted development:

| Skill | Description |
|-------|-------------|
| `vercel-react-best-practices` | React/Next.js performance patterns (57 rules) |
| `next-best-practices` | Next.js framework conventions |
| `tanstack-query` | TanStack Query patterns (caching, optimistic updates, SSR) |
| `tanstack-integration` | TanStack Query + Next.js integration |
| `web-design-guidelines` | Accessibility and UX guidelines |
| `find-skills` | Discover additional skills |

```bash
# Install all skills
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y
npx skills add vercel-labs/next-skills@next-best-practices -g -y
npx skills add vercel-labs/agent-skills@web-design-guidelines -g -y
npx skills add vercel-labs/skills@find-skills -g -y
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm fix` to auto-fix lint issues
4. Run `pnpm test` to ensure tests pass
5. Run `pnpm type-check` to verify types
6. Commit (Husky runs pre-commit checks automatically)
7. Push and create a Pull Request

## License

MIT
