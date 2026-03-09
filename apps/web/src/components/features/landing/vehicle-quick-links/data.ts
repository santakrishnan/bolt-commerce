export interface VehicleFinderOption {
  id: string;
  title: string;
  vehicleCount: number;
  icon: "price-tag" | "badge" | "arrow-down" | "speedometer";
}

export interface VehicleFinderOptionStatic {
  id: string;
  title: string;
  icon: "price-tag" | "badge" | "arrow-down" | "speedometer";
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
