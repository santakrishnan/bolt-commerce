export interface EstimationData {
  apr: string;
  creditScore: string;
  estimatedMonthlyPayment: string;
  termLength: string;
}

export interface CarCardProps {
  badge?: {
    type: "excellent" | "available" | "priceDrop";
    text: string;
  };
  carImage: string | string[];
  carName: string;
  dealerName: string;
  distance: string;
  /** Set to false to disable the card-click preview modal (e.g. on the garage page) */
  enablePreviewModal?: boolean;
  estimatedPayment: string;
  estimation?: EstimationData;
  exteriorColor: string;
  exteriorColorGradient?: string;
  exteriorColorHex: string;
  features?: {
    warranty?: boolean;
    inspected?: boolean;
    oneOwner?: boolean;
  };
  interiorColor: string;
  interiorColorHex: string;
  // Optional VDP route segments — used to build the VDP URL and populate the preview modal
  make?: string;
  matchPercentage?: string;
  mileage: string;
  model?: string;
  onApplyRefineFilters?: (filters: { id: string; label: string }[]) => void;
  owners: number;
  price: string;
  variant?: string;
  vin?: string;
  wasPrice?: string;
  year?: number;
}
