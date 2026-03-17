export interface VehicleFinderOption {
  icon: "price-tag" | "badge" | "arrow-down" | "speedometer";
  id: string;
  title: string;
  vehicleCount: number;
}

export interface VehicleFinderOptionStatic {
  icon: "price-tag" | "badge" | "arrow-down" | "speedometer";
  id: string;
  title: string;
}

export const vehicleFinderOptions: VehicleFinderOptionStatic[] = [
  {
    id: "under-20k",
    title: "Cars-Under-$20,000",
    icon: "price-tag",
  },
  {
    id: "excellent-deals",
    title: "Shop-Excellent-Deals",
    icon: "badge",
  },
  {
    id: "price-drop",
    title: "Price-Drop",
    icon: "arrow-down",
  },
  {
    id: "low-miles",
    title: "Low-Miles",
    icon: "speedometer",
  },
];
