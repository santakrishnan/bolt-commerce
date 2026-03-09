# @tfs-ucmp/shared

Shared services, providers, utilities, and hooks for the Arrow monorepo.

## Installation

The package is automatically available to apps in the monorepo. Add it as a dependency:

```json
{
  "dependencies": {
    "@tfs-ucmp/shared": "workspace:*"
  }
}
```

Then run `pnpm install` from the root.

## Usage

### Full Import

```typescript
import { debounce, useLocalStorage, AuthProvider } from '@tfs-ucmp/shared'
```

### Targeted Imports (Tree-shakeable)

```typescript
import { ApiService } from '@tfs-ucmp/shared/services'
import { AuthProvider, useAuth } from '@tfs-ucmp/shared/providers'
import { debounce, throttle } from '@tfs-ucmp/shared/utils'
import { useLocalStorage } from '@tfs-ucmp/shared/hooks'
import type { ServiceConfig, Result } from '@tfs-ucmp/shared/types'
```

## Package Structure

```
packages/shared/
├── src/
│   ├── index.ts          # Main entry - re-exports all modules
│   ├── services/         # API clients, data services, caching
│   │   └── index.ts
│   ├── providers/        # React context providers
│   │   └── index.ts
│   ├── utils/            # Pure utility functions
│   │   └── index.ts
│   ├── hooks/            # Reusable React hooks
│   │   └── index.ts
│   └── types/            # Shared TypeScript types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Guidelines

### Services (`/services`)

Services are framework-agnostic classes or functions for business logic.

```typescript
// services/api-service.ts
export interface ApiServiceConfig {
  baseUrl: string
  timeout?: number
}

export class ApiService {
  constructor(private config: ApiServiceConfig) {}

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`)
    return response.json()
  }
}

// Factory function for easier testing
export function createApiService(config: ApiServiceConfig): ApiService {
  return new ApiService(config)
}
```

**Best Practices:**
- Keep services framework-agnostic (no React imports)
- Use dependency injection for testability
- Export both class and factory function
- Handle errors consistently with `Result<T, E>` type

### Providers (`/providers`)

React context providers following React 19 patterns.

```typescript
// providers/auth-provider.tsx
'use client'

import { createContext, use, useCallback, useState } from 'react'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

interface AuthActions {
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

interface AuthMeta {
  isLoading: boolean
  error: Error | null
}

interface AuthContextValue {
  state: AuthState
  actions: AuthActions
  meta: AuthMeta
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Implementation...
}

export function useAuth(): AuthContextValue {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

**Best Practices:**
- Follow `state/actions/meta` pattern for context values
- Include `"use client"` directive
- Export both Provider and hook
- Use `use()` hook (React 19) instead of `useContext()`
- Make providers configurable via props

### Utils (`/utils`)

Pure utility functions with no side effects.

```typescript
// utils/timing.ts
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
```

**Best Practices:**
- Keep functions pure (no side effects)
- Use TypeScript generics for flexibility
- Document edge cases with JSDoc
- Export individual functions (tree-shaking)

### Hooks (`/hooks`)

Reusable React hooks.

```typescript
// hooks/use-local-storage.ts
'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}
```

**Best Practices:**
- Follow `useXxx` naming convention
- Include `"use client"` for client-side hooks
- Handle cleanup in `useEffect`
- Document return types and dependencies

### Types (`/types`)

Shared TypeScript types and interfaces.

```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError }
```

**Best Practices:**
- Use `interface` for object shapes (extendable)
- Use `type` for unions/intersections
- Export with `export type` when appropriate
- Group related types together

## What Belongs in Shared vs. App-Specific

### Put in `@tfs-ucmp/shared`:
- ✅ Authentication/authorization logic
- ✅ API client services
- ✅ Feature flag infrastructure
- ✅ Analytics tracking service
- ✅ Common form validation
- ✅ Currency/date formatting (locale-aware)
- ✅ Error boundary providers
- ✅ Generic React hooks (useDebounce, useMediaQuery)

### Keep App-Specific:
- ❌ Business domain logic unique to one app
- ❌ Route-specific providers
- ❌ Page-level components
- ❌ App configuration/environment
- ❌ Domain-specific types (e.g., Vehicle types for web app)

## Adding New Modules

1. Create the file in the appropriate directory
2. Export from the directory's `index.ts`
3. Add export path to `package.json` exports if needed
4. Update this README with usage examples
5. Run `pnpm type-check` to verify

## Scripts

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Clean build artifacts
pnpm clean
```

## Dependencies

This package has minimal dependencies. Peer dependencies:
- `react` ^19.0.0
- `react-dom` ^19.0.0

Add new dependencies only when absolutely necessary.
