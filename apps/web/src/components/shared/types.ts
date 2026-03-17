export interface VehicleEstimation {
  apr: string;
  creditScore: string;
  estimatedMonthlyPayment: string;
  termLength: string;
}

export interface Vehicle {
  bodyType: "Sedan" | "SUV" | "Truck" | "Hatchback" | "Van" | "Convertible" | "Coupe";
  estimation?: VehicleEstimation;
  extColorCode: string;
  extColorName: string;
  id: number;
  image: string | string[];
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
  title: string;
  variant: string;
  vin: string;
  year: number;
}
