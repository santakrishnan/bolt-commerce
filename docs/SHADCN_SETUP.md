# shadcn/ui Configuration Guide

## Overview

This monorepo uses a centralized approach for shadcn/ui components. All shadcn/ui components are stored in the `packages/ui` package and can be imported by any app in the monorepo.

## Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   └── ui/              # shadcn/ui components go here
│   │       ├── button.tsx   # Example: Button component
│   │       └── index.ts     # Export all UI components
│   ├── lib/
│   │   └── utils.ts         # cn() utility and other helpers
│   ├── hooks/
│   │   └── index.ts         # Shared React hooks
│   └── index.ts             # Main export file
├── components.json          # shadcn/ui configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Adding New shadcn/ui Components

### Method 1: From Root Directory

```bash
pnpm ui:add <component-name>
```

Example:
```bash
pnpm ui:add card
pnpm ui:add dialog
pnpm ui:add dropdown-menu
```

### Method 2: From packages/ui Directory

```bash
cd packages/ui
pnpm add <component-name>
```

### Method 3: Direct npx

```bash
npx shadcn@latest add <component-name> --cwd packages/ui
```

## Using Components in Apps

### Import from the ui package:

```tsx
// Import individual components
import { Button } from 'ui'
import { Card, CardContent, CardHeader } from 'ui'

// Import utilities
import { cn } from 'ui'

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <h2>Hello World</h2>
      </CardHeader>
      <CardContent>
        <Button className={cn('custom-class')}>
          Click me
        </Button>
      </CardContent>
    </Card>
  )
}
```

## Configuration Files

### packages/ui/components.json
Defines how shadcn/ui components are generated:
- Components are created in `src/components/ui/`
- Uses the "new-york" style
- TypeScript with TSX
- RSC (React Server Components) enabled
- Tailwind CSS with CSS variables

### apps/web/components.json
Points to the packages/ui directory for component installation from the web app:
- Components path: `../../packages/ui/src/components`
- Utils path: `../../packages/ui/src/lib/utils`

## Available Components (Currently Installed)

- ✅ **Button** - Button component with variants (default, destructive, outline, secondary, ghost, link)

## Creating Custom Components

Custom components should also go in `packages/ui/src/components/`:

```tsx
// packages/ui/src/components/custom-card.tsx
import { cn } from '../lib/utils'

interface CustomCardProps {
  className?: string
  children: React.ReactNode
}

export function CustomCard({ className, children }: CustomCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      {children}
    </div>
  )
}
```

Then export it from `packages/ui/src/components/index.ts`:

```tsx
export * from './custom-card'
```

## TypeScript Paths

The monorepo is configured with TypeScript path aliases:

### In apps/web/tsconfig.json:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "ui": ["../../packages/ui/src"]
    }
  }
}
```

This allows you to:
- Import from `ui` package: `import { Button } from 'ui'`
- Import app-specific code: `import { api } from '@/lib/api'`

## Styling

All components use Tailwind CSS with CSS variables defined in `apps/web/src/app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  /* ... more variables */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... dark mode variables */
}
```

## Best Practices

1. **Keep UI components in packages/ui**: All reusable UI components should live in the ui package
2. **App-specific components in apps/**: Components specific to an app go in `apps/web/src/components/`
3. **Export properly**: Always export new components through the appropriate index.ts files
4. **Use cn() utility**: For conditional classNames, use the `cn()` utility function
5. **TypeScript**: Add proper TypeScript types for all components
6. **RSC compatible**: Keep components server-component compatible unless they need client interactivity (add 'use client' when needed)

## Troubleshooting

### Component not found
Make sure the component is exported in `packages/ui/src/components/ui/index.ts`:
```tsx
export * from './button'
export * from './card'
```

### Type errors
Run type check:
```bash
pnpm type-check
```

### Styling issues
1. Verify CSS variables are defined in `apps/web/src/app/globals.css`
2. Check that the theme is properly imported via `@import "@arrow/ui-theme"`

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Class Variance Authority](https://cva.style/)
