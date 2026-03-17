import type { HeroStat } from "~/services/landing";

// ─── Shared primitive interfaces ────────────────────────────────────────────

export interface SavedVehicle {
  image?: string;
  make: string;
  mileage?: number;
  model: string;
  price: number;
  stockNumber?: string;
  vin?: string;
  year: number;
}

export interface TradeInOffer {
  expiresInDays: number;
  make: string;
  model: string;
  offerAmount: number;
  year: number;
}

// ─── Component prop interfaces ───────────────────────────────────────────────

export interface HomeHeroTitleProps {
  className?: string;
  showSubtitle?: boolean;
  subtitle?: string;
  title?: string;
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
  isPreQualified?: boolean;
  onAcceptOffer?: () => void;
  onBuyOnline?: () => void;
  onContinueShopping?: () => void;
  onScheduleTestDrive?: () => void;
  preQualifiedVehicle?: SavedVehicle;
  savedVehicle?: SavedVehicle;
  showCards?: boolean;
  showContinueShopping?: boolean;
  showSubtitle?: boolean;
  tradeInOffer?: TradeInOffer;
  userName: string;
}

export interface HomeHeroProps {
  heightClassName?: string;
  knownUser?: HomeHeroKnownUserContentProps;
  showSearch?: boolean;
  showStats?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  title?: string;
  useLocationBackground?: boolean;
}
