/**
 * Vehicle Type Data
 * Contains all vehicle types with their display information
 */

export interface VehicleType {
  id: string
  name: string
  description: string
  image: string
}

export const vehicleTypes: VehicleType[] = [
  {
    id: 'sedan',
    name: 'SEDAN',
    description: 'Fuel-efficient daily driver',
    image: '/images/categories/sedan.png',
  },
  {
    id: 'suv',
    name: 'SUV',
    description: 'Space & versatility',
    image: '/images/categories/suv.png',
  },
  {
    id: 'truck',
    name: 'TRUCK',
    description: 'Power & capability',
    image: '/images/categories/truck.png',
  },
  {
    id: 'coupe',
    name: 'COUPE',
    description: 'Sleek, sporty, two-door',
    image: '/images/categories/coupe.png',
  },
  {
    id: 'hatchback',
    name: 'HATCHBACK',
    description: 'Fuel-efficient daily driver',
    image: '/images/categories/hatchback.png',
  },
  {
    id: 'wagon',
    name: 'WAGON',
    description: 'Space & versatility',
    image: '/images/categories/wagon.png',
  },
  {
    id: 'van',
    name: 'VAN',
    description: 'Power & capability',
    image: '/images/categories/van.png',
  },
  {
    id: 'convertible',
    name: 'CONVERTIBLE',
    description: 'Sleek, sporty, two-door',
    image: '/images/categories/convertible.png',
  },
]
