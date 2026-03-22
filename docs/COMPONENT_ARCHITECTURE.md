# Component Architecture Guide

Hi team, I'm glad you like the approach, I noted two things when looking at the structure:
- There are no "entities" folders, like vdp, landing, etc. I see it more like a `vehicle` folder with components inside it. You can see vehicle-related components in other non-entity folders, like favorites, which could go in vehicle
- It's ok to nest. If you have `vehicle-card` and associated components like `vehicle-card-title`, `vehicle-details`, etc. that are only used within that component, it's fine to have a `vehicle-card` folder containing those components and only expose the components you need (or having multiple components per file, I prefer the latter approach to reduce context switching but I understand some people dislike it.

I have some more recommendations we can discuss in a next meeting but I think those are the most important ones

``
Recommendations
1. Split into targeted Suspense boundaries
The cookies() call in LocationInit is the only thing that requires Suspense (it's an async Server Component). ArrowProvider is a client component — it doesn't need Suspense, it manages its own loading state. Move providers that don't depend on the async call outside Suspense:


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={toyotaType.variable} lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <ArrowProvider>
              <Suspense fallback={<LayoutShell>{children}</LayoutShell>}>
                <LocationInit>
                  <FavoritesProvider>
                    <SearchHistoryProvider>
                      <CartProvider>
                        <Header />
                        {children}
                      </CartProvider>
                    </SearchHistoryProvider>
                  </FavoritesProvider>
                </LocationInit>
              </Suspense>
            </ArrowProvider>
          </QueryProvider>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
Why: ThemeProvider, QueryProvider, and ArrowProvider are all client components with no async dependencies. They can render immediately. Only LocationInit (async server component reading cookies) needs Suspense.

2. Provide a meaningful Suspense fallback
fallback={null} means blank screen. Instead, show the app shell immediately:


function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="absolute top-0 right-0 left-0 z-[35] h-16 w-full sm:h-20" />
      <div className="h-16 sm:h-20" aria-hidden="true" />
      {children}
    </>
  );
}
This renders the header spacer and page content immediately while LocationInit resolves.

3. ArrowProvider should not block the tree
ArrowProvider's bootstrap call takes 100ms–2s. Currently it blocks all children. Instead, ArrowProvider should render children immediately and expose a ready flag. Consumers that need Arrow data (like LocationProvider) already check isResolved — they handle the loading state themselves.

If ArrowProvider currently delays rendering children until bootstrap completes, consider changing it to render children immediately with a "not ready" context value. This is likely already the case based on the code — but verify that ProfileProvider renders {children} even while isLoading: true.

4. Move CartProvider to where it's actually used
CartProvider is pure in-memory state with zero dependencies. It doesn't need to wrap the entire app — it only needs to wrap pages that use the cart. Move it to the specific routes that need it, or at minimum, keep it but understand it adds no overhead (it's ~0ms to mount).

5. Consider lazy-loading Favorites and SearchHistory providers
FavoritesProvider and SearchHistoryProvider each trigger a useQuery on mount (fetching from IndexedDB). These could be deferred until the user interacts with search or favorites. However, since they use placeholderData: [], they render instantly and fetch in the background — so the real-world impact is minimal. Keep them as-is unless profiling shows otherwise.

Recommended Final Layout

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@tfs-ucmp/shared/providers";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { CartProvider } from "~/components/providers/cart-provider";
import { FavoritesProvider } from "~/components/providers/favorites-provider";
import { LocationProvider } from "~/components/providers/location-provider";
import { QueryProvider } from "~/components/providers/query-provider";
import { SearchHistoryProvider } from "~/components/providers/search-history-provider";
import { FeatureFlagDebug } from "~/components/shared/feature-flag-debug";
import { ArrowProvider } from "~/lib/arrow";
import { toyotaType } from "~/lib/fonts";
import { MANUAL_ZIP_COOKIE, ZIP_RE } from "~/lib/routes/constants";

export const metadata: Metadata = {
  title: "Arrow - Modern E-commerce",
  description: "Arrow - Modern E-commerce",
};

/** Reads manual-zip cookie on the server. Rendered inside Suspense. */
async function LocationInit({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const savedZip = cookieStore.get(MANUAL_ZIP_COOKIE)?.value;
  const initialZip = savedZip && ZIP_RE.test(savedZip) ? savedZip : null;
  return <LocationProvider initialZip={initialZip}>{children}</LocationProvider>;
}

/** Skeleton header to show while LocationInit resolves. */
function HeaderSkeleton() {
  return <div aria-hidden="true" className="h-16 w-full sm:h-20" />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={toyotaType.variable} lang="en" suppressHydrationWarning>
      <body>
        {/* ── Sync providers: render immediately, no async deps ── */}
        <ThemeProvider>
          <QueryProvider>
            <ArrowProvider>
              <FavoritesProvider>
                <SearchHistoryProvider>
                  <CartProvider>
                    {/* ── Async boundary: only LocationInit needs Suspense ── */}
                    <Suspense
                      fallback={
                        <>
                          <HeaderSkeleton />
                          {children}
                        </>
                      }
                    >
                      <LocationInit>
                        <Header />
                        {children}
                      </LocationInit>
                    </Suspense>
                  </CartProvider>
                </SearchHistoryProvider>
              </FavoritesProvider>
            </ArrowProvider>
          </QueryProvider>
        </ThemeProvider>

        {/* ── Footer: Server Component, no provider deps ── */}
        <Footer />

        {/* ── Dev-only debug panel ── */}
        {process.env.NODE_ENV !== "production" && (
          <Suspense fallback={null}>
            <FeatureFlagDebug />
          </Suspense>
        )}
      </body>
    </html>
  );
}
``

## Overview

This document defines the component structure for the Arrow E-commerce monorepo, based on Vercel's composition patterns, React best practices, and Next.js conventions.

## The 3-Layer Model

| Layer | Location | What Goes Here | Shared? |
|-------|----------|---------------|---------|
| **Design Tokens** | `packages/ui-theme` | CSS variables, themes, utilities | All apps |
| **Primitives + Compounds** | `packages/ui` | shadcn components + custom shared components | All apps |
| **Feature Components** | `apps/*/src/components` | App-specific components, layouts, pages | Per app only |

## Architecture Diagram

```
packages/ui-theme/        ← Layer 1: Design Tokens (CSS only)
├── base/                    Tailwind + shared tokens
├── themes/arrow/            Brand overrides
├── themes/acme/             Brand overrides
└── utilities/               Custom utility classes

packages/ui/src/           ← Layer 2: Shared Components
├── primitives/              shadcn/ui components (generated)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── card.tsx
│   ├── select.tsx
│   ├── dropdown-menu.tsx
│   └── index.ts
├── components/              Custom shared components (hand-built)
│   ├── data-table/
│   │   ├── data-table.tsx
│   │   ├── data-table-header.tsx
│   │   ├── data-table-row.tsx
│   │   ├── data-table-pagination.tsx
│   │   └── index.ts
│   ├── combobox/
│   │   ├── combobox.tsx
│   │   └── index.ts
│   ├── file-upload/
│   │   ├── file-upload.tsx
│   │   └── index.ts
│   └── index.ts
├── hooks/                   Shared hooks
│   ├── use-media-query.ts
│   ├── use-debounce.ts
│   └── index.ts
├── lib/
│   └── utils.ts             cn() helper
└── index.ts                 Main entry

apps/web/src/              ← Layer 3: App-Specific Components
├── components/
│   ├── features/            Business logic components
│   │   ├── product-card/
│   │   │   ├── product-card.tsx
│   │   │   ├── product-card-actions.tsx
│   │   │   └── index.ts
│   │   ├── cart-drawer/
│   │   ├── checkout-form/
│   │   └── search-bar/
│   ├── layout/              App-specific layout
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   └── nav.tsx
│   └── providers/           App-level providers
│       ├── theme-provider.tsx
│       └── cart-provider.tsx
└── app/                     Route segments
    ├── layout.tsx
    ├── page.tsx
    └── products/
        └── page.tsx
```

## Decision Framework

Use this flowchart to decide where a component belongs:

```
Is it a shadcn primitive?
  └── YES → packages/ui/src/primitives/

Is it used by 2+ apps?
  └── YES → packages/ui/src/components/
  └── NO  → Does it contain business logic?
              └── YES → apps/*/src/components/features/
              └── NO  → Could another app use it eventually?
                          └── YES → packages/ui/src/components/
                          └── NO  → apps/*/src/components/
```

## Layer 1: Design Tokens (`packages/ui-theme`)

**Purpose**: CSS-only design system with multi-brand support.

**Rules**:
- CSS only — no React components
- All theming via `@theme` directive (Tailwind v4)
- Brands override only what they need (inheritance model)

**Usage**:
```css
/* Import default theme (Arrow) */
@import "@arrow/ui-theme";

/* Or explicit theme selection */
@import "@arrow/ui-theme/base";
@import "@arrow/ui-theme/themes/acme";
```

## Layer 2: Shared UI (`packages/ui`)

### Primitives (shadcn/ui)

**Location**: `packages/ui/src/primitives/`

**Rules**:
- Generated via `npx shadcn add` — don't manually modify unless extending
- Always Client Components (`'use client'`)
- Use CVA variants for styling (not boolean props)

**Example** (Button with CVA variants):
```tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium ...',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground ...',
        destructive: 'bg-destructive ...',
        outline: 'border border-input ...',
        ghost: 'hover:bg-accent ...',
        link: 'text-primary underline-offset-4 ...',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        icon: 'h-9 w-9',
      },
    },
  }
)
```

### Custom Shared Components

**Location**: `packages/ui/src/components/`

**Rules**:
- Built ON TOP of primitives
- Use **compound component pattern** for complex components
- Use **explicit variants** instead of boolean props
- Can be Server or Client Components

**Compound Component Pattern**:
```tsx
const TableContext = createContext<TableContextValue | null>(null)

export function DataTable({ children, data }: Props) {
  return (
    <TableContext value={{ data }}>
      <table>{children}</table>
    </TableContext>
  )
}

DataTable.Header = DataTableHeader
DataTable.Row = DataTableRow
DataTable.Pagination = DataTablePagination

// Usage:
<DataTable data={products}>
  <DataTable.Header columns={columns} />
  <DataTable.Row render={(item) => <ProductRow item={item} />} />
  <DataTable.Pagination pageSize={10} />
</DataTable>
```

**Explicit Variants Over Booleans**:
```tsx
// ❌ BAD: Boolean props
<Composer isThread isEditing={false} showAttachments />

// ✅ GOOD: Explicit variant components
<ThreadComposer channelId="abc" />
<EditMessageComposer messageId="xyz" />
```

### React 19 Patterns

Since this project uses React 19, follow these patterns:

```tsx
// ❌ Legacy: forwardRef
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => ...)

// ✅ React 19: ref as regular prop
function Button({ ref, className, variant, size, ...props }: ButtonProps) {
  return <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

```tsx
// ❌ Legacy: useContext
const value = useContext(MyContext)

// ✅ React 19: use()
const value = use(MyContext)
```

## Layer 3: App Components (`apps/*/src/components`)

### Feature Components

**Location**: `apps/*/src/components/features/`

**Rules**:
- Contain business logic specific to one app
- Default to Server Components
- Extract interactive parts into separate Client Components

```tsx
// product-card.tsx (Server Component - default)
import { Button } from 'ui'

export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <ProductCardActions productId={product.id} />
    </div>
  )
}

// product-card-actions.tsx (Client Component)
'use client'

export function ProductCardActions({ productId }: { productId: string }) {
  const { addToCart } = useCart()
  return <Button onClick={() => addToCart(productId)}>Add to Cart</Button>
}
```

### Layout Components

**Location**: `apps/*/src/components/layout/`

**Rules**:
- App-specific navigation, headers, footers
- Usually Server Components
- Shared layout patterns can be promoted to `packages/ui`

### Providers

**Location**: `apps/*/src/components/providers/`

**Rules**:
- Always Client Components (`'use client'`)
- Follow context interface pattern: `{ state, actions, meta }`
- Provider is the only place that knows how state is managed

```tsx
'use client'

interface CartContextValue {
  state: { items: CartItem[]; total: number }
  actions: { addToCart: (id: string) => void; removeFromCart: (id: string) => void }
  meta: { isLoading: boolean }
}

const CartContext = createContext<CartContextValue | null>(null)
```

## RSC Boundary Rules

| Component Type | Default RSC? | Location |
|---|---|---|
| shadcn primitives | Client | `packages/ui/primitives/` |
| Shared compound | Either | `packages/ui/components/` |
| Feature components | **Server** | `apps/*/components/features/` |
| Feature actions | Client | `apps/*/components/features/*-actions.tsx` |
| Layout components | **Server** | `apps/*/components/layout/` |
| Providers | Client | `apps/*/components/providers/` |

## Import Patterns

### From `packages/ui`

```tsx
// Direct imports (recommended for bundle size)
import { Button } from 'ui/primitives/button'
import { DataTable } from 'ui/components/data-table'

// Or via package entry (configured in package.json exports)
import { Button } from 'ui'
import { DataTable } from 'ui/components'
```

### Within an app

```tsx
// App-specific (path alias)
import { ProductCard } from '@/components/features/product-card'
import { Header } from '@/components/layout/header'
import { CartProvider } from '@/components/providers/cart-provider'
```

### Avoid barrel file re-exports for bundle optimization

```tsx
// ❌ BAD: Re-exporting everything from a barrel
export * from './button'
export * from './input'
export * from './dialog'
// ... 50 more components

// ✅ GOOD: Granular package.json exports
// package.json
{
  "exports": {
    ".": "./src/index.ts",
    "./primitives/*": "./src/primitives/*.tsx",
    "./components/*": "./src/components/*/index.ts"
  }
}
```

## When to Promote a Component

Move a component from `apps/` to `packages/ui` when:

1. **2+ apps need it** — the primary reason
2. **No business logic** — it's purely presentational
3. **Stable API** — the props/interface is unlikely to change frequently
4. **Theme-aware** — uses CSS variables from `ui-theme`, not hardcoded styles

**Promotion checklist**:
- [ ] Remove business logic (data fetching, mutations)
- [ ] Use CSS variables for all colors/spacing
- [ ] Add proper TypeScript types
- [ ] Follow compound component pattern if complex
- [ ] Add to `packages/ui/src/components/`
- [ ] Export via `packages/ui/package.json`
- [ ] Update `transpilePackages` in consuming apps if needed

## Summary

| Component Type | Package | Examples |
|---|---|---|
| Design tokens (CSS) | `packages/ui-theme` | Colors, spacing, typography, themes |
| shadcn primitives | `packages/ui/primitives` | Button, Input, Dialog, Card, Select |
| Shared compounds | `packages/ui/components` | DataTable, FileUpload, Combobox |
| Shared hooks | `packages/ui/hooks` | useMediaQuery, useDebounce |
| Feature components | `apps/*/components/features` | ProductCard, CartDrawer, CheckoutForm |
| Layout components | `apps/*/components/layout` | Header, Footer, Sidebar, Nav |
| Providers | `apps/*/components/providers` | ThemeProvider, CartProvider, AuthProvider |

## References

- [Vercel Composition Patterns](https://skills.sh/vercel-labs/agent-skills/vercel-composition-patterns) — Compound components, avoiding boolean props
- [Vercel React Best Practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices) — Bundle optimization, re-render patterns
- [Next.js Best Practices](https://skills.sh/vercel-labs/next-skills/next-best-practices) — RSC boundaries, bundling, data patterns
