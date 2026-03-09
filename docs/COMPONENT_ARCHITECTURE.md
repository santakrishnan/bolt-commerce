# Component Architecture Guide

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
