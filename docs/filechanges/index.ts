// ── Public API for the landing feature ────────────────────────────────
// Only export symbols consumed outside the landing feature.
// Internal components (carousels, cards, sub-components) should be
// imported directly from their source files when needed.

export { ArrowInspectedSectionWrapper } from "./components/arrow-inspected";
export { BuyingProcess } from "./components/buying-process";
export type { PromotionFlags } from "./components/customer-journey-carousel";
export { CustomerJourneyCarousel } from "./components/customer-journey-carousel";
export { HomeHero } from "./components/home-hero";
export {
  CustomerJourneyCarouselSection,
  VehicleFinderQuickLinks,
} from "./components/home-sections";
export {
  ArrowInspectedSkeleton,
  CustomerJourneySkeleton,
  VehicleFinderSkeleton,
  VehicleTypeSelectorSkeleton,
} from "./components/home-skeletons";
export { VehicleQuickLinksGrid } from "./components/vehicle-quick-links";
export { VehicleTypeSelectorWrapper } from "./components/vehicle-type-selector";

// Services — landing.service uses cacheTag/cacheLife (server-only).
// Import directly: @features/landing/services/landing.service
