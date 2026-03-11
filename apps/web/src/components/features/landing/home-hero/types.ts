import type { HeroStat } from "~/services/landing";

// ─── Shared primitive interfaces ────────────────────────────────────────────

export interface SavedVehicle {
  year: number;
  make: string;
  model: string;
  price: number;
  image?: string;
  vin?: string;
  mileage?: number;
  stockNumber?: string;
}

export interface TradeInOffer {
  year: number;
  make: string;
  model: string;
  offerAmount: number;
  expiresInDays: number;
}

// ─── Component prop interfaces ───────────────────────────────────────────────

export interface HomeHeroTitleProps {
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  className?: string;
}

export interface ParsedStatValue {
  numericValue: number;
  prefix: string;
  suffix: string;
}

export interface HomeHeroStatsProps {
  stats: HeroStat[];
}

export interface HomeHeroStaticProps {
  isKnownUser?: boolean;
  useLocationBackground?: boolean;
}

export interface HomeHeroKnownUserContentProps {
  userName: string;
  isPreQualified?: boolean;
  savedVehicle?: SavedVehicle;
  preQualifiedVehicle?: SavedVehicle;
  tradeInOffer?: TradeInOffer;
  onBuyOnline?: () => void;
  onScheduleTestDrive?: () => void;
  onAcceptOffer?: () => void;
  onContinueShopping?: () => void;
  showCards?: boolean;
  showSubtitle?: boolean;
  showContinueShopping?: boolean;
}

export interface HomeHeroProps {
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  showStats?: boolean;
  showSearch?: boolean;
  heightClassName?: string;
  knownUser?: HomeHeroKnownUserContentProps;
  useLocationBackground?: boolean;
}
