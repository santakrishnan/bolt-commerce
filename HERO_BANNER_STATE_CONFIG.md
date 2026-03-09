# Hero Banner State-Based Configuration

## Overview

The landing page hero banner displays a static background image that varies based on the user's selected USA state. The state selection is managed through the header's LocationBlock component, which stores the user's choice in a cookie.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              1. State Configuration File                         │
│           (src/data/state-hero-config.json)                      │
│  {                                                               │
│    "defaultState": "TX",                                         │
│    "states": {                                                   │
│      "TX": {                                                     │
│        "backgroundImage": "/images/heroes/...",                  │
│        "zipCode": "75001"                                        │
│      }                                                           │
│    }                                                             │
│  }                                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│         2. LocationBlock Component (Header)                      │
│                                                                  │
│  - User selects state from dropdown                             │
│  - Stores selection in cookie: userState=TX                     │
│  - Cookie expires in 365 days                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│         3. HomeHeroStatic Component (Client)                     │
│                                                                  │
│  - Reads userState cookie via js-cookie                         │
│  - Looks up background image from config                        │
│  - Displays static image with overlay                           │
│  - Polls cookie every 1s for changes                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Configuration File

### Location
`apps/web/src/data/state-hero-config.json`

### Structure
```json
{
  "defaultState": "TX",
  "states": {
    "TX": {
      "backgroundImage": "/images/heroes/Carousel-image-1.png",
      "zipCode": "75001",
      "description": "Plano, TX 75001"
    },
    "FL": {
      "backgroundImage": "/images/heroes/Carousel-image-2.png",
      "zipCode": "33101",
      "description": "Miami, FL 33101"
    },
    "CA": {
      "backgroundImage": "/images/heroes/Carousel-image-3.png",
      "zipCode": "90001",
      "description": "Los Angeles, CA 90001"
    }
  }
}
```

### Properties

- **defaultState**: The state code to use if no cookie is set or state is not found
- **states**: Object mapping state codes to their configuration
  - **backgroundImage**: Path to hero image (relative to public folder)
  - **zipCode**: Representative zip code for the state
  - **description**: Display text for the location

---

## Adding a New State

### Step 1: Add State Configuration

Edit `apps/web/src/data/state-hero-config.json`:

```json
{
  "defaultState": "TX",
  "states": {
    "TX": { ... },
    "FL": { ... },
    "CA": { ... },
    "NY": {
      "backgroundImage": "/images/heroes/hero-ny.png",
      "zipCode": "10001",
      "description": "New York, NY 10001"
    }
  }
}
```

### Step 2: Add Hero Image

Place the image file in:
```
apps/web/public/images/heroes/hero-ny.png
```

### Step 3: Update LocationBlock City Mapping

Edit `apps/web/src/components/layout/header/location-block.tsx`:

```typescript
const cityMap: Record<StateKey, string> = {
  TX: "Addison",
  FL: "Miami",
  CA: "Los Angeles",
  NY: "New York", // Add new state
};
```

### Step 4: Test

1. Start dev server: `pnpm dev`
2. Click location dropdown in header
3. Select "New York, NY 10001"
4. Hero background should change to NY image

---

## How It Works

### State Selection (LocationBlock)

1. User clicks location in header
2. Dropdown shows all states from config
3. User selects a state
4. Cookie is set: `userState=NY` (365 day expiry)
5. Console logs: `[LocationBlock] userState cookie set (client): NY`

### Hero Image Update (HomeHeroStatic)

1. Component mounts and reads `userState` cookie
2. Looks up state in `state-hero-config.json`
3. Displays `backgroundImage` for that state
4. Polls cookie every 1 second for changes
5. Updates image dynamically when state changes
6. Console logs: `[HomeHeroStatic] Background image set for state NY: /images/heroes/hero-ny.png`

---

## Image Requirements

### Recommended Specs

- **Format**: PNG or JPG
- **Dimensions**: 1920x1080 minimum (16:9 aspect ratio)
- **Size**: Optimized for web (< 500KB recommended)
- **Content**: Should have good contrast for text overlay
- **Focus**: Center or left-aligned (text appears on left)

### File Naming Convention

```
hero-{state-code}.png
```

Examples:
- `hero-tx.png`
- `hero-fl.png`
- `hero-ca.png`

---

## Components

### HomeHeroStatic
**Location**: `apps/web/src/components/features/landing/home-hero/home-hero-static.tsx`

**Purpose**: Client component that displays state-based hero image

**Features**:
- Reads `userState` cookie
- Loads background image from config
- Auto-updates when cookie changes
- Includes dark overlay for text readability

### HomeHero
**Location**: `apps/web/src/components/features/landing/home-hero/home-hero.tsx`

**Purpose**: Server component wrapper for hero section

**Structure**:
- Background: `<HomeHeroStatic />`
- Content: Title, Search, Stats

### LocationBlock
**Location**: `apps/web/src/components/layout/header/location-block.tsx`

**Purpose**: State selection dropdown in header

**Cookie Management**:
- Cookie name: `userState`
- Cookie value: State code (e.g., "TX")
- Cookie library: `js-cookie`
- Cookie lifetime: 365 days

---

## Future Enhancements

### Geo-Location Integration (Planned)

In a future story, automatic state detection will be added:

```typescript
// Future implementation
useEffect(() => {
  async function detectLocation() {
    const geo = await getGeoLocation();
    const state = mapCoordinatesToState(geo);
    Cookies.set("userState", state);
  }
  detectLocation();
}, []);
```

This will:
- Detect user's location via IP or browser geolocation
- Automatically set the state cookie
- Keep manual override option

---

## Troubleshooting

### Image Not Showing

1. Check image file exists:
   ```
   apps/web/public/images/heroes/[image-file]
   ```

2. Verify path in config (no leading `public/`):
   ```json
   "backgroundImage": "/images/heroes/hero-tx.png"
   ```

3. Check browser console for 404 errors

### State Not Changing

1. Open browser DevTools → Application → Cookies
2. Find `userState` cookie
3. Verify value matches state code
4. Check console for logs:
   ```
   [LocationBlock] userState cookie set (client): TX
   [HomeHeroStatic] Background image updated for state TX: /images/heroes/...
   ```

### Cookie Not Persisting

1. Ensure `secure: true` is removed for local development:
   ```typescript
   Cookies.set("userState", state, {
     expires: 365,
     path: "/",
     // secure: true // Remove for localhost
   });
   ```

2. Check if cookies are enabled in browser

---

## Testing

### Manual Test Cases

1. **Default State**
   - Clear cookies
   - Reload page
   - Should show TX hero image

2. **State Selection**
   - Click location dropdown
   - Select FL
   - Hero should change to FL image
   - Cookie should be set

3. **State Persistence**
   - Select CA
   - Refresh page
   - Should still show CA image

4. **Invalid State Handling**
   - Manually set cookie to invalid state: `userState=ZZ`
   - Should fallback to default state (TX)

---

## Files Modified

- ✅ `apps/web/src/data/state-hero-config.json` - State configuration
- ✅ `apps/web/src/components/features/landing/home-hero/home-hero-static.tsx` - New static hero component
- ✅ `apps/web/src/components/features/landing/home-hero/home-hero.tsx` - Updated to use static component
- ⚠️ `apps/web/src/components/features/landing/home-hero/home-hero-carousel.tsx` - No longer used (can be removed)
- ✅ `apps/web/src/components/layout/header/location-block.tsx` - Existing cookie management

---

## Acceptance Criteria - Status

- ✅ Hero banner slider removed
- ✅ Static background image based on state
- ✅ Configuration file with state-to-image mapping
- ✅ No geo-location integration (future story)
- ✅ Easy future integration (cookie-based approach)
- ✅ Correct image loads per config
- ✅ Support for TX, FL, CA states
- ✅ Documentation provided

---

**Last Updated**: 2026-02-25
