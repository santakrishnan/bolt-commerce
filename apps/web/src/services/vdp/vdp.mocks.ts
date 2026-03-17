import type { Vehicle as SearchVehicle } from "~/components/shared/types";
import { mockVehicles } from "~/lib/search/mock-vehicles";
import type {
  FeatureCategory,
  HistoryData,
  PriceHistoryEntry,
  PricingData,
  RatingData,
  VehicleData,
  VehicleDetail,
  VehicleSpecData,
  VehicleStatusData,
  VinData,
} from "./types";

const PRIORITY_VIN = "5TDFZRBH5RS100015";
const MILES_SUFFIX_REGEX = /mi$/i;
const OWNER_COUNT_REGEX = /(\d+)/;
const MOCK_NETWORK_DELAY_MS = 40;

interface VehicleProfile {
  name: string;
  meta: {
    Drivetrain: string;
    "Fuel Type": string;
    Transmission: string;
    Mileage: string;
    "Exterior Color": string;
    "Interior Color": string;
    "Vehicle History": string;
    Certification: string;
  };
  features: FeatureCategory[];
}

const VEHICLE_PROFILES: VehicleProfile[] = [
  {
    name: "2025 Toyota Crown Platinum AWD Hybrid",
    meta: {
      Drivetrain: "AWD",
      "Fuel Type": "Hybrid",
      Transmission: "CVT",
      Mileage: "1,204 mi",
      "Exterior Color": "Black",
      "Interior Color": "Black/Saddle",
      "Vehicle History": "No Accidents / 1 Owner / Clean Title",
      Certification: "Certified, 160-Point Inspection",
    },
    features: [
      {
        name: "Safety & Driver Assist",
        features: [
          "Toyota Safety Sense 3.0+",
          "Pre-Collision System",
          "Dynamic Radar Cruise Control",
          "Lane Tracing Assist",
          "Automatic High Beams",
          "Blind Spot Monitor",
          "Rear Cross-Traffic Alert",
        ],
      },
      {
        name: "Comfort & Convenience",
        features: [
          "Leather-Trimmed Seats",
          "Heated & Ventilated Front Seats",
          "Heated Rear Seats",
          "Dual-Zone Climate Control",
          "Memory Driver Seat",
          "Heated Steering Wheel",
          "Hands-Free Trunk",
        ],
      },
      {
        name: "Technology & Entertainment",
        features: [
          '12.3" Touchscreen Display',
          "Apple CarPlay/Android Auto",
          "JBL Premium Audio",
          "Head-Up Display",
          "Digital Rearview Mirror",
          "Wireless Charging",
          "Wi-Fi Connect",
        ],
      },
      {
        name: "Exterior & Lighting",
        features: [
          "LED Adaptive Headlights",
          "LED Daytime Running Lights",
          '21" Alloy Wheels',
          "Power-Folding Mirrors",
          "Heated Mirrors",
        ],
      },
      {
        name: "Performance & Capability",
        features: ["Hybrid Powertrain", "AWD", "Sport Mode", "Adaptive Suspension"],
      },
      {
        name: "Seating & Capacity",
        features: ["5 Passenger", "Power Front Seats", "Power Rear Seats", "Split-Folding Rear"],
      },
    ],
  },
  {
    name: "2024 Toyota Tundra 1794 Edition i-FORCE MAX",
    meta: {
      Drivetrain: "4WD",
      "Fuel Type": "Hybrid",
      Transmission: "Automatic",
      Mileage: "14,800 mi",
      "Exterior Color": "Smoked Mesquite",
      "Interior Color": "Black/Brown",
      "Vehicle History": "No Accidents / 1 Owner / Clean Title",
      Certification: "Certified, 160-Point Inspection",
    },
    features: [
      {
        name: "Safety & Driver Assist",
        features: [
          "Toyota Safety Sense 2.5+",
          "Pre-Collision System",
          "Dynamic Radar Cruise Control",
          "Lane Departure Alert",
          "Automatic High Beams",
          "Blind Spot Monitor",
          "Rear Cross-Traffic Alert",
          "Parking Sensors",
          "Backup Camera",
        ],
      },
      {
        name: "Comfort & Convenience",
        features: [
          "Leather-Trimmed Seats",
          "Heated & Ventilated Front Seats",
          "Heated Rear Seats",
          "Tri-Zone Climate Control",
          "Power Moonroof",
          "Memory Driver Seat",
          "Power Liftgate",
          "Remote Start",
        ],
      },
      {
        name: "Technology & Entertainment",
        features: [
          '14" Touchscreen Display',
          "Apple CarPlay/Android Auto",
          "JBL Premium Audio",
          "Head-Up Display",
          "Wireless Charging",
          "Wi-Fi Connect",
          "SiriusXM",
          "Digital Rearview Mirror",
          "USB-C Ports",
        ],
      },
      {
        name: "Exterior & Lighting",
        features: [
          "LED Headlights",
          "LED Fog Lights",
          "LED Taillights",
          "Heated Power Mirrors",
          "Running Boards",
          '20" Chrome Wheels',
        ],
      },
      {
        name: "Performance & Capability",
        features: [
          "i-FORCE MAX Hybrid V6 Twin-Turbo",
          "4WD",
          "Tow Package (12,000 lb)",
          "Trailer Sway Control",
          "Locking Rear Differential",
          "Multi-Terrain Select",
        ],
      },
      {
        name: "Seating & Capacity",
        features: ["5 Passenger", "Power Front Seats", "Split-Folding Rear", "Fold-Flat Rear"],
      },
      {
        name: "Bed & Cargo",
        features: [
          "5.5 ft Bed",
          "Bed Liner",
          "Tonneau Cover",
          "Tie-Down Cleats",
          "Deck Rail System",
          "Power Outlet (Bed)",
        ],
      },
    ],
  },
  {
    name: "2024 Toyota RAV4 XLE Premium AWD",
    meta: {
      Drivetrain: "AWD",
      "Fuel Type": "Gas",
      Transmission: "Automatic",
      Mileage: "12,450 mi",
      "Exterior Color": "Blueprint",
      "Interior Color": "Nutmeg",
      "Vehicle History": "No Accidents / 1 Owner / Clean Title",
      Certification: "Certified, 160-Point Inspection",
    },
    features: [
      {
        name: "Safety & Driver Assist",
        features: [
          "Toyota Safety Sense 3.0+",
          "Pre-Collision System",
          "Dynamic Radar Cruise Control",
          "Lane Departure Alert",
          "Automatic High Beams",
        ],
      },
      {
        name: "Comfort & Convenience",
        features: [
          "SofTex-Trimmed Seats",
          "Power Moonroof",
          "Dual-Zone Climate Control",
          "Heated Front Seats",
          "Power Liftgate",
        ],
      },
      {
        name: "Technology & Entertainment",
        features: [
          '12.3" Touchscreen Display',
          "Apple CarPlay/Android Auto",
          "JBL Premium Audio",
          "Wi-Fi Connect",
          "Wireless Charging",
        ],
      },
      {
        name: "Exterior & Lighting",
        features: [
          "LED Headlights",
          "LED Daytime Running Lights",
          "Roof Rails",
          "Power Mirrors",
          '19" Alloy Wheels',
        ],
      },
      {
        name: "Performance & Capability",
        features: ["AWD", "Multi-Terrain Select", "Hill Start Assist"],
      },
      {
        name: "Seating & Capacity",
        features: ["5 Passenger", "Power Driver Seat", "Split-Folding Rear"],
      },
    ],
  },
  {
    name: "2024 Toyota Corolla LE FWD",
    meta: {
      Drivetrain: "FWD",
      "Fuel Type": "Gas",
      Transmission: "CVT",
      Mileage: "8,912 mi",
      "Exterior Color": "White",
      "Interior Color": "Light Gray",
      "Vehicle History": "Minor Accident / 1 Owner / Clean Title",
      Certification: "160-Point Inspection only (not Certified)",
    },
    features: [
      {
        name: "Safety & Driver Assist",
        features: [
          "Toyota Safety Sense 3.0",
          "Pre-Collision System",
          "Lane Departure Alert",
          "Automatic High Beams",
        ],
      },
      {
        name: "Comfort & Convenience",
        features: ["Fabric Seats", "Single-Zone Climate Control", "Push Button Start"],
      },
      {
        name: "Technology & Entertainment",
        features: ['8" Touchscreen Display', "Apple CarPlay/Android Auto", "Bluetooth"],
      },
      {
        name: "Exterior & Lighting",
        features: ["LED Headlights", "LED Taillights", '16" Steel Wheels'],
      },
    ],
  },
  {
    name: "2024 Toyota Sequoia Capstone i-FORCE MAX",
    meta: {
      Drivetrain: "4WD",
      "Fuel Type": "Hybrid",
      Transmission: "Automatic",
      Mileage: "6,300 mi",
      "Exterior Color": "Wind Chill Pearl",
      "Interior Color": "Black/Saddle",
      "Vehicle History": "No Accidents / 1 Owner / Clean Title",
      Certification: "Certified, 160-Point Inspection",
    },
    features: [
      {
        name: "Safety & Driver Assist",
        features: [
          "Toyota Safety Sense 2.5+",
          "Pre-Collision System",
          "Dynamic Radar Cruise Control",
          "Lane Departure Alert",
          "Automatic High Beams",
          "Blind Spot Monitor",
          "Rear Cross-Traffic Alert",
          "Parking Sensors",
          "360-Degree Camera",
          "Driver Monitor",
        ],
      },
      {
        name: "Comfort & Convenience",
        features: [
          "Semi-Aniline Leather Seats",
          "Heated & Ventilated Front Seats",
          "Heated & Ventilated Second Row",
          "Heated Steering Wheel",
          "Quad-Zone Climate Control",
          "Power Moonroof",
          "Memory Driver Seat",
          "Power-Folding Third Row",
          "Remote Start",
          "Hands-Free Liftgate",
        ],
      },
      {
        name: "Technology & Entertainment",
        features: [
          '14" Touchscreen Display',
          "Apple CarPlay/Android Auto",
          "JBL Premium Audio (14 Speaker)",
          "Head-Up Display",
          "Wireless Charging",
          "Wi-Fi Connect",
          "SiriusXM",
          "Digital Rearview Mirror",
          "Rear Seat Entertainment",
          "USB-C Ports",
        ],
      },
      {
        name: "Exterior & Lighting",
        features: [
          "LED Adaptive Headlights",
          "LED Fog Lights",
          "LED Sequential Taillights",
          "Power-Folding Heated Mirrors",
          "Running Boards",
          '22" Chrome Wheels',
          "Roof Rails",
        ],
      },
      {
        name: "Performance & Capability",
        features: [
          "i-FORCE MAX Hybrid V6 Twin-Turbo",
          "4WD",
          "Tow Package (9,020 lb)",
          "Adaptive Variable Suspension",
          "Crawl Control",
          "Multi-Terrain Select",
        ],
      },
      {
        name: "Seating & Capacity",
        features: [
          "7 Passenger",
          "Captain's Chairs (2nd Row)",
          "Power Second Row",
          "Power-Folding Third Row",
          "Fold-Flat Cargo",
          "Split-Folding",
        ],
      },
      {
        name: "Cargo & Utility",
        features: [
          "Power Liftgate",
          "Cargo Net",
          "Cargo Cover",
          "120V Power Outlet",
          "Tie-Down Points",
        ],
      },
      {
        name: "Acoustic & Ride",
        features: [
          "Acoustic Noise-Reducing Glass",
          "Adaptive Air Suspension",
          "Load-Leveling Rear Suspension",
        ],
      },
    ],
  },
];

const locationPool = [
  "Fort Worth, TX 76116",
  "Dallas, TX 75001",
  "Grapevine, TX 76051",
  "Irving, TX 75062",
];

const ratingTemplates: RatingData[] = [
  {
    rating: 4.8,
    reviewCount: 128,
    distribution: [
      { id: "5", stars: 5, count: 98 },
      { id: "4", stars: 4, count: 22 },
      { id: "3", stars: 3, count: 6 },
      { id: "2", stars: 2, count: 1 },
      { id: "1", stars: 1, count: 1 },
    ],
  },
  {
    rating: 4.6,
    reviewCount: 94,
    distribution: [
      { id: "5", stars: 5, count: 66 },
      { id: "4", stars: 4, count: 20 },
      { id: "3", stars: 3, count: 6 },
      { id: "2", stars: 2, count: 1 },
      { id: "1", stars: 1, count: 1 },
    ],
  },
  {
    rating: 4.9,
    reviewCount: 176,
    distribution: [
      { id: "5", stars: 5, count: 144 },
      { id: "4", stars: 4, count: 24 },
      { id: "3", stars: 3, count: 6 },
      { id: "2", stars: 2, count: 1 },
      { id: "1", stars: 1, count: 1 },
    ],
  },
];

const statusTemplates: VehicleStatusData[] = [
  {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  {
    noLongerAvailable: false,
    historyReportPending: true,
    inspectionInProgress: false,
    limitedPhotos: true,
  },
  {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: true,
    limitedPhotos: false,
  },
];

const prioritizedVehicles = [...mockVehicles].sort((a, b) => {
  if (a.vin === PRIORITY_VIN) {
    return -1;
  }
  if (b.vin === PRIORITY_VIN) {
    return 1;
  }
  return 0;
});

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 2_147_483_647;
  }
  return Math.abs(hash);
}

function pickByKey<T>(pool: T[], key: string): T {
  return pool[hashString(key) % pool.length] as T;
}

function normalizeImage(image: string | string[]): string[] {
  return Array.isArray(image) ? image : [image];
}

function parseDealerInfo(milesField: string): { name: string; distance: string } {
  const [nameRaw, distanceRaw] = milesField.split(" - ");
  return {
    name: nameRaw ?? "Toyota Dealer",
    distance: distanceRaw ?? "0.0mi",
  };
}

function parseMileage(value: string): string {
  return value.replace(MILES_SUFFIX_REGEX, "").trim();
}

function parseVehicleHistory(
  history: string
): Pick<HistoryData, "damageReported" | "previousOwners" | "titleStatus"> {
  const [accidentRaw = "", ownersRaw = "", titleRaw] = history
    .split("/")
    .map((part) => part.trim());
  const damageReported = accidentRaw.toLowerCase().includes("no accident") ? 0 : 1;
  const ownerMatch = ownersRaw.match(OWNER_COUNT_REGEX);
  const previousOwners = ownerMatch ? Number.parseInt(ownerMatch[1] ?? "1", 10) : 1;

  return {
    damageReported,
    previousOwners,
    titleStatus: titleRaw ?? "Title Status Unavailable",
  };
}

function parseCertification(certification: string): {
  certified: boolean;
  inspectionPassed: boolean;
} {
  const normalized = certification.toLowerCase();
  const certified = normalized.includes("certified") && !normalized.includes("not certified");
  const inspectionPassed = normalized.includes("160-point inspection");
  return { certified, inspectionPassed };
}

function resolveMpg(profile: VehicleProfile): string {
  const fuel = profile.meta["Fuel Type"].toLowerCase();
  const name = profile.name.toLowerCase();

  if (fuel.includes("hybrid")) {
    return "36-35";
  }
  if (name.includes("tundra")) {
    return "17-22";
  }
  return "28-39";
}

function resolveEngine(profile: VehicleProfile): string {
  const name = profile.name.toLowerCase();
  if (name.includes("i-force max")) {
    return "3.4L V6 Twin-Turbo Hybrid";
  }
  if (name.includes("hybrid")) {
    return "2.5L I4 Hybrid";
  }
  if (name.includes("corolla")) {
    return "2.0L I4";
  }
  return "2.5L I4";
}

function toVehicleDetail(vehicle: SearchVehicle, profile: VehicleProfile): VehicleDetail {
  const dealerInfo = parseDealerInfo(vehicle.miles);
  const certification = parseCertification(profile.meta.Certification);
  const id = String(vehicle.id);

  return {
    id,
    title: profile.name,
    year: vehicle.year,
    make: "Toyota",
    model: vehicle.model.replace(/-/g, " "),
    trim: vehicle.variant.replace(/-/g, " "),
    price: vehicle.price,
    originalPrice: vehicle.oldPrice ?? vehicle.price,
    condition: vehicle.labels[0] ?? "Fair Price",
    warranty: certification.certified,
    inspected: certification.inspectionPassed,
    miles: parseMileage(profile.meta.Mileage),
    drivetrain: profile.meta.Drivetrain,
    fuelType: profile.meta["Fuel Type"],
    transmission: profile.meta.Transmission,
    mpg: resolveMpg(profile),
    stock: `VDP${id.padStart(5, "0")}`,
    vin: vehicle.vin,
    exteriorColor: profile.meta["Exterior Color"],
    interiorColor: profile.meta["Interior Color"],
    certified: certification.certified,
    inspectionPassed: certification.inspectionPassed,
    dealer: {
      name: dealerInfo.name,
      location: pickByKey(locationPool, vehicle.vin),
      distance: dealerInfo.distance,
    },
    images: normalizeImage(vehicle.image),
    highlights: profile.features.flatMap((section) => section.features).slice(0, 6),
  };
}

function toHistoryData(vehicle: SearchVehicle, profile: VehicleProfile): HistoryData {
  const parsed = parseVehicleHistory(profile.meta["Vehicle History"]);
  return {
    vin: vehicle.vin,
    vehicleDescription: profile.name,
    damageReported: parsed.damageReported,
    previousOwners: parsed.previousOwners,
    servicesOnRecord: 1 + (hashString(`${vehicle.vin}-service`) % 6),
    repairsReported: parsed.damageReported,
    ownerTypes: Array.from({ length: Math.max(1, parsed.previousOwners) }, () => "Personal"),
    lastOdometerReading: Number.parseInt(parseMileage(profile.meta.Mileage).replace(/,/g, ""), 10),
    titleStatus: parsed.titleStatus,
  };
}

function toPricingData(vehicle: SearchVehicle): PricingData {
  const spread = 1200 + (hashString(vehicle.vin) % 2600);
  return {
    currentPrice: vehicle.price,
    avgPrice: vehicle.oldPrice ?? vehicle.price + spread,
    daysOnSite: 3 + (hashString(`${vehicle.vin}-days`) % 28),
    views: 200 + (hashString(`${vehicle.vin}-views`) % 900),
    saves: 10 + (hashString(`${vehicle.vin}-saves`) % 220),
  };
}

function toPriceHistory(vehicle: SearchVehicle): PriceHistoryEntry[] {
  const currentPrice = vehicle.price;
  const oldPrice = vehicle.oldPrice ?? currentPrice + 1800;
  const step1 = Math.round((oldPrice - currentPrice) * 0.55);
  const step2 = Math.round((oldPrice - currentPrice) * 0.8);

  return [
    { date: "2026-03-01", price: currentPrice, change: 0 },
    { date: "2026-02-10", price: oldPrice - step1, change: -step1 },
    {
      date: "2026-01-15",
      price: oldPrice - Math.round(step2),
      change: -Math.round(step2 - step1),
    },
    {
      date: "2025-12-05",
      price: oldPrice,
      change: -Math.round(oldPrice - (oldPrice - step2)),
    },
  ];
}

function toVehicleData(vehicle: SearchVehicle, profile: VehicleProfile): VehicleData {
  const id = String(vehicle.id);
  const rating = pickByKey(ratingTemplates, `${id}-rating`);
  const status = pickByKey(statusTemplates, `${id}-status`);

  const specs: VehicleSpecData[] = [
    { key: "engine", label: "Engine", value: resolveEngine(profile) },
    { key: "fuel-type", label: "Fuel Type", value: profile.meta["Fuel Type"] },
    { key: "transmission", label: "Transmission", value: profile.meta.Transmission },
    { key: "drivetrain", label: "Drivetrain", value: profile.meta.Drivetrain },
    { key: "mileage", label: "Mileage", value: profile.meta.Mileage },
    { key: "exterior-color", label: "Exterior Color", value: profile.meta["Exterior Color"] },
    { key: "interior-color", label: "Interior Color", value: profile.meta["Interior Color"] },
  ];

  return {
    specs,
    features: profile.features.map((section) => ({
      name: section.name,
      features: [...section.features],
    })),
    featuresInitialCount: 4,
    rating: {
      rating: rating.rating,
      reviewCount: rating.reviewCount,
      distribution: rating.distribution.map((item) => ({ ...item })),
    },
    vehicleStatus: { ...status, featuresTableView: false },
  };
}

const mockInventoryByVin = Object.fromEntries(
  prioritizedVehicles.map((vehicle) => {
    const profile = pickByKey(VEHICLE_PROFILES, `${vehicle.vin}-profile`);

    return [
      vehicle.vin,
      {
        vinData: {
          vehicle: toVehicleDetail(vehicle, profile),
          pricing: toPricingData(vehicle),
          priceHistory: toPriceHistory(vehicle),
          history: toHistoryData(vehicle, profile),
        } satisfies VinData,
        vehicleData: toVehicleData(vehicle, profile),
      },
    ];
  })
) as Record<string, { vinData: VinData; vehicleData: VehicleData }>;

const vinByVehicleId = Object.fromEntries(
  prioritizedVehicles.map((vehicle) => [String(vehicle.id), vehicle.vin])
) as Record<string, string>;

async function mockApiCall<T>(resolver: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
  return resolver();
}

export async function fetchMockVinData(vin: string): Promise<VinData> {
  return await mockApiCall(() => {
    const record = mockInventoryByVin[vin];
    if (!record) {
      throw new Error(`Mock API: vehicle with VIN ${vin} not found`);
    }
    return record.vinData;
  });
}

export async function fetchMockVehicleData(id: string): Promise<VehicleData> {
  return await mockApiCall(() => {
    const vin = vinByVehicleId[id];
    const record = vin ? mockInventoryByVin[vin] : undefined;

    if (!record) {
      throw new Error(`Mock API: vehicle details for id ${id} not found`);
    }

    return record.vehicleData;
  });
}
