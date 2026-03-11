export interface EstimationData {
  creditScore: string;
  apr: string;
  termLength: string;
  estimatedMonthlyPayment: string;
}

export interface CarCardProps {
  wasLiked?: boolean;
  carImage: string | string[];
  carName: string;
  // Optional VDP route segments — used to build the VDP URL and populate the preview modal
  make?: string;
  model?: string;
  variant?: string;
  year?: number;
  vin?: string;
  price: string;
  wasPrice?: string;
  mileage: string;
  estimatedPayment: string;
  exteriorColor: string;
  exteriorColorHex: string;
  exteriorColorGradient?: string;
  interiorColor: string;
  interiorColorHex: string;
  matchPercentage?: string;
  dealerName: string;
  distance: string;
  owners: number;
  badge?: {
    type: "excellent" | "available" | "priceDrop";
    text: string;
  };
  features?: {
    warranty?: boolean;
    inspected?: boolean;
    oneOwner?: boolean;
  };
  estimation?: EstimationData;
  onFavoriteToggle?: () => void;
  onApplyRefineFilters?: (filters: { id: string; label: string }[]) => void;
  /** Set to false to disable the card-click preview modal (e.g. on the garage page) */
  enablePreviewModal?: boolean;
}
