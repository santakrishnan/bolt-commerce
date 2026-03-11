import type { HistoryData, PriceHistoryEntry, PricingData, VehicleDetail } from "./types";

// ---------------------------------------------------------------------------
// Mock vehicle data by VIN (First API call with VIN)
// Returns: vehicle, pricing, priceHistory, history
// ---------------------------------------------------------------------------

export const vehiclesByVin: Record<string, VehicleDetail> = {
  // Toyota Highlander
  JTDEPMAE5PJ100001: {
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
    vin: "JTDEPMAE5PJ100001",
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
  },
  // Toyota Camry
  "4T1B11HK5KU123456": {
    id: "2",
    year: 2024,
    make: "Toyota",
    model: "Camry",
    trim: "XSE",
    price: 32_500,
    originalPrice: 34_900,
    condition: "Great Deal",
    warranty: true,
    inspected: true,
    miles: "12,320",
    drivetrain: "FWD",
    mpg: "28-39",
    stock: "TC2024A",
    vin: "4T1B11HK5KU123456",
    exteriorColor: "Pearl White",
    interiorColor: "Black",
    dealer: {
      name: "Toyota of Dallas",
      location: "Dallas, TX 75001",
      distance: "8.3mi",
    },
    images: [
      "/images/vdp/PDP_1.png",
      "/images/vdp/PDP_2.png",
      "/images/vdp/PDP_3.png",
      "/images/vdp/PDP_4.png",
      "/images/vdp/PDP_5.png",
      "/images/vdp/PDP_6.png",
    ],
    highlights: [
      "Toyota Safety Sense 3.0",
      "Apple CarPlay/Android Auto",
      "Premium Audio",
      "Panoramic Sunroof",
      "Heated Seats",
      "Wireless Charging",
    ],
  },
  // Toyota Corolla
  "2T1BURHE5KC456789": {
    id: "3",
    year: 2022,
    make: "Toyota",
    model: "Corolla",
    trim: "SE",
    price: 24_900,
    originalPrice: 26_500,
    condition: "Good Price",
    warranty: true,
    inspected: true,
    miles: "45,200",
    drivetrain: "FWD",
    mpg: "30-38",
    stock: "TCR456",
    vin: "2T1BURHE5KC456789",
    exteriorColor: "Modern Steel Metallic",
    interiorColor: "Black",
    dealer: {
      name: "Toyota of Arlington",
      location: "Arlington, TX 76015",
      distance: "12.1mi",
    },
    images: [
      "/images/vdp/PDP_2.png",
      "/images/vdp/PDP_3.png",
      "/images/vdp/PDP_4.png",
      "/images/vdp/PDP_5.png",
    ],
    highlights: [
      "Toyota Safety Sense 2.0",
      "Apple CarPlay",
      "Adaptive Cruise Control",
      "Lane Keeping Assist",
      "Blind Spot Monitoring",
    ],
  },
  // Toyota RAV4
  "2T3BFREV5LW789012": {
    id: "4",
    year: 2023,
    make: "Toyota",
    model: "RAV4",
    trim: "XLE Premium",
    price: 36_750,
    originalPrice: 38_900,
    condition: "Fair Deal",
    warranty: true,
    inspected: true,
    miles: "22,150",
    drivetrain: "AWD",
    mpg: "27-35",
    stock: "TR4789",
    vin: "2T3BFREV5LW789012",
    exteriorColor: "Alpine White",
    interiorColor: "Black Leather",
    dealer: {
      name: "Toyota of Fort Worth",
      location: "Fort Worth, TX 76132",
      distance: "5.7mi",
    },
    images: [
      "/images/vdp/PDP_3.png",
      "/images/vdp/PDP_4.png",
      "/images/vdp/PDP_5.png",
      "/images/vdp/PDP_6.png",
    ],
    highlights: [
      "Toyota Safety Sense 2.5+",
      "JBL Premium Audio",
      "Adaptive Suspension",
      "Head-Up Display",
      "Wireless Apple CarPlay",
    ],
  },
  // Toyota 4Runner
  JTEBU5JR5M5321654: {
    id: "5",
    year: 2021,
    make: "Toyota",
    model: "4Runner",
    trim: "TRD Off-Road",
    price: 42_400,
    originalPrice: 45_900,
    condition: "Fair Price",
    warranty: false,
    inspected: true,
    miles: "68,900",
    drivetrain: "4WD",
    mpg: "16-19",
    stock: "T4R321",
    vin: "JTEBU5JR5M5321654",
    exteriorColor: "Midnight Black Metallic",
    interiorColor: "Black",
    dealer: {
      name: "Toyota of Irving",
      location: "Irving, TX 75062",
      distance: "15.4mi",
    },
    images: [
      "/images/vdp/PDP_4.png",
      "/images/vdp/PDP_5.png",
      "/images/vdp/PDP_6.png",
      "/images/vdp/PDP_1.png",
    ],
    highlights: [
      "Multi-Terrain Select",
      "Entune Premium Audio",
      "Panoramic Sunroof",
      "Adaptive Cruise Control",
      "Blind Spot Monitoring",
    ],
  },
};

// ---------------------------------------------------------------------------
// Mock pricing data by VIN (Pricing tab)
// ---------------------------------------------------------------------------
export const pricingByVin: Record<string, PricingData> = {
  // Toyota Highlander
  JTDEPMAE5PJ100001: {
    currentPrice: 43_098,
    avgPrice: 48_098,
    daysOnSite: 3,
    views: 541,
    saves: 73,
  },
  // Toyota Camry
  "4T1B11HK5KU123456": {
    currentPrice: 32_500,
    avgPrice: 36_500,
    daysOnSite: 7,
    views: 892,
    saves: 156,
  },
  // Toyota Corolla
  "2T1BURHE5KC456789": {
    currentPrice: 24_900,
    avgPrice: 27_500,
    daysOnSite: 12,
    views: 324,
    saves: 48,
  },
  // Toyota RAV4
  "2T3BFREV5LW789012": {
    currentPrice: 36_750,
    avgPrice: 40_200,
    daysOnSite: 5,
    views: 673,
    saves: 94,
  },
  // Toyota 4Runner
  JTEBU5JR5M5321654: {
    currentPrice: 42_400,
    avgPrice: 46_900,
    daysOnSite: 15,
    views: 412,
    saves: 62,
  },
};

// ---------------------------------------------------------------------------
// Mock price history data by VIN (Pricing tab — history table, max 4 rows per VIN)
// ---------------------------------------------------------------------------
export const priceHistoryByVin: Record<string, PriceHistoryEntry[]> = {
  // Toyota Highlander
  JTDEPMAE5PJ100001: [
    { date: "2026-03-02", price: 43_098, change: 0 },
    { date: "2026-02-20", price: 43_098, change: -500 },
    { date: "2026-01-15", price: 43_598, change: -1000 },
    { date: "2025-12-10", price: 44_598, change: 800 },
  ],
  // Toyota Camry
  "4T1B11HK5KU123456": [
    { date: "2026-03-02", price: 32_500, change: 0 },
    { date: "2026-02-15", price: 32_500, change: -800 },
    { date: "2026-01-20", price: 33_300, change: -1200 },
    { date: "2025-12-05", price: 34_500, change: -400 },
  ],
  // Toyota Corolla
  "2T1BURHE5KC456789": [
    { date: "2026-03-02", price: 24_900, change: 0 },
    { date: "2026-02-25", price: 24_900, change: -300 },
    { date: "2026-01-10", price: 25_200, change: 0 },
    { date: "2025-12-15", price: 25_200, change: -600 },
  ],
  // Toyota RAV4
  "2T3BFREV5LW789012": [
    { date: "2026-03-02", price: 36_750, change: 0 },
    { date: "2026-02-18", price: 36_750, change: -900 },
    { date: "2026-01-22", price: 37_650, change: -1100 },
    { date: "2025-12-08", price: 38_750, change: 0 },
  ],
  // Toyota 4Runner
  JTEBU5JR5M5321654: [
    { date: "2026-03-02", price: 42_400, change: 0 },
    { date: "2026-02-12", price: 42_400, change: -800 },
    { date: "2026-01-18", price: 43_200, change: -1200 },
    { date: "2025-12-20", price: 44_400, change: -500 },
  ],
};

// ---------------------------------------------------------------------------
// Mock history data by VIN (History tab)
// ---------------------------------------------------------------------------
export const historyDataByVin: Record<string, HistoryData> = {
  // Toyota Highlander
  JTDEPMAE5PJ100001: {
    vin: "JTDEPMAE5PJ100001",
    vehicleDescription: "Door Wagon/Sport Utility 2.5L 14F DOHV I4V - HYBRID - AWD",
    damageReported: 0,
    previousOwners: 2,
    servicesOnRecord: 10,
    repairsReported: 0,
    ownerTypes: ["Commercial", "Personal"],
    lastOdometerReading: 18_450,
  },
  // Toyota Camry
  "4T1B11HK5KU123456": {
    vin: "4T1B11HK5KU123456",
    vehicleDescription: "4-Door Sedan 2.5L I4 FWD",
    damageReported: 0,
    previousOwners: 1,
    servicesOnRecord: 5,
    repairsReported: 0,
    ownerTypes: ["Personal"],
    lastOdometerReading: 12_320,
  },
  // Toyota Corolla
  "2T1BURHE5KC456789": {
    vin: "2T1BURHE5KC456789",
    vehicleDescription: "4-Door Sedan 2.0L I4 FWD",
    damageReported: 0,
    previousOwners: 2,
    servicesOnRecord: 12,
    repairsReported: 1,
    ownerTypes: ["Personal", "Personal"],
    lastOdometerReading: 45_200,
  },
  // Toyota RAV4
  "2T3BFREV5LW789012": {
    vin: "2T3BFREV5LW789012",
    vehicleDescription: "4-Door SUV 2.5L I4 AWD",
    damageReported: 0,
    previousOwners: 1,
    servicesOnRecord: 8,
    repairsReported: 0,
    ownerTypes: ["Personal"],
    lastOdometerReading: 22_150,
  },
  // Toyota 4Runner
  JTEBU5JR5M5321654: {
    vin: "JTEBU5JR5M5321654",
    vehicleDescription: "4-Door SUV 4.0L V6 4WD",
    damageReported: 1,
    previousOwners: 2,
    servicesOnRecord: 10,
    repairsReported: 2,
    ownerTypes: ["Personal", "Personal"],
    lastOdometerReading: 68_900,
  },
};
