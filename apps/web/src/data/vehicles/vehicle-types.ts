/**
 * Vehicle Type Data
 * Contains all vehicle types with their display information
 */

export interface VehicleType {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const vehicleTypes: VehicleType[] = [
  {
    id: "sedan",
    name: "SEDAN",
    description: "Fuel-efficient daily driver",
    image: "/images/categories/SEDAN.png",
  },
  {
    id: "suv",
    name: "SUV",
    description: "Space & versatility",
    image: "/images/categories/SUV.png",
  },
  {
    id: "coupe",
    name: "COUPE",
    description: "Sleek, sporty, two-door",
    image: "/images/categories/COUPE.png",
  },
  {
    id: "truck",
    name: "TRUCK",
    description: "Power & capability",
    image: "/images/categories/TRUCK.png",
  },
  {
    id: "hatchback",
    name: "HATCHBACK",
    description: "Fuel-efficient daily driver",
    image: "/images/categories/HATCHBACK.png",
  },
  {
    id: "wagon",
    name: "WAGON",
    description: "Space & versatility",
    image: "/images/categories/WAGON.png",
  },
  {
    id: "van",
    name: "VAN",
    description: "Power & capability",
    image: "/images/categories/VAN.png",
  },
  {
    id: "convertible",
    name: "CONVERTIBLE",
    description: "Sleek, sporty, two-door",
    image: "/images/categories/CONVERTIBLE.png",
  },
];
