import type {
  FeatureCategory,
  HistoryData,
  PriceHistoryEntry,
  PricingData,
  RatingData,
  VdpPageData,
  VehicleDetail,
  VehicleSpecData,
  VehicleStatusData,
} from "./types";

// ---------------------------------------------------------------------------
// Mock vehicle detail
// ---------------------------------------------------------------------------

const mockVehicle: VehicleDetail = {
  id: "1",
  year: 2023,
  make: "Toyota",
  model: "Highlander",
  trim: "XLE",
  price: 43_098,
  originalPrice: 45_900,
  condition: "Excellent Price",
  warranty: true,
  inspected: true,
  miles: "18,450",
  drivetrain: "AWD",
  mpg: "18-24",
  stock: "990167H",
  vin: "2T3P1RF5VNW123456",
  exteriorColor: "Graphite Fabric",
  interiorColor: "Charcoal Gray",
  dealer: {
    name: "Toyota of Fort Worth",
    location: "Fort Worth, TX 76116",
    distance: "6.1mi",
  },
  images: [
    "/images/vdp/PDP_3.png",
    "/images/vdp/PDP_2.png",
    "/images/vdp/PDP_1.png",
    "/images/vdp/PDP_4.png",
    "/images/vdp/PDP_5.png",
    "/images/vdp/PDP_6.png",
    "/images/vdp/PDP_1.png",
    "/images/vdp/PDP_2.png",
    "/images/vdp/PDP_3.png",
    "/images/vdp/PDP_4.png",
    "/images/vdp/PDP_5.png",
    "/images/vdp/PDP_6.png",
  ],
  highlights: [
    "Apple Carplay/ Android Auto",
    "Around View Camera",
    "Bluetooth Hands-Free/ Streaming Audio",
    "Pedestrian Detection",
    "Forward Collision Warning",
    "Voice Command",
    "Rear Sunshade",
    "Power Trunk/ Liftgate",
    "LED Highlights",
    "Folding Mirrors",
  ],
};

// ---------------------------------------------------------------------------
// Mock specs (Overview tab)
// ---------------------------------------------------------------------------

const mockSpecs: VehicleSpecData[] = [
  { key: "engine", label: "Engine", value: "3.5L V6" },
  { key: "interior-color", label: "Interior Color", value: "Black" },
  { key: "exterior-color", label: "Exterior Color", value: "Grey Metallic" },
  { key: "mpg", label: "MPG", value: "18 city / 35 highway" },
  { key: "mileage", label: "Mileage", value: "15,400 mi" },
  { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
  { key: "fuel-type", label: "Fuel Type", value: "Gas" },
  { key: "drivetrain", label: "Drivetrain", value: "AWD" },
  { key: "transmission", label: "Transmission", value: "8-Speed Automatic" },
];

// ---------------------------------------------------------------------------
// Mock feature categories (Features & Details tab)
// ---------------------------------------------------------------------------

const mockFeatures: FeatureCategory[] = [
  {
    name: "Safety",
    features: [
      "Toyota safety Sense 3.0+",
      "Pre-Collision System",
      "Dynamic Radar Cruise Control",
      "Lane Departure Alert",
      "Automatic High Beams",
    ],
  },
  {
    name: "Interior",
    features: [
      "Leather-Trimmed seats",
      "Power Moonroof",
      "Dual-Zone Climate Control",
      "Heated Front Seats",
      "Power Liftgate",
    ],
  },
  {
    name: "Technology",
    features: [
      '12.3" Touchscreen Display',
      "Apple CarPlay/Android Auto",
      "JBL Premium Audio",
      "Wi-Fi Connect",
      "Wireless Charging",
    ],
  },
  {
    name: "Exterior",
    features: [
      "LED Headlights",
      "LED Daytime Running Lights",
      "Roof Rails",
      "Power Mirrors",
      '20" Alloy Wheels',
    ],
  },
  {
    name: "Performance & Capability",
    features: [
      "3.5L V6 Engine",
      "All-Wheel Drive",
      "8-Speed Automatic Transmission",
      "Towing Package",
      "Sport-Tuned Suspension",
      "Hill Start Assist Control",
    ],
  },
  {
    name: "Comfort & Convenience",
    features: [
      "Tri-Zone Automatic Climate Control",
      "Smart Key System",
      "Push Button Start",
      "HomeLink Universal Transceiver",
      "Auto-Dimming Rearview Mirror",
    ],
  },
  {
    name: "Seating & Capacity",
    features: [
      "8-Passenger Seating",
      "2nd Row Captain Chairs",
      "60/40 Split 3rd Row",
      "Driver Seat Memory",
      "Ventilated Front Seats",
    ],
  },
];

// ---------------------------------------------------------------------------
// Mock pricing data (Pricing tab)
// ---------------------------------------------------------------------------

const mockPricing: PricingData = {
  currentPrice: 43_098,
  avgPrice: 48_098,
  daysOnSite: 3,
  views: 541,
  saves: 73,
};

// ---------------------------------------------------------------------------
// Mock price history data (Pricing tab — history table, max 4 rows)
// ---------------------------------------------------------------------------

const mockPriceHistory: PriceHistoryEntry[] = [
  { date: "2026-03-02", price: 43_098, change: 0 }, // current month — no change/arrow shown
  { date: "2026-02-20", price: 43_098, change: -500 }, // price dropped $500
  { date: "2026-01-15", price: 43_598, change: -1000 }, // price dropped $1,000
  { date: "2025-12-10", price: 44_598, change: +800 }, // price increased $800
];

// ---------------------------------------------------------------------------
// Mock history data (History tab)
// ---------------------------------------------------------------------------

const mockHistory: HistoryData = {
  vin: "2T3D1RFV5RW123456",
  vehicleDescription: "Door Wagon/Sport Utility 2.5L 14F DOHV I4V - HYBRID - AWD",
  damageReported: 0,
  previousOwners: 2,
  servicesOnRecord: 10,
  repairsReported: 0,
  ownerTypes: ["Commercial", "Personal"],
  lastOdometerReading: 18_450,
};

// ---------------------------------------------------------------------------
// Mock rating data
// ---------------------------------------------------------------------------

const mockRating: RatingData = {
  rating: 4.7,
  reviewCount: 118,
  distribution: [
    {
      stars: 5,
      count: 488,
      id: 0,
    },
    { stars: 4, count: 74, id: 1 },
    {
      stars: 3,
      count: 14,
      id: 2,
    },
    { stars: 2, count: 0, id: 3 },
    { stars: 1, count: 0, id: 4 },
  ],
};

const mockVehicleStatus: VehicleStatusData = {
  noLongerAvailable: true,
  historyReportPending: false,
  inspectionInProgress: false,
  limitedPhotos: false,
};
// ---------------------------------------------------------------------------
// Assembled page payload
// ---------------------------------------------------------------------------

export const mockVdpPageData: VdpPageData = {
  vehicle: mockVehicle,
  specs: mockSpecs,
  features: mockFeatures,
  featuresInitialCount: 4,
  pricing: mockPricing,
  priceHistory: mockPriceHistory,
  history: mockHistory,
  rating: mockRating,
  vehicleStatus: mockVehicleStatus,
};
