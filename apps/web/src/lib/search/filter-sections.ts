export interface PriceFilter {
  min: number;
  max: number;
  quickRanges: string[];
}

export interface YearFilter {
  min: number;
  max: number;
  popularRanges: string[];
}

export interface MileageFilter {
  min: number;
  max: number;
  quickFilters: string[];
}

export interface FilterSections {
  price: PriceFilter;
  year: YearFilter;
  mileage: MileageFilter;
  bodyStyle: string[];
  exteriorColors: string[];
  interiorColors: string[];
  popularModels: string[];
  fuelTypes: string[];
  safetyFeatures: string[];
  comfortFeatures: string[];
  techFeatures: string[];
  exteriorFeatures: string[];
  performanceFeatures: string[];
  seatingCapacity: string[];
  drivetrains: string[];
  transmissions: string[];
}

export const filterSections: FilterSections = {
  price: {
    min: 5000,
    max: 70_000,
    quickRanges: ["$10k or less", "$20k or less", "$30k or less", "$40k or less", "$50k or less"],
  },
  year: { min: 2015, max: 2025, popularRanges: ["2023 or newer", "2019-2021", "2015-2018"] },
  mileage: {
    min: 0,
    max: 100_000,
    quickFilters: ["Under 15k mi", "Under 30k mi", "Under 50k mi", "Under 75k mi", "Under 100k mi"],
  },
  bodyStyle: ["Sedan", "SUV", "Truck", "Coupe", "Hatchback", "Wagon", "Van", "Convertible"],
  exteriorColors: [
    "White",
    "Black",
    "Midnight Gray",
    "Metallic Green",
    "Deep Red",
    "Graphite",
    "Luminous Yellow",
    "Ocean Blue",
    "Electric Blue",
  ],
  interiorColors: [
    "White",
    "Black",
    "Midnight Gray",
    "Metallic Green",
    "Deep Red",
    "Graphite",
    "Luminous Yellow",
    "Ocean Blue",
    "Electric Blue",
  ],
  popularModels: [
    "Camry",
    "Corolla",
    "RAV4",
    "Highlander",
    "Tacoma",
    "Tundra",
    "4Runner",
    "Sienna",
    "Prius",
    "Crown",
    "Sequoia",
    "GR86",
    "Supra",
    "Avalon",
    "C-HR",
    "Venza",
    "GR Corolla",
    "bZ4X",
    "Land Cruiser",
    "Mirai",
    "GR Supra",
    "Yaris",
  ],
  fuelTypes: [
    "Gasoline (Gas)",
    "Diesel (Diesel)",
    "Hybrid (Hybrid)",
    "Plug-in Hybrid (PHEV)",
    "Electric (Electric)",
    "Flex Fuel (Flex)",
  ],
  safetyFeatures: [
    "PCS",
    "LDA",
    "ACC",
    "BSM",
    "RCTA",
    "LTA",
    "RSA",
    "Auto High Beams",
    "Parking Sensors",
    "FCW",
    "360 Camera",
    "Backup Camera",
    "AHB",
    "Driver Monitor",
    "Safe Exit",
    "Trailer Sway",
    "Hill Start",
  ],
  comfortFeatures: [
    "Leather",
    "SofTex",
    "Heated Seats",
    "Ventilated",
    "Heated Rear",
    "Heated Wheel",
    "Power Liftgate",
    "Hands-Free",
    "Remote Start",
    "Keyless",
    "Push Start",
    "Dual Climate",
    "Tri-Zone",
    "Safe Exit",
    "Moonroof",
    "Panoramic",
    "Memory Seats",
  ],
  techFeatures: [
    "Wireless CarPlay",
    "Wireless Android",
    "Navigation",
    "Wireless Charging",
    "JBL Audio",
    "Heads-Up Display",
    "Digital Cluster",
    "12+ Screen",
    "14+ Screen",
    "USB-C",
    "WiFi Hotspot",
    "Bluetooth",
    "Apple CarPlay",
    "Android Auto",
    "SiriusXM",
    "Rear Entertainment",
    "Digital Mirror",
  ],
  exteriorFeatures: [
    "LED Headlights",
    "LED Fog",
    "LED Taillights",
    "Adaptive Lights",
    "Folding Mirrors",
    "Auto Dim Mirrors",
    "Roof Rails",
    "Running Boards",
    "Tow Package",
    "Bed Liner",
    "Tonneau Cover",
    "Heated Mirrors",
  ],
  performanceFeatures: [
    "AWD/4WD",
    "Hybrid",
    "PHEV",
    "Turbo",
    "V6",
    "HFORCE MAX",
    "TRD Suspension",
    "Adaptive Suspension",
    "Multi-Terrain",
    "Crawl Control",
    "Locking Diff",
    "Sport Mode",
  ],
  seatingCapacity: [
    "Third Row",
    "7 Passenger",
    "8 Passenger",
    "Captain's Chairs",
    "Power Front",
    "Fold Flat",
    "Split Folding",
  ],
  drivetrains: ["AWD", "FWD", "RWD", "4WD"],
  transmissions: ["Automatic", "CVT", "Manual"],
};
