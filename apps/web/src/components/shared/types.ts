export interface VehicleEstimation {
  creditScore: string;
  apr: string;
  termLength: string;
  estimatedMonthlyPayment: string;
}

export interface Vehicle {
  id: number;
  title: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  vin: string;
  price: number;
  oldPrice?: number;
  image: string | string[];
  miles: string;
  odometer: string;
  mileage: number;
  bodyType: "Sedan" | "SUV" | "Truck" | "Hatchback" | "Van" | "Convertible" | "Coupe";
  match: number;
  labels: string[];
  owners: number;
  extColorName: string;
  extColorCode: string;
  intColorName: string;
  intColorCode: string;
  estimation?: VehicleEstimation;
}
