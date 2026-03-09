# Arrow E-commerce Monorepo

A modern, production-ready e-commerce monorepo built with Next.js 16, Turborepo, Tailwind CSS 4, shadcn/ui, PNPM, and Biome.

## 🚀 Tech Stack

- ⚡️ **Next.js 16** - React framework with App Router
- 🔥 **Turbopack** - Next-gen bundler for faster development
- 🏗️ **Turborepo** - High-performance build system for monorepos
- ⚛️ **React 19** - Latest React with server components
- 🎨 **Tailwind CSS 4** - Latest utility-first CSS framework
- 🧩 **shadcn/ui** - Re-usable components built with Radix UI & Tailwind
- 📦 **PNPM** - Fast, disk space efficient package manager
- 🔍 **Biome v2** - Unified linter and formatter (replaces ESLint + Prettier)
- ✨ **Ultracite** - Zero-config tooling wrapper for Biome with optimized presets
- 🧪 **Vitest** - Fast unit test framework
- 🐕 **Husky** - Git hooks for pre-commit checks
- 🚨 **TypeScript** - Type safety across the monorepo

## 📁 Monorepo Structure

```plaintext
arrow-ecommerce/
├── apps/
│   └── web/                 # Next.js e-commerce application
│       ├── src/
│       │   ├── app/         # App router pages
│       │   ├── components/   # App-specific components
│       │   └── lib/         # App utilities
│       ├── components.json  # shadcn/ui config for web app
│       └── package.json
├── packages/
│   ├── ui/                  # Shared UI components (shadcn/ui + custom)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── lib/         # Utilities (cn, etc.)
│   │   │   └── hooks/       # Shared React hooks
|   |   |   └── primatives/  # shadcn base components + custom base components
│   │   ├── components.json  # shadcn/ui config
│   │   └── package.json
│   ├── utils/               # Shared utilities
│   ├── ui-theme/            # Design system with CSS-first Tailwind theme
│   └── config/              # Centralized configurations
│       ├── typescript/      # TypeScript configs (base, nextjs, react-library)
│       └── vitest/          # Vitest test configs with Next.js mocks
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # PNPM workspace configuration
├── biome.json              # Biome linter & formatter config
└── package.json            # Root package.json
```

## 🎯 Getting Started

### Coding Standards and Team Patterns
For in-depth design decisions, architecture patterns, and team conventions, please review our Confluence documentation:

📚 [Team Design Decisions & Patterns](https://toyotafinancial.atlassian.net/wiki/spaces/~7120204247c50333f14156bee901a50c7e3b51/folder/2605023254?atlOrigin=eyJpIjoiOGZhOGE1MmI0YWY2NDgzYzk2YjQ4MDU1ODdjYjFhZjMiLCJwIjoiYyJ9)

### Prerequisites

- Node.js >= 20
- PNPM >= 10

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all apps and packages
pnpm build

# Run tests
pnpm test

# Lint and format
pnpm check
```

## 🧩 Adding shadcn/ui Components

shadcn/ui components are managed in the `packages/ui` package and can be used across all apps.

### Add a new component to the UI package:

```bash
# From packages/ui directory
cd packages/ui
npx shadcn@latest add button

# Or from root
npx shadcn@latest add button --cwd packages/ui
```

### Use in your app:

```tsx
import { Button } from 'ui'

export default function MyComponent() {
  return <Button>Click me</Button>
}
```

## 🛠️ Available Commands

```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all apps and packages
pnpm start            # Start production server

# Code Quality
pnpm check            # Check code for issues (via Ultracite)
pnpm fix              # Auto-fix issues (via Ultracite)
pnpm fix:unsafe       # Apply unsafe fixes
pnpm doctor           # Validate tooling setup
pnpm format           # Format and fix code
pnpm format:check     # Check formatting only
pnpm check:ci         # Check for CI (no modifications)
pnpm type-check       # Type check all packages

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:ui          # Run tests with UI

# Utilities
pnpm clean            # Clean all build artifacts
pnpm gen              # Run Turbo generators
```

## 🤖 AI-Assisted Development

This project is configured with **agent skills** to enhance AI-assisted development with best practices and guidelines.

### Quick Setup

Install recommended agent skills for optimal AI assistance:

```bash
# Install all skills (one command)
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y && \
npx skills add vercel-labs/next-skills@next-best-practices -g -y && \
npx skills add vercel-labs/agent-skills@vercel-composition-patterns -g -y && \
npx skills add vercel-labs/agent-skills@web-design-guidelines -g -y && \
npx skills add vercel-labs/skills@find-skills -g -y
```

### Configured Skills

- **vercel-react-best-practices** - React/Next.js performance optimization (57 rules)
- **next-best-practices** - Next.js framework patterns
- **vercel-composition-patterns** - Component architecture guidelines
- **web-design-guidelines** - UI/UX best practices
- **find-skills** - Discover additional skills

### Configuration Files

- `.clinerules` - Agent skills and project guidelines
- `.cursorrules` - Symlink for Cursor IDE compatibility

These files help AI assistants understand:
- Project structure and tech stack
- Multi-brand theming architecture
- Performance optimization priorities
- Component composition patterns
- Testing and code quality standards

**Learn more**: [docs/AGENT_SKILLS.md](docs/AGENT_SKILLS.md)

## 📦 Packages

### `apps/web`
Main Next.js e-commerce application with App Router.

### `packages/ui`
Shared UI component library with shadcn/ui components and custom components. All UI components are built with:
- Radix UI primitives
- Tailwind CSS for styling
- Class Variance Authority for variants
- TypeScript for type safety

### `packages/utils`
Shared utility functions used across the monorepo.

### `packages/config/*`
Centralized configuration packages for scalable monorepo management:

#### `@arrow/tsconfig`
Shared TypeScript configurations:
- **base.json** - Base config for non-React packages
- **nextjs.json** - Next.js-specific settings with App Router support
- **react-library.json** - React component library configuration

#### `@arrow/ui-theme`
Arrow Design System - CSS-first Tailwind v4 theme:
- **Design Tokens** - Structured color, spacing, and typography tokens
- **Theme Variants** - Light and dark mode support via CSS custom properties
- **Custom Utilities** - Brand-specific utility classes (container-arrow, glass, text-gradient)
- **Zero JS Config** - Pure CSS approach using Tailwind v4's `@theme` directive
- **Runtime Theming** - Dynamic theme switching via CSS variables

**Token Structure:**
```
src/
├── index.css           # Main export
├── tokens/             # Design tokens (colors, spacing, typography)
├── themes/             # Light/dark theme variants
└── utilities/          # Custom utility classes
```

#### `@arrow/vitest-config`
Shared Vitest test configurations:
- **base.ts** - Base test configuration
- **react.ts** - React component testing with jsdom
- **nextjs.ts** - Next.js testing with built-in mocks (router, Image, etc.)
- **test-utils/** - Shared testing utilities and setup

## 🔧 Configuration System

### Centralized Configurations

This monorepo uses a **centralized configuration approach** for scalability and consistency:

#### TypeScript
All packages extend from `@arrow/tsconfig` based on their type:
```json
// For Next.js apps
{
  "extends": "../../packages/config/typescript/nextjs.json"
}

// For React libraries
{
  "extends": "../config/typescript/react-library.json"
}

// For utility packages
{
  "extends": "../config/typescript/base.json"
}
```

#### Tailwind CSS (CSS-First Approach)
Apps import the theme directly in their CSS:
```css
/* app/globals.css */
@import "@arrow/ui-theme";

/* Optional: Override tokens */
@theme {
  --color-primary: 220 70% 50%; /* Custom blue */
}
```

No JavaScript config needed! The `@arrow/ui-theme` package provides:
- All design tokens via `@theme` directive
- Light/dark mode support
- Custom utilities automatically included

#### Testing
Tests use shared Vitest configurations:
```typescript
import { mergeConfig } from 'vitest/config'
import nextjsConfig from '@arrow/vitest-config/nextjs'

export default mergeConfig(nextjsConfig, {
  // App-specific overrides
})
```

### Root Configuration Files

- **biome.json** - Unified linter and formatter config (with Ultracite presets)
- **turbo.json** - Turborepo pipeline configuration
- **pnpm-workspace.yaml** - PNPM workspace setup
- **.husky/** - Git hooks configuration

### Why Biome + Ultracite?

This project uses **Biome v2** with **Ultracite** for optimal developer experience:

#### Biome Benefits:
- ⚡ **3x faster** than ESLint + Prettier combined
- 🎯 **Single tool** for both linting and formatting
- 🔋 **Better TypeScript support** and error messages
- 🚀 **Modern** - built in Rust for performance

#### Ultracite Enhancements:
- ✨ **Zero-config presets** for Next.js, React, and more
- 🔧 **Unified CLI** - works seamlessly across different linters
- 🎨 **IDE integration** - auto-format on save via VS Code settings
- 📦 **Framework-aware** - optimized rules for your stack
- 🏥 **Health checks** - `doctor` command validates your setup

```bash
# Check for issues (read-only)
pnpm check

# Auto-fix issues
pnpm fix

# Apply unsafe fixes (may change behavior)
pnpm fix:unsafe

# Validate tooling setup
pnpm doctor
```

### Ultracite Presets

The `biome.json` extends these Ultracite presets:
- `ultracite/biome/core` - Core Biome rules
- `ultracite/biome/next` - Next.js-specific rules
- `ultracite/biome/react` - React best practices

These presets are maintained and updated by Ultracite, ensuring you always have optimal configurations.

## 🎨 Styling

This project uses Tailwind CSS 4 with CSS variables for theming. The theme is defined in `apps/web/src/app/globals.css` and can be easily customized.

Theme variables:
- Support for light/dark mode
- HSL color system
- Border radius variables
- Custom chart colors

## 📦 Adding a New Package

When creating a new package, leverage the centralized configs:

### 1. Create Package Structure
```bash
mkdir -p packages/my-package/src
cd packages/my-package
```

### 2. Setup package.json
```json
{
  "name": "my-package",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "devDependencies": {
    "@arrow/tsconfig": "workspace:*",
    "typescript": "^5.7.2"
  }
}
```

### 3. Extend TypeScript Config
```json
// tsconfig.json
{
  "extends": "../config/typescript/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

### 4. Add to Turbo Tasks
Update `turbo.json` to include your package in build/test pipelines.

### 5. Install Dependencies
```bash
pnpm install
```

## 🧪 Testing

Tests use **Vitest** with centralized configurations and utilities from `@arrow/vitest-config`:

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# With UI
pnpm test:ui
```

### Writing Tests

Import test utilities from the shared package:

```typescript
import { render, screen, userEvent, describe, it, expect } from '@arrow/vitest-config/test-utils'

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

**Built-in Next.js Mocks:**
- `next/navigation` (useRouter, usePathname, useSearchParams, etc.)
- `next/image` (Image component)
- `window.matchMedia`
- `IntersectionObserver`

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set the root directory to `apps/web`
3. Vercel will automatically detect Next.js and configure build settings

### Other Platforms

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📝 Environment Variables

Create `.env.local` in `apps/web/` for local development:

```env
# Example environment variables
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
```

See `apps/web/.env.local.example` for all available variables.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm fix` to auto-fix issues
4. Run `pnpm test` to ensure tests pass
5. Run `pnpm doctor` to validate setup (optional)
6. Commit your changes (husky will run pre-commit checks)
7. Push and create a Pull Request

### Pre-commit Hooks

Husky is configured to run on every commit:
- **Format & fix** - Ultracite auto-fixes your staged files
- **Type check** - Ensures TypeScript compilation
- **Tests** - Runs related tests for changed files

If pre-commit checks fail, fix the issues and try again.

## 📄 License

MIT

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Turborepo](https://turbo.build/repo)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Biome](https://biomejs.dev/)
- [Ultracite](https://docs.ultracite.ai/)
- [Vitest](https://vitest.dev/)
