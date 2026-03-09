# ui

Shared React components library for the Arrow monorepo.

## Structure

- `primitives/` - shadcn/ui components (Button, Input, Dialog, Card, Select, DropdownMenu)
- `components/` - Custom shared components (DataTable, Combobox, FileUpload)
- `hooks/` - Shared React hooks (useMediaQuery, useDebounce)
- `lib/` - Utility functions

## Usage

```tsx
// Direct imports (recommended)
import { Button } from 'ui/primitives/button'
import { DataTable } from 'ui/components/data-table'
import { useMediaQuery } from 'ui/hooks/use-media-query'

// Or via package entry
import { Button, DataTable, useMediaQuery } from 'ui'
```

## Features

- React 19 patterns (ref as prop, use() instead of useContext)
- CVA for variants
- Compound component pattern
- TypeScript support
- Server and Client Components
