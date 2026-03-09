# @tfs-ucmp/ui-theme

CSS-only design tokens and themes for the Arrow monorepo. Built with Tailwind CSS v4.

## Features

- Pure CSS design tokens (no JavaScript)
- Multiple theme support (Arrow, Acme)
- Tailwind CSS v4 `@theme` directive
- Dark mode support
- Decoupled architecture - apps choose their theme

## Installation

```bash
pnpm add @tfs-ucmp/ui-theme
```

## Usage

### Option 1: Base Theme Only (No shadcn)

For apps that don't use shadcn/ui pattern:

```css
/* app/globals.css */
@import "@tfs-ucmp/ui-theme";

@theme inline {
  /* Define colors directly */
  --color-primary: #eb0a1e;
  --color-secondary: #f4f4f5;
}
```

### Option 2: Base + Arrow Theme (With shadcn)

For apps using shadcn/ui pattern with HSL color variables:

```css
/* app/globals.css */
@import "@tfs-ucmp/ui-theme";
@import "@tfs-ucmp/ui-theme/themes/arrow";

@layer base {
  :root {
    /* Define colors in shadcn format */
    --primary: 354 91% 48%;
    --primary-foreground: 0 0% 100%;
  }
}

@theme inline {
  /* Just fonts */
  --font-sans: var(--font-my-app), system-ui, sans-serif;
}
```

Arrow theme automatically maps shadcn variables to Tailwind utilities!

### Option 3: Base + Acme Theme

```css
/* app/globals.css */
@import "@tfs-ucmp/ui-theme";
@import "@tfs-ucmp/ui-theme/themes/acme";

@layer base {
  :root {
    --primary: 271 91% 65%;  /* Purple */
  }
}
```

## Available Imports

```css
/* Base theme only */
@import "@tfs-ucmp/ui-theme";

/* Individual themes */
@import "@tfs-ucmp/ui-theme/themes/arrow";
@import "@tfs-ucmp/ui-theme/themes/acme";

/* Or import base explicitly */
@import "@tfs-ucmp/ui-theme/base";
```

## What Each Theme Provides

### Base Theme (`@tfs-ucmp/ui-theme`)

**Provides:**
- Design tokens (spacing, shadows, font sizes, line heights)
- Base color defaults
- Dark mode defaults
- Typography scale
- Animation timings

**Does NOT provide:**
- Brand-specific colors
- shadcn color mapping

**Use when:**
- You want full control over colors
- You're not using shadcn/ui pattern
- You want to define colors directly

### Arrow Theme (`@tfs-ucmp/ui-theme/themes/arrow`)

**Provides:**
- Arrow brand colors (blue primary)
- shadcn color mapping (HSL → Tailwind)
- Custom radius values

**Use when:**
- You're using shadcn/ui components
- You want to define colors in `:root` with HSL format
- You want `className="bg-primary"` to work with shadcn variables

### Acme Theme (`@tfs-ucmp/ui-theme/themes/acme`)

**Provides:**
- Acme brand colors (purple primary)
- shadcn color mapping
- Custom radius values

**Use when:**
- Building Acme-branded apps
- Using shadcn/ui pattern

## Font Integration

The theme package is font-agnostic. Apps define their own fonts using Next.js `next/font`:

```typescript
// app/lib/fonts.ts
import localFont from 'next/font/local'

export const myFont = localFont({
  src: './fonts/MyFont.woff2',
  variable: '--font-my-app',
  display: 'swap',
})

// app/layout.tsx
import { myFont } from './lib/fonts'

export default function RootLayout({ children }) {
  return (
    <html className={myFont.variable}>
      <body>{children}</body>
    </html>
  )
}

// app/globals.css
@theme inline {
  --font-sans: var(--font-my-app), system-ui, sans-serif;
}
```

## Design Tokens

### Colors
All themes provide these color tokens:
- `--color-background`, `--color-foreground`
- `--color-primary`, `--color-primary-foreground`
- `--color-secondary`, `--color-secondary-foreground`
- `--color-muted`, `--color-muted-foreground`
- `--color-accent`, `--color-accent-foreground`
- `--color-destructive`, `--color-destructive-foreground`
- `--color-border`, `--color-input`, `--color-ring`

### Typography
- Font sizes: `--font-size-xs` through `--font-size-4xl`
- Line heights: `--line-height-tight`, `--line-height-normal`, `--line-height-relaxed`

### Spacing
- `--spacing-0` through `--spacing-16`

### Border Radius
- `--radius-sm`, `--radius-base`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`

### Shadows
- `--shadow-sm`, `--shadow-base`, `--shadow-md`, `--shadow-lg`

### Animation
- `--transition-fast`, `--transition-base`, `--transition-slow`

## Tailwind CSS Integration

All design tokens are automatically available as Tailwind utilities:

```jsx
<div className="bg-background text-foreground">
  <h1 className="text-primary font-sans text-2xl">Hello World</h1>
  <p className="text-muted-foreground">Subtitle</p>
</div>
```

## Creating Custom Themes

1. Create a new theme directory: `themes/your-theme/`
2. Add an `index.css` file:

```css
/* themes/your-theme/index.css */
@theme {
  /* Brand colors */
  --color-primary: #your-color;
  --color-primary-foreground: #ffffff;
}

/* Optional: shadcn mapping */
@theme {
  --color-primary: var(--primary, var(--color-primary));
  --color-foreground: var(--foreground, var(--color-foreground));
  /* ... other mappings */
}
```

3. Export in `package.json`:

```json
{
  "exports": {
    "./themes/your-theme": "./themes/your-theme/index.css"
  }
}
```

4. Use in apps:

```css
@import "@tfs-ucmp/ui-theme";
@import "@tfs-ucmp/ui-theme/themes/your-theme";
```

## Dark Mode

Dark mode tokens are automatically applied via `prefers-color-scheme: dark` media query. The theme system handles this automatically.

## Architecture

```
@tfs-ucmp/ui-theme
├── base/
│   └── index.css          # Base design tokens (generic)
├── themes/
│   ├── arrow/
│   │   └── index.css      # Arrow brand + shadcn mapping
│   └── acme/
│       └── index.css      # Acme brand + shadcn mapping
└── index.css              # Main entry (base only)
```

**Key principle:** The main export (`@tfs-ucmp/ui-theme`) only includes base tokens. Apps explicitly choose which theme to use.

## Examples

### Example 1: Web App (shadcn + ToyotaType font)

```css
/* apps/web/src/app/globals.css */
@import "@tfs-ucmp/ui-theme";
@import "@tfs-ucmp/ui-theme/themes/arrow";

@layer base {
  :root {
    --primary: 354 91% 48%;  /* Red */
  }
}

@theme inline {
  --font-sans: var(--font-toyota-type), system-ui, sans-serif;
}
```

### Example 2: Admin App (direct colors + Inter font)

```css
/* apps/admin/src/app/globals.css */
@import "@tfs-ucmp/ui-theme";

@theme inline {
  --color-primary: #2563eb;  /* Blue */
  --font-sans: var(--font-inter), system-ui, sans-serif;
}
```

### Example 3: Marketing App (Acme theme)

```css
/* apps/marketing/src/app/globals.css */
@import "@tfs-ucmp/ui-theme";
@import "@tfs-ucmp/ui-theme/themes/acme";

@layer base {
  :root {
    --primary: 271 91% 65%;  /* Purple */
  }
}

@theme inline {
  --font-sans: var(--font-brand), system-ui, sans-serif;
}
```

## Benefits

✅ **Decoupled**: Apps choose their theme
✅ **Flexible**: Works with shadcn or direct colors
✅ **Modular**: Import only what you need
✅ **Scalable**: Easy to add new themes
✅ **Type-safe**: CSS variables with fallbacks

## Peer Dependencies

- `tailwindcss: ^4.0.0`

## License

Proprietary - Toyota Financial Services
