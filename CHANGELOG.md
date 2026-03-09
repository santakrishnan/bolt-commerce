# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-02-10

### Added
- Initial monorepo setup with Turborepo and PNPM workspaces
- Next.js 16 application with App Router
- CSS-first design system (`@arrow/ui-theme`) with Tailwind CSS v4
- Centralized configuration packages:
  - `@arrow/tsconfig` - TypeScript configurations
  - `@arrow/vitest-config` - Testing configurations
- shadcn/ui component library in `packages/ui`
- Biome v2 + Ultracite for linting and formatting
- Nested Biome configs for monorepo scalability
- Husky pre-commit hooks for code quality
- Vitest + React Testing Library for testing
- Comprehensive README and documentation
- CI/CD workflow with GitHub Actions
- Renovate configuration for automated dependency updates
- Security policy and contributing guidelines
- MIT License

### Features
- 🎨 Design tokens (colors, spacing, typography)
- 🌓 Light/dark theme support
- 🛠️ Custom utility classes (glassmorphism, gradients, shadows)
- 🧪 Testing infrastructure with Next.js mocks
- 📦 Workspace protocol for internal dependencies
- 🔧 EditorConfig and VS Code settings

### Developer Experience
- Hot module replacement with Turbopack
- Type-safe development with strict TypeScript
- Fast builds with Turborepo caching
- Git hooks for pre-commit quality checks
- Automated formatting and linting

[Unreleased]: https://github.com/SANTHAV1_tmcc/arrow-ecommerce/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/SANTHAV1_tmcc/arrow-ecommerce/releases/tag/v1.0.0
