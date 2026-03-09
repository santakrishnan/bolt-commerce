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
  year: number;
  make: string;
  model: string;
  price: number;
  originalPrice: number;
  condition: string;
  warranty: boolean;
  inspected: boolean;
  miles: string;
  drivetrain: string;
  mpg: string;
  stock: string;
  vin: string;
  exterior: string;
  exteriorColorCode: string;
  interior: string;
  interiorColorCode: string;
  dealer: string;
  location: string;
  distance: string;
  images: string[];
  features: string[];
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
