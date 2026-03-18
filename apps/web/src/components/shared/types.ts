export interface VehicleEstimation {
  apr: string;
  creditScore: string;
  estimatedMonthlyPayment: string;
  termLength: string;
}

export type FuelType =
  | "Gasoline"
  | "Hybrid"
  | "Plug-in Hybrid"
  | "Electric"
  | "Hydrogen"
  | "Diesel"
  | "Flex Fuel";

export type Drivetrain = "AWD" | "FWD" | "RWD" | "4WD";
export type Transmission = "Automatic" | "CVT" | "Manual";

export interface VehicleFeatures {
  comfort: string[];
  exterior: string[];
  performance: string[];
  safety: string[];
  tech: string[];
}

export interface Vehicle {
  bodyType: "Sedan" | "SUV" | "Truck" | "Hatchback" | "Van" | "Convertible" | "Coupe" | "Wagon";
  drivetrain: Drivetrain;
  estimation?: VehicleEstimation;
  extColorCode: string;
  extColorName: string;
  features: VehicleFeatures;
  fuelType: FuelType;
  id: number;
  image: string | string[];
  inspection160: boolean;
  intColorCode: string;
  intColorName: string;
  labels: string[];
  make: string;
  match: number;
  mileage: number;
  miles: string;
  model: string;
  odometer: string;
  oldPrice?: number;
  owners: number;
  price: number;
  seatingCapacity: string[];
  title: string;
  transmission: Transmission;
  variant: string;
  vin: string;
  year: number;
}
