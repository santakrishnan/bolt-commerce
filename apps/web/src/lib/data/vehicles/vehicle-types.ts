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
    image: "/images/categories/Sedan_732x348.png",
  },
  {
    id: "suv",
    name: "SUV",
    description: "Space & versatility",
    image: "/images/categories/SUV_732x348.png",
  },
  {
    id: "truck",
    name: "TRUCK",
    description: "Power & capability",
    image: "/images/categories/Truck_732x348.png",
  },
  {
    id: "coupe",
    name: "COUPE",
    description: "Sleek, sporty, two-door",
    image: "/images/categories/Coupe_732x348.png",
  },
  {
    id: "hatchback",
    name: "HATCHBACK",
    description: "Fuel-efficient daily driver",
    image: "/images/categories/Hatchback_732x348.png",
  },
  {
    id: "wagon",
    name: "WAGON",
    description: "Space & versatility",
    image: "/images/categories/Wagon_732x348.png",
  },
  {
    id: "van",
    name: "VAN",
    description: "Power & capability",
    image: "/images/categories/Van_732x348.png",
  },
  {
    id: "convertible",
    name: "CONVERTIBLE",
    description: "Sleek, sporty, two-door",
    image: "/images/categories/Convertible_732x348.png",
  },
];
