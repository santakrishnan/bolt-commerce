# Feature Flags Documentation

## Overview

This document explains the feature flag system used to control user experiences on the landing page, My Garage page, and GarageInfoCards. The system allows testing different user scenarios and personalizing content based on user state.

## Table of Contents

- [Feature Flag Configuration](#feature-flag-configuration)
- [User States](#user-states)
- [Landing Page Behavior](#landing-page-behavior)
- [My Garage Page](#my-garage-page)
- [GarageInfoCards](#garageinfocards)
- [Testing with Debug Panel](#testing-with-debug-panel)

---

## Feature Flag Configuration

### Location
- **Config File**: `apps/web/src/lib/flags/config.ts`
- **Server Functions**: `apps/web/src/lib/flags/flags.ts`
- **Cookie Name**: `feature-flags-user`

### Available Flags

```typescript
interface FeatureFlags {
  // Hero Banner Display
  showDefaultLandingHero: boolean;
  showPersonalizedHeroBanner: boolean;

  // Customer Status
  customerPreQualified: boolean;
  customerTestDriveScheduled: boolean;
  customerTradeInSubmitted: boolean;

  // Navigation & Redirect
  redirectToMyGarage: boolean;

  // UI Variants
  carouselAnimationVariant?: number;
}
```

### Flag Descriptions

| Flag | Purpose |
|------|---------|
| `showDefaultLandingHero` | Shows the default anonymous hero banner on landing page |
| `showPersonalizedHeroBanner` | Shows personalized hero with "BUY NOW" CTA for authenticated prequalified users |
| `customerPreQualified` | Indicates user has completed prequalification process |
| `customerTestDriveScheduled` | Indicates user has scheduled a test drive |
| `customerTradeInSubmitted` | Indicates user has submitted trade-in information |
| `redirectToMyGarage` | Redirects user from landing page to My Garage |
| `carouselAnimationVariant` | Controls which carousel animation to display (0-7) |

---

## User States

### Test Users

Eight test user profiles are available to simulate different user scenarios:

#### 1. First Time Visitor
**Key**: `firstTimeVisitor`

- **Description**: New user or returning within 3 hours
- **Experience**: Default landing page with standard hero banner
- **Flags**:
  - `showDefaultLandingHero: true`
  - `redirectToMyGarage: false`
  - All customer status flags: `false`

#### 2. Returning Visitor (Unauthenticated)
**Key**: `returningUnauthenticated`

- **Description**: Known user, not authenticated, last visit > 3 hours
- **Experience**: Redirected to My Garage with completed prequalification and trade-in
- **Flags**:
  - `redirectToMyGarage: true`
  - `customerPreQualified: true`
  - `customerTradeInSubmitted: true`
- **Days Remaining**: 27 (green status)

#### 3. Authenticated & Prequalified
**Key**: `authenticatedPrequalified`

- **Description**: Authenticated user with prequalification completed
- **Experience**: Personalized hero banner with "BUY NOW" CTA
- **Flags**:
  - `showPersonalizedHeroBanner: true`
  - `customerPreQualified: true`
  - `customerTradeInSubmitted: true`
- **Days Remaining**: 12 (yellow status)

#### 4. Authenticated Not Prequalified
**Key**: `authenticatedNotPrequalified`

- **Description**: Authenticated user without prequalification
- **Experience**: My Garage with personalized greeting, action-needed cards
- **Flags**:
  - `redirectToMyGarage: true`
  - All customer status flags: `false`
- **Shows**: User name in hero banner

#### 5. Prequalified + No Trade-In
**Key**: `prequalifiedNoTrade`

- **Description**: User completed prequalification but no trade-in
- **Experience**: My Garage showing financing card (completed) and trade-in card (action needed)
- **Flags**:
  - `customerPreQualified: true`
  - `customerTradeInSubmitted: false`
- **Days Remaining**: 5 (red status - urgent)

#### 6. Not Prequalified + Has Trade-In
**Key**: `notPrequalifiedWithTrade`

- **Description**: User submitted trade-in but not prequalified
- **Experience**: My Garage showing trade-in card (completed) and financing card (action needed)
- **Flags**:
  - `customerPreQualified: false`
  - `customerTradeInSubmitted: true`

#### 7. Unauthenticated Prequalified + Trade-In
**Key**: `unauthPrequalifiedWithTrade`

- **Description**: Unauthenticated user with both actions completed
- **Experience**: My Garage without personalized greeting
- **Flags**:
  - `customerPreQualified: true`
  - `customerTradeInSubmitted: true`
- **Days Remaining**: 20 (green status)

#### 8. Unauthenticated Not Prequalified + No Trade-In
**Key**: `unauthNotPrequalifiedNoTrade`

- **Description**: Unauthenticated user with no actions completed
- **Experience**: My Garage with both action-needed cards
- **Flags**:
  - All customer status flags: `false`

---

## Landing Page Behavior

### Decision Flow

```
User visits landing page
    ↓
Check: redirectToMyGarage flag
    ↓
YES → Redirect to /my-garage
    ↓
NO → Check: showPersonalizedHeroBanner flag
    ↓
YES → Show personalized hero with "BUY NOW" CTA
    ↓
NO → Show default landing page
```

### Hero Banner Variants

#### Default Hero
- **Trigger**: `showDefaultLandingHero: true`
- **Content**: Standard hero banner with search
- **Users**: First-time visitors

#### Personalized Hero with BUY NOW
- **Trigger**: `showPersonalizedHeroBanner: true`
- **Content**: Personalized greeting + "BUY NOW" CTA button
- **Users**: Authenticated prequalified users
- **Example**: "WELCOME BACK JAMES!"

---

## My Garage Page

### Page Components

1. **Hero Banner**
   - Shows "WELCOME BACK!" or "WELCOME BACK [NAME]!"
   - Name shown when `isAuthenticated: true`

2. **My Garage Cards** (3 columns)
   - Saved Vehicles
   - Recent Searches
   - Financing & Trade-In Cards

3. **Vehicle Recommendations**
   - Best Matches
   - Because You Viewed
   - Recent Price Drops

### Access Control

Users reach My Garage when:
- `redirectToMyGarage: true` (automatic redirect from landing)
- Direct navigation to `/my-garage`

### Personalization

| User Type | Shows Name | Card Variations |
|-----------|-----------|-----------------|
| Authenticated | ✅ Yes | Based on status flags |
| Unauthenticated | ❌ No | Based on status flags |

---

## GarageInfoCards

### Financing Card

The Financing Card has two variations based on `customerPreQualified` flag:

#### Variation 1: Pre-qualified (customerPreQualified: true)

**Visual Elements**:
- **Heading**: "Your Financing"
- **Badge**: Green "Pre-qualified" badge
- **Status Circle**: Shows days remaining (out of 30)
  - Red circle: ≤10 days (≤33%)
  - Yellow circle: 11-15 days (≤50%)
  - Green circle: 16+ days (>50%)
- **Body Text**:
  - "You are pre-qualified" (bold)
  - "See real monthly payments on every vehicle"
- **CTA**: "Buy Online" (primary button - red)

**Props**:
```typescript
{
  prequalified: true,
  daysRemaining: number, // from user profile
  onBuyOnline: () => void
}
```

#### Variation 2: Not Pre-qualified (customerPreQualified: false)

**Visual Elements**:
- **Heading**: "Know Your Buying Power" with dollar sign icon
- **Icon**: Red circular badge with checkmark
- **Body Text**: "Unlock your buying power with no credit impact"
- **CTA**: "Get Started" (primary button - red)

**Props**:
```typescript
{
  prequalified: false,
  onGetPrequalified: () => void
}
```

### Trade-In Card

The Trade-In Card has two variations based on `customerTradeInSubmitted` flag:

#### Variation 1: Trade-In Submitted (customerTradeInSubmitted: true)

**Visual Elements**:
- **Heading**: "Sell/Trade Offer"
- **Badge**: Gray "Expires in X days" badge
- **Vehicle Info**: Image, title, price, mileage
- **Example**: "2019 Audi A7 - $15,500 - 68,150 miles"
- **CTA**: "Shop With Your Trade-In" (primary button - red)

**Props**:
```typescript
{
  hasSubmittedTradeIn: true,
  imageUrl: string,
  title: string,
  price: string,
  miles: string,
  expiresIn: string,
  onShopWithTradeIn: () => void
}
```

#### Variation 2: No Trade-In (customerTradeInSubmitted: false)

**Visual Elements**:
- **Heading**: "What's Your Car Worth?"
- **Icon**: Red circular badge with trending arrow
- **Body Text**: "Get a free estimate in minutes and apply it toward your next vehicle."
- **CTA**: "See My Offer" (secondary button - black)

**Props**:
```typescript
{
  hasSubmittedTradeIn: false,
  onGetEstimate: () => void
}
```

### Card Visibility

**Important**: Both Financing and Trade-In cards are ALWAYS visible on My Garage page. Only the variation changes based on user status.

---

## Testing with Debug Panel

### Accessing the Debug Panel

1. Look for the 🚩 icon in the bottom-right corner of the page
2. Click to open the Feature Flags debug panel

### Debug Panel Features

**Current User Section**:
- Shows active user profile
- Displays user description
- Lists all active flags

**Switch User Dropdown**:
- Select from 8 test user profiles
- Instantly switches user context
- Updates all flags and UI

**Active Flags Section**:
- Scrollable list of all enabled flags
- Shows flag names and values
- Auto-updates when switching users

### Testing Scenarios

#### Test Landing Page Variations
1. Select "First Time Visitor" → See default hero
2. Select "Authenticated & Prequalified" → See personalized hero with BUY NOW

#### Test My Garage Redirect
1. Start on landing page
2. Select "Returning Visitor (Unauthenticated)"
3. Page automatically redirects to My Garage

#### Test Card Variations
1. Navigate to My Garage
2. Switch between users to see different card states:
   - "Authenticated Not Prequalified" → Both action-needed cards
   - "Returning Visitor" → Both completed cards
   - "Prequalified + No Trade-In" → Mixed states

#### Test Days Remaining Colors
1. Navigate to My Garage
2. Switch between prequalified users:
   - "Prequalified + No Trade-In" (5 days) → Red circle
   - "Authenticated & Prequalified" (12 days) → Yellow circle
   - "Returning Visitor" (27 days) → Green circle

### Manual Cookie Testing

Alternatively, set the cookie manually in browser DevTools:

```javascript
document.cookie = "feature-flags-user=authenticatedPrequalified; path=/";
location.reload();
```

---

## Implementation Details

### File Structure

```
apps/web/src/
├── lib/flags/
│   ├── config.ts          # Flag definitions & mock users
│   ├── flags.ts           # Server-side flag functions
│   └── server.ts          # Server utilities
├── components/
│   ├── features/
│   │   ├── mygarage/
│   │   │   └── my-garage-cards.tsx    # Card components
│   │   └── card/
│   │       └── garage-info-card.tsx   # Base card component
│   ├── layout/
│   │   └── my-garage/
│   │       ├── my-garagewrapper.tsx   # Server component
│   │       └── my-garageclient.tsx    # Client component
│   └── shared/
│       └── feature-flag-debug.tsx     # Debug panel
└── app/
    └── page.tsx           # Landing page with redirect logic
```

### Data Flow

```
Cookie (feature-flags-user)
    ↓
getUserInfo() / getFlags()
    ↓
Server Components (page.tsx, MyGarageWrapper)
    ↓
Client Components (MyGarageClient, MyGarageCards)
    ↓
UI Rendering
```

### Adding New Flags

1. **Update Interface** (`config.ts`):
```typescript
export interface FeatureFlags {
  // ... existing flags
  newFlag: boolean;
}
```

2. **Update Mock Users** (`config.ts`):
```typescript
export const mockUsers: Record<string, MockUser> = {
  firstTimeVisitor: {
    // ... existing config
    flags: {
      // ... existing flags
      newFlag: false,
    }
  },
  // ... update all users
};
```

3. **Create Server Function** (`flags.ts`):
```typescript
export async function newFlag(): Promise<boolean> {
  const flags = await getFlags();
  return flags.newFlag;
}
```

4. **Use in Components**:
```typescript
const isNewFlagEnabled = await newFlag();
```

### Adding New Test Users

1. **Add to mockUsers** (`config.ts`):
```typescript
export const mockUsers: Record<string, MockUser> = {
  // ... existing users
  newUserScenario: {
    id: "new-user-scenario-009",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    flags: {
      // ... configure flags
    },
    lastVisit: Date.now() - 1 * 60 * 60 * 1000,
    isAuthenticated: true,
    prequalified: false,
    daysRemaining: 15,
  },
};
```

2. **Update Debug Panel** (`feature-flag-debug.tsx`):
```typescript
const scenarioOptions = [
  // ... existing options
  {
    key: "newUserScenario",
    label: "New User Scenario",
    description: "Description of what this scenario tests",
  },
];
```

---

## Best Practices

### Development

1. **Always test with multiple user profiles** before deploying
2. **Use the debug panel** for rapid iteration
3. **Document new flags** in this file when adding them
4. **Keep flag names descriptive** and use camelCase

### Production Considerations

1. **Replace mock users** with real user data from database
2. **Implement proper authentication** checks
3. **Add analytics** to track flag usage
4. **Consider A/B testing** framework for gradual rollouts
5. **Cache flag values** appropriately to reduce database calls

### Testing Checklist

- [ ] Test all 8 user scenarios
- [ ] Verify landing page redirects work
- [ ] Check both card variations display correctly
- [ ] Confirm days remaining colors (red/yellow/green)
- [ ] Test authenticated vs unauthenticated experiences
- [ ] Verify debug panel switches users correctly
- [ ] Check mobile responsive behavior

---

## Troubleshooting

### Issue: Flags not updating after cookie change
**Solution**: Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)

### Issue: Debug panel not showing
**Solution**: Check that `feature-flag-debug.tsx` is imported in the page component

### Issue: Wrong card variation showing
**Solution**: Verify the flag values in the debug panel "Active Flags" section

### Issue: Days remaining not showing correct color
**Solution**: Check that `daysRemaining` is set in the user profile and passed through props

### Issue: User name not showing in My Garage
**Solution**: Verify `isAuthenticated: true` in the user profile and `showUserName` prop is passed

---

## Future Enhancements

- [ ] Integrate with real authentication system
- [ ] Connect to database for user preferences
- [ ] Add A/B testing framework
- [ ] Implement feature flag analytics
- [ ] Add role-based access control
- [ ] Create admin panel for flag management
- [ ] Add flag scheduling (enable/disable at specific times)
- [ ] Implement gradual rollout percentages

---

## Related Documentation

- [Component Architecture](./COMPONENT_ARCHITECTURE.md)
- [Hero Banner State Config](../HERO_BANNER_STATE_CONFIG.md)

---

**Last Updated**: March 2026
**Maintained By**: Development Team
