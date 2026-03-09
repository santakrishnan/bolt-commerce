# User Story: Customize Garage Card Variations

## Story
As a product designer, I want to customize all garage card variations with appropriate icons, colors, and CTAs so that each card clearly communicates its purpose and action state to users.

## Acceptance Criteria

### Financing Cards

#### Pre-qualified State
- [ ] Header icon: Red circle with white "27" and "DAYS" label
- [ ] Header text: "Your Financing"
- [ ] Badge: Green "Pre-qualified"
- [ ] Body icon: Status circle (red/yellow/green based on days)
- [ ] Body text: "You are pre-qualified" + "See real monthly payments on every vehicle"
- [ ] CTA: "Buy Online" - Red button (primary)

#### Not Pre-qualified State
- [ ] Header icon: Red circle with white dollar sign ($)
- [ ] Header text: "Know Your Buying Power"
- [ ] Body icon: Red circle with white checkmark badge
- [ ] Body text: "Unlock your buying power with no credit impact"
- [ ] CTA: "Get Started" - Red button (primary)

#### Alternative: Get Pre-qualified in Minutes
- [ ] Header icon: Red circle with white checkmark badge
- [ ] Header text: "Get Pre-qualified in Minutes"
- [ ] Body icon: None
- [ ] Body text: "Unlock your buying power with no credit impact to your credit"
- [ ] CTA: "Get Started" - Red button (primary)

### Trade-In Cards

#### Trade-In Submitted State
- [ ] Header icon: Red circle with white car icon
- [ ] Header text: "Sell/Trade Offer"
- [ ] Badge: Gray "Expires in 2 days"
- [ ] Body content: Vehicle image + details (2019 Audi A7, $15,500, 68,150 miles)
- [ ] CTA: "Shop With Your Trade-In" - Red button (primary)

#### No Trade-In State
- [ ] Header icon: Red circle with white trending arrow
- [ ] Header text: "What's Your Car Worth?"
- [ ] Body icon: Red circle with white trending arrow (40x40px)
- [ ] Body text: "Get a free estimate in minutes and apply it toward your next vehicle."
- [ ] CTA: "See My Offer" - Black button (secondary)

#### Alternative: What's Your Trade-In Value?
- [ ] Header icon: Red circle with white trending arrow
- [ ] Header text: "What's Your Trade-In Value?"
- [ ] Body icon: Red circle with white trending arrow (40x40px)
- [ ] Body text: "Get a free estimate in minutes and apply it toward your next vehicle."
- [ ] CTA: "See My Offer" - Black button (secondary)

### Test Drive Cards (Future)

#### Not Scheduled State
- [ ] Header icon: Red circle with white steering wheel
- [ ] Header text: "Schedule a Test drive today."
- [ ] Body icon: Red circle with white location pin
- [ ] Body text: "Test drive today. Schedule a test drive at Toyota of Fort Worth"
- [ ] CTA: "Book an Appointment" - White button with border (tertiary)

#### Scheduled State
- [ ] Header icon: Red circle with white steering wheel
- [ ] Header text: "Ready to Drive it?"
- [ ] Body icon: Red circle with white location pin
- [ ] Body text: "Experience this vehicle firsthand at Toyota of Fort Worth"
- [ ] CTA: "Schedule a Test Drive" - White button with border (tertiary)

## Technical Requirements

### Icon Specifications
- Header icons: 24x24px circle with 14px icon inside
- Body icons: 40x40px circle with 20px icon inside
- All circles: Red background (#DC2626 or brand red)
- All icons: White fill/stroke

### Button Variants
- Primary (Red): `bg-brand text-primary-foreground hover:bg-primary-hover`
- Secondary (Black): `bg-black text-white hover:bg-gray-800`
- Tertiary (White): `bg-white text-black border border-gray-300 hover:bg-gray-50`

### Component Updates Needed
1. Add `ctaVariant` prop support for "tertiary" in `GarageInfoCard`
2. Create reusable icon components for each card type
3. Add test drive card components to `my-garage-cards.tsx`
4. Update feature flags to support test drive scheduling state

## Design Assets Required
- [ ] Dollar sign icon SVG
- [ ] Checkmark badge icon SVG
- [ ] Trending arrow icon SVG
- [ ] Car icon SVG
- [ ] Steering wheel icon SVG
- [ ] Location pin icon SVG

## Testing Scenarios
- [ ] Verify all 6+ card variations render correctly
- [ ] Test button color variants (primary, secondary, tertiary)
- [ ] Confirm icon sizes and colors match design
- [ ] Validate responsive behavior on mobile
- [ ] Test with all 8 user profiles in debug panel

## Notes
- All cards should maintain consistent padding, spacing, and shadow
- Icons should be decorative with `aria-hidden="true"`
- Button text should be clear and action-oriented
- Card variations should be determined by feature flags
