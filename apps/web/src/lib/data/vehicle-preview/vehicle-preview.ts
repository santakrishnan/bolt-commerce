/**
 * Vehicle Preview Modal — demo data.
 *
 * Houses the mock vehicle used by `<VehiclePreviewModal />` and the
 * test-image list that was previously in `get-test-images.ts`.
 * Swap the implementation to fetch from an API or CMS without
 * touching any component code.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VehiclePreviewData {
  condition: string;
  dealer: string;
  distance: string;
  drivetrain: string;
  exterior: string;
  exteriorColorCode: string;
  features: string[];
  images: string[];
  inspected: boolean;
  interior: string;
  interiorColorCode: string;
  location: string;
  make: string;
  miles: string;
  model: string;
  mpg: string;
  originalPrice: number;
  price: number;
  stock: string;
  /** Pre-built display title, e.g. "2023 Toyota Corolla Cross". When provided the modal renders it directly instead of assembling from parts. */
  title?: string;
  trim?: string;
  vin: string;
  warranty: boolean;
  year: number;
}

// ---------------------------------------------------------------------------
// Test / demo images (from the vdp-images folder)
// ---------------------------------------------------------------------------

export const vehiclePreviewImages: string[] = [
  "/images/vdp-images/image 904.png",
  "/images/vdp-images/image 905.png",
  "/images/vdp-images/image 907.png",
  "/images/vdp-images/image 908.png",
  "/images/vdp-images/image 909.png",
  "/images/vdp-images/image 910.png",
];

// ---------------------------------------------------------------------------
// Demo vehicle
// ---------------------------------------------------------------------------

export const demoVehiclePreview: VehiclePreviewData = {
  year: 2023,
  make: "Toyota",
  model: "Highlander XLE",
  trim: "XLE",
  price: 43_098,
  originalPrice: 35_900,
  condition: "Excellent Price",
  warranty: true,
  inspected: true,
  miles: "18,450",
  drivetrain: "AWD",
  mpg: "18-24",
  stock: "990167H",
  vin: "2T3P1RF5VNW123456",
  exterior: "Graphite Fabric",
  exteriorColorCode: "#474B50",
  interior: "Charcoal Gray",
  interiorColorCode: "#36454F",
  dealer: "Toyota of Fort Worth",
  location: "Fort Worth, TX 76116",
  distance: "6.1mi",
  images: vehiclePreviewImages,
  features: [
    "Apple CarPlay/Android Auto",
    "Around View Camera",
    "Pedestrian Detection",
    "Bluetooth Hands-Free/ Streaming Audio",
    "Forward Collision Warning",
    "Voice Command",
    "Rear Sunshade",
    "Power Trunk/ Liftgate",
    "LED Highlights",
    "Folding Mirrors",
    "Blind Spot Monitor",
    "Lane Departure Warning",
    "Adaptive Cruise Control",
    "Heated Seats",
    "Ventilated Seats",
    "Panoramic Sunroof",
    "Navigation System",
    "Premium Sound System",
  ],
};
