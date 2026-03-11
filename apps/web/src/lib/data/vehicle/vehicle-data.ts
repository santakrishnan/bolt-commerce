import type { FeatureCategory, RatingData, VehicleSpecData, VehicleStatusData } from "./types";

// ---------------------------------------------------------------------------
// Mock vehicle specs by vehicle ID (Second API call with vehicle.id)
// ---------------------------------------------------------------------------

export const specsById: Record<string, VehicleSpecData[]> = {
  "1": [
    // Toyota Highlander
    { key: "engine", label: "Engine", value: "3.5L V6" },
    { key: "interior-color", label: "Interior Color", value: "Black" },
    { key: "exterior-color", label: "Exterior Color", value: "Grey Metallic" },
    { key: "mpg", label: "MPG", value: "18 city / 35 highway" },
    { key: "mileage", label: "Mileage", value: "15,400 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "8-Speed Automatic" },
  ],
  "2": [
    // Toyota Camry
    { key: "engine", label: "Engine", value: "2.5L I4" },
    { key: "interior-color", label: "Interior Color", value: "Black" },
    { key: "exterior-color", label: "Exterior Color", value: "Pearl White" },
    { key: "mpg", label: "MPG", value: "28 city / 39 highway" },
    { key: "mileage", label: "Mileage", value: "12,320 mi" },
    { key: "location", label: "Location", value: "Dallas, TX 75001" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "8-Speed Automatic" },
  ],
  "3": [
    // Toyota Corolla
    { key: "engine", label: "Engine", value: "2.0L I4" },
    { key: "interior-color", label: "Interior Color", value: "Black" },
    { key: "exterior-color", label: "Exterior Color", value: "Modern Steel Metallic" },
    { key: "mpg", label: "MPG", value: "30 city / 38 highway" },
    { key: "mileage", label: "Mileage", value: "45,200 mi" },
    { key: "location", label: "Location", value: "Arlington, TX 76015" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "CVT" },
  ],
  "4": [
    // Toyota RAV4
    { key: "engine", label: "Engine", value: "2.5L I4" },
    { key: "interior-color", label: "Interior Color", value: "Black Leather" },
    { key: "exterior-color", label: "Exterior Color", value: "Alpine White" },
    { key: "mpg", label: "MPG", value: "27 city / 35 highway" },
    { key: "mileage", label: "Mileage", value: "22,150 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76132" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "8-Speed Automatic" },
  ],
  "5": [
    // Toyota 4Runner
    { key: "engine", label: "Engine", value: "4.0L V6" },
    { key: "interior-color", label: "Interior Color", value: "Black" },
    { key: "exterior-color", label: "Exterior Color", value: "Midnight Black Metallic" },
    { key: "mpg", label: "MPG", value: "16 city / 19 highway" },
    { key: "mileage", label: "Mileage", value: "68,900 mi" },
    { key: "location", label: "Location", value: "Irving, TX 75062" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "4WD" },
    { key: "transmission", label: "Transmission", value: "5-Speed Automatic" },
  ],
};

// ---------------------------------------------------------------------------
// Mock features by vehicle ID
// ---------------------------------------------------------------------------

export const featuresById: Record<string, FeatureCategory[]> = {
  "1": [
    // Toyota Highlander
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
  ],
  "2": [
    // Toyota Camry
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Emergency Braking",
        "Blind Spot Warning",
        "Lane Departure Warning",
      ],
    },
    {
      name: "Technology",
      features: [
        '9" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "Premium Audio System",
        "Wireless Connectivity",
        "Wi-Fi Connect",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Ventilated Front Seats",
        "SofTex Seating",
        "Power Moonroof",
        "Dual-Zone Climate Control",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Daytime Running Lights",
        "Power Side Mirrors",
        '18" Alloy Wheels',
        "Dual Exhaust",
      ],
    },
  ],
  "3": [
    // Toyota Corolla
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.0",
        "Pre-Collision System",
        "Road Departure Alert",
        "Adaptive Cruise Control",
        "Lane Keeping Assist",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Display Audio',
        "Apple CarPlay/Android Auto",
        "Wireless Charging",
        "Bluetooth Hands-Free",
        "USB Ports",
      ],
    },
    {
      name: "Interior",
      features: [
        "Sport Cloth Seats",
        "Dual-Zone Climate Control",
        "Power Driver Seat",
        "60/40 Split Rear Seat",
        "Cargo Net",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Taillights",
        "Power Side Mirrors",
        '18" Alloy Wheels',
        "Dual Exhaust",
      ],
    },
  ],
  "4": [
    // Toyota RAV4
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5+",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Lane Departure Alert",
        "Blind Spot Monitor",
      ],
    },
    {
      name: "Technology",
      features: [
        "Entune 3.0 Audio Plus",
        '8" Touchscreen Display',
        "Head-Up Display",
        "Wireless Apple CarPlay",
        "JBL Premium Audio",
      ],
    },
    {
      name: "Interior",
      features: [
        "SofTex Seats",
        "Leather Trim",
        "Power Liftgate",
        "Dual-Zone Climate Control",
        "Ambient Lighting",
      ],
    },
    {
      name: "Exterior",
      features: [
        "Sport Design Package",
        "Adaptive LED Headlights",
        '19" Alloy Wheels',
        "Roof Rails",
        "Power Mirrors",
      ],
    },
  ],
  "5": [
    // Toyota 4Runner
    {
      name: "Safety",
      features: [
        "Blind Spot Monitoring",
        "Rear Cross Traffic Alert",
        "Backup Camera",
        "Adaptive Cruise Control",
        "Forward Collision Warning",
      ],
    },
    {
      name: "Technology",
      features: [
        "Entune Premium Audio",
        "Apple CarPlay/Android Auto",
        "SiriusXM Satellite Radio",
        "Premium JBL Audio",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Leather-Trimmed Seats",
        "Heated Front Seats",
        "Heated Steering Wheel",
        "Power Liftgate",
        "Sliding Rear Cargo Deck",
      ],
    },
    {
      name: "Capability",
      features: [
        "Multi-Terrain Select",
        "Crawl Control",
        "Kinetic Dynamic Suspension",
        "Hill Descent Control",
        "5,000 lbs Towing Capacity",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Mock ratings by vehicle ID
// ---------------------------------------------------------------------------

export const ratingById: Record<string, RatingData> = {
  "1": {
    // Toyota Highlander
    rating: 4.7,
    reviewCount: 118,
    distribution: [
      { stars: 5, count: 488, id: "0" },
      { stars: 4, count: 74, id: "1" },
      { stars: 3, count: 14, id: "2" },
      { stars: 2, count: 0, id: "3" },
      { stars: 1, count: 0, id: "4" },
    ],
  },
  "2": {
    // Toyota Camry
    rating: 4.8,
    reviewCount: 256,
    distribution: [
      { stars: 5, count: 890, id: "0" },
      { stars: 4, count: 45, id: "1" },
      { stars: 3, count: 12, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  "3": {
    // Toyota Corolla
    rating: 4.6,
    reviewCount: 342,
    distribution: [
      { stars: 5, count: 612, id: "0" },
      { stars: 4, count: 156, id: "1" },
      { stars: 3, count: 42, id: "2" },
      { stars: 2, count: 8, id: "3" },
      { stars: 1, count: 4, id: "4" },
    ],
  },
  "4": {
    // Toyota RAV4
    rating: 4.7,
    reviewCount: 189,
    distribution: [
      { stars: 5, count: 324, id: "0" },
      { stars: 4, count: 98, id: "1" },
      { stars: 3, count: 18, id: "2" },
      { stars: 2, count: 6, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  "5": {
    // Toyota 4Runner
    rating: 4.5,
    reviewCount: 198,
    distribution: [
      { stars: 5, count: 445, id: "0" },
      { stars: 4, count: 167, id: "1" },
      { stars: 3, count: 56, id: "2" },
      { stars: 2, count: 21, id: "3" },
      { stars: 1, count: 12, id: "4" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Mock vehicle status by vehicle ID
// ---------------------------------------------------------------------------

export const vehicleStatusById: Record<string, VehicleStatusData> = {
  "1": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  "2": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  "3": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: true,
  },
  "4": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  "5": {
    noLongerAvailable: true,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
};
