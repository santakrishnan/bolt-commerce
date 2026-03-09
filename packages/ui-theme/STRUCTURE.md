# Theme Package Structure

## Overview

The theme package is organized for maximum scalability and maintainability, with clear separation between base tokens, theme overrides, and color modes.

## Directory Structure

```
packages/ui-theme/
├── base/
│   ├── tokens/
│   │   ├── breakpoints.css    # Screen sizes and containers
│   │   ├── colors.css         # Base semantic colors
│   │   ├── radius.css         # Border radius scale
│   │   ├── shadows.css        # Shadow scale
│   │   ├── spacing.css        # Spacing scale
│   │   ├── typography.css     # Font sizes, weights, line heights
│   │   └── index.css          # Barrel export + animations
│   └── index.css              # Base theme entry
│
├── themes/
│   ├── arrow/
│   │   ├── overrides/
│   │   │   ├── colors.css     # Arrow brand colors
│   │   │   ├── typography.css # Typography overrides
│   │   │   ├── radius.css     # Radius overrides
│   │   │   └── index.css      # Barrel export
│   │   ├── light.css          # Light mode colors
│   │   ├── dark.css           # Dark mode colors
│   │   └── index.css          # Arrow theme entry
│   │
│   └── acme/
│       ├── overrides/
│       │   ├── colors.css     # Acme brand colors
│       │   ├── typography.css # Typography overrides
│       │   ├── radius.css     # Radius overrides
│       │   └── index.css      # Barrel export
│       ├── light.css          # Light mode colors
│       ├── dark.css           # Dark mode colors
│       └── index.css          # Acme theme entry
│
├── index.css                  # Main entry (base only)
├── package.json               # Exports configuration
├── README.md                  # Usage documentation
└── STRUCTURE.md               # This file
```

## File Responsibilities

### Base Theme

#### `base/tokens/`
Individual token files for easy maintenance:

- **breakpoints.css**: Responsive breakpoints and container widths
- **colors.css**: Base semantic color palette
- **radius.css**: Border radius scale
- **shadows.css**: Box shadow scale
- **spacing.css**: Spacing/sizing scale
- **typography.css**: Font sizes, weights, line heights, letter spacing
- **index.css**: Imports all tokens + defines animations

#### `base/index.css`
- Imports Tailwind CSS
- Imports all tokens
- Defines dark mode defaults
- Sets base styles

### Theme Overrides

#### `themes/{theme}/overrides/`
Brand-specific customizations:

- **colors.css**: Brand color overrides
- **typography.css**: Font customizations
- **radius.css**: Border radius adjustments
- **index.css**: Barrel export

#### `themes/{theme}/light.css`
Light mode color definitions for the theme

#### `themes/{theme}/dark.css`
Dark mode color definitions for the theme

#### `themes/{theme}/index.css`
- Imports overrides
- Imports light/dark modes
- Defines shadcn color mapping

## Design Principles

### 1. Token Organization
Each token category in its own file for:
- Easy maintenance
- Clear ownership
- Selective imports (if needed)

### 2. Theme Layering
```
Base Tokens (generic)
  ↓
Theme Overrides (brand-specific)
  ↓
Light/Dark Modes (color schemes)
  ↓
shadcn Mapping (pattern support)
```

### 3. Separation of Concerns
- **Base**: Generic, works for everyone
- **Overrides**: Brand-specific changes
- **Light/Dark**: Color mode variations
- **Mapping**: Pattern support (shadcn)

### 4. Scalability
Easy to:
- Add new tokens (new file in tokens/)
- Add new themes (new folder in themes/)
- Override specific tokens (theme overrides/)
- Support new patterns (theme index.css)

## Usage Examples

### Import Base Only
```css
@import "@tfs-ucmp/ui-theme";
```
Gets: All base tokens, no theme overrides

### Import Base + Arrow Theme
```css
@import "@tfs-ucmp/ui-theme";
@import "@tfs-ucmp/ui-theme/themes/arrow";
```
Gets: Base tokens + Arrow brand + shadcn mapping

### Import Base + Acme Theme
```css
@import "@tfs-ucmp/ui-theme";
@import "@tfs-ucmp/ui-theme/themes/acme";
```
Gets: Base tokens + Acme brand + shadcn mapping

## Adding New Tokens

### 1. Create Token File
```css
/* base/tokens/new-token.css */
@theme {
  --new-token-sm: value;
  --new-token-md: value;
  --new-token-lg: value;
}
```

### 2. Import in Barrel
```css
/* base/tokens/index.css */
@import "./new-token.css";
```

### 3. Use in Apps
```jsx
<div className="new-token-md">Content</div>
```

## Adding New Themes

### 1. Create Theme Directory
```
themes/new-brand/
├── overrides/
│   ├── colors.css
│   ├── typography.css
│   ├── radius.css
│   └── index.css
├── light.css
├── dark.css
└── index.css
```

### 2. Define Overrides
```css
/* themes/new-brand/overrides/colors.css */
@theme {
  --color-primary: #your-color;
  --color-primary-foreground: #ffffff;
}
```

### 3. Define Light Mode
```css
/* themes/new-brand/light.css */
@theme {
  --color-primary: #your-color;
  /* ... all semantic colors */
}
```

### 4. Define Dark Mode
```css
/* themes/new-brand/dark.css */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-primary: #your-dark-color;
    /* ... all semantic colors */
  }
}
```

### 5. Create Theme Entry
```css
/* themes/new-brand/index.css */
@import "./overrides/index.css";
@import "./light.css";
@import "./dark.css";

/* Optional: shadcn mapping */
@theme {
  --color-primary: var(--primary, var(--color-primary));
  /* ... */
}
```

### 6. Export in package.json
```json
{
  "exports": {
    "./themes/new-brand": "./themes/new-brand/index.css"
  }
}
```

### 7. Use in Apps
```css
@import "@tfs-ucmp/ui-theme";
@import "@tfs-ucmp/ui-theme/themes/new-brand";
```

## Overriding Tokens in Themes

### Override Colors
```css
/* themes/arrow/overrides/colors.css */
@theme {
  --color-primary: #2563eb;  /* Override base */
}
```

### Override Typography
```css
/* themes/arrow/overrides/typography.css */
@theme {
  --font-size-base: 1.125rem;  /* Larger base font */
}
```

### Override Radius
```css
/* themes/arrow/overrides/radius.css */
@theme {
  --radius-base: 0.75rem;  /* Rounder corners */
}
```

## Benefits

### For Maintainers
- ✅ Clear file organization
- ✅ Easy to find and update tokens
- ✅ Minimal file sizes
- ✅ Clear ownership

### For Theme Creators
- ✅ Clear override pattern
- ✅ Separate light/dark modes
- ✅ Easy to add new themes
- ✅ Consistent structure

### For App Developers
- ✅ Clear imports
- ✅ Predictable behavior
- ✅ Easy to switch themes
- ✅ Well-documented

## Summary

This structure provides:
- **Scalability**: Easy to add tokens and themes
- **Maintainability**: Clear organization and ownership
- **Flexibility**: Override what you need, keep what you don't
- **Clarity**: Obvious file purposes and relationships

The pattern scales from simple apps (base only) to complex multi-brand systems (base + multiple themes).
