import type { FeatureCategory, RatingData, VehicleSpecData, VehicleStatusData } from "./types";

// ---------------------------------------------------------------------------
// Mock vehicle specs by vehicle ID (Second API call with vehicle.id)
// ---------------------------------------------------------------------------

export const specsById: Record<string, VehicleSpecData[]> = {
  // 1. 2023 Toyota Corolla Cross
  "1": [
    { key: "engine", label: "Engine", value: "2.0L I4" },
    { key: "interior-color", label: "Interior Color", value: "Black SofTex" },
    { key: "exterior-color", label: "Exterior Color", value: "Wind Chill Pearl" },
    { key: "mpg", label: "MPG", value: "28-32" },
    { key: "mileage", label: "Mileage", value: "18,000 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "CVT" },
  ],
  // 2. 2022 Toyota RAV4 Hybrid
  "2": [
    { key: "engine", label: "Engine", value: "2.5L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Ash Fabric" },
    { key: "exterior-color", label: "Exterior Color", value: "Midnight Black Metallic" },
    { key: "mpg", label: "MPG", value: "41-38" },
    { key: "mileage", label: "Mileage", value: "24,600 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 3. 2023 Toyota RAV4 Hybrid
  "3": [
    { key: "engine", label: "Engine", value: "2.5L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Boulder" },
    { key: "exterior-color", label: "Exterior Color", value: "Celestial Silver" },
    { key: "mpg", label: "MPG", value: "41-38" },
    { key: "mileage", label: "Mileage", value: "21,000 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 4. 2023 Toyota RAV4 Hybrid
  "4": [
    { key: "engine", label: "Engine", value: "2.5L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Macadamia" },
    { key: "exterior-color", label: "Exterior Color", value: "Ruby Flare Pearl" },
    { key: "mpg", label: "MPG", value: "41-38" },
    { key: "mileage", label: "Mileage", value: "21,000 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 5. 2024 Toyota RAV4 Hybrid
  "5": [
    { key: "engine", label: "Engine", value: "2.5L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Cockpit Red" },
    { key: "exterior-color", label: "Exterior Color", value: "Ruby Flare Pearl" },
    { key: "mpg", label: "MPG", value: "41-38" },
    { key: "mileage", label: "Mileage", value: "24,500 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 6. 2022 Toyota Yaris Cross Hybrid Active
  "6": [
    { key: "engine", label: "Engine", value: "1.5L I3 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Boulder" },
    { key: "exterior-color", label: "Exterior Color", value: "Blueprint" },
    { key: "mpg", label: "MPG", value: "40-36" },
    { key: "mileage", label: "Mileage", value: "16,000 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 7. 2023 Toyota Corolla Cross
  "7": [
    { key: "engine", label: "Engine", value: "2.0L I4" },
    { key: "interior-color", label: "Interior Color", value: "Harvest Beige" },
    { key: "exterior-color", label: "Exterior Color", value: "Wind Chill Pearl" },
    { key: "mpg", label: "MPG", value: "28-32" },
    { key: "mileage", label: "Mileage", value: "18,000 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "CVT" },
  ],
  // 8. 2024 Toyota RAV4 Hybrid
  "8": [
    { key: "engine", label: "Engine", value: "2.5L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Moonstone" },
    { key: "exterior-color", label: "Exterior Color", value: "Magnetic Gray Metallic" },
    { key: "mpg", label: "MPG", value: "41-38" },
    { key: "mileage", label: "Mileage", value: "5,000 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 9. 2020 Toyota Venza Limited Edition
  "9": [
    { key: "engine", label: "Engine", value: "2.5L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Moonstone" },
    { key: "exterior-color", label: "Exterior Color", value: "Ruby Flare Pearl" },
    { key: "mpg", label: "MPG", value: "40-37" },
    { key: "mileage", label: "Mileage", value: "9,000 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 10. 2022 Toyota Yaris Cross Hybrid Active
  "10": [
    { key: "engine", label: "Engine", value: "1.5L I3 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Macadamia" },
    { key: "exterior-color", label: "Exterior Color", value: "Cavalry Blue" },
    { key: "mpg", label: "MPG", value: "40-36" },
    { key: "mileage", label: "Mileage", value: "11,050 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 11. 2025 Toyota RAV4 Limited Edition
  "11": [
    { key: "engine", label: "Engine", value: "2.5L I4" },
    { key: "interior-color", label: "Interior Color", value: "Light Gray" },
    { key: "exterior-color", label: "Exterior Color", value: "Celestial Silver" },
    { key: "mpg", label: "MPG", value: "27-35" },
    { key: "mileage", label: "Mileage", value: "15,000 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "8-Speed Automatic" },
  ],
  // 12. 2020 Toyota Corolla Cross Limited
  "12": [
    { key: "engine", label: "Engine", value: "2.0L I4" },
    { key: "interior-color", label: "Interior Color", value: "Moonstone" },
    { key: "exterior-color", label: "Exterior Color", value: "Midnight Black Metallic" },
    { key: "mpg", label: "MPG", value: "28-32" },
    { key: "mileage", label: "Mileage", value: "17,200 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "CVT" },
  ],
  // 13. 2025 Toyota RAV4 Limited Edition
  "13": [
    { key: "engine", label: "Engine", value: "2.5L I4" },
    { key: "interior-color", label: "Interior Color", value: "Moonstone" },
    { key: "exterior-color", label: "Exterior Color", value: "Supersonic Red" },
    { key: "mpg", label: "MPG", value: "27-35" },
    { key: "mileage", label: "Mileage", value: "21,000 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "8-Speed Automatic" },
  ],
  // 14. 2023 Toyota Camry XSE
  "14": [
    { key: "engine", label: "Engine", value: "2.5L I4" },
    { key: "interior-color", label: "Interior Color", value: "Ash Fabric" },
    { key: "exterior-color", label: "Exterior Color", value: "Wind Chill Pearl" },
    { key: "mpg", label: "MPG", value: "28-39" },
    { key: "mileage", label: "Mileage", value: "12,500 mi" },
    { key: "location", label: "Location", value: "Dallas, TX 75001" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "8-Speed Automatic" },
  ],
  // 15. 2024 Toyota Highlander Hybrid
  "15": [
    { key: "engine", label: "Engine", value: "2.5L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Macadamia" },
    { key: "exterior-color", label: "Exterior Color", value: "Blueprint" },
    { key: "mpg", label: "MPG", value: "36-35" },
    { key: "mileage", label: "Mileage", value: "8,200 mi" },
    { key: "location", label: "Location", value: "Grapevine, TX 76051" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 16. 2022 Toyota Tacoma TRD Pro
  "16": [
    { key: "engine", label: "Engine", value: "3.5L V6" },
    { key: "interior-color", label: "Interior Color", value: "Light Gray" },
    { key: "exterior-color", label: "Exterior Color", value: "Ruby Flare Pearl" },
    { key: "mpg", label: "MPG", value: "18-24" },
    { key: "mileage", label: "Mileage", value: "28,400 mi" },
    { key: "location", label: "Location", value: "Irving, TX 75062" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "4WD" },
    { key: "transmission", label: "Transmission", value: "6-Speed Automatic" },
  ],
  // 17. 2023 Toyota Tundra CrewMax
  "17": [
    { key: "engine", label: "Engine", value: "3.5L V6 Twin Turbo" },
    { key: "interior-color", label: "Interior Color", value: "Moonstone" },
    { key: "exterior-color", label: "Exterior Color", value: "Midnight Black Metallic" },
    { key: "mpg", label: "MPG", value: "17-22" },
    { key: "mileage", label: "Mileage", value: "15,800 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "4WD" },
    { key: "transmission", label: "Transmission", value: "10-Speed Automatic" },
  ],
  // 18. 2024 Toyota Prius Prime
  "18": [
    { key: "engine", label: "Engine", value: "2.5L I4 PHEV" },
    { key: "interior-color", label: "Interior Color", value: "Harvest Beige" },
    { key: "exterior-color", label: "Exterior Color", value: "Ice Cap" },
    { key: "mpg", label: "MPG", value: "220 MPGe" },
    { key: "mileage", label: "Mileage", value: "3,200 mi" },
    { key: "location", label: "Location", value: "Dallas, TX 75001" },
    { key: "fuel-type", label: "Fuel Type", value: "Plug-In Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 19. 2021 Toyota 4Runner TRD Off-Road
  "19": [
    { key: "engine", label: "Engine", value: "4.0L V6" },
    { key: "interior-color", label: "Interior Color", value: "Light Gray" },
    { key: "exterior-color", label: "Exterior Color", value: "Ice Cap" },
    { key: "mpg", label: "MPG", value: "16-18" },
    { key: "mileage", label: "Mileage", value: "35,600 mi" },
    { key: "location", label: "Location", value: "Grapevine, TX 76051" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "4WD" },
    { key: "transmission", label: "Transmission", value: "5-Speed Automatic" },
  ],
  // 20. 2023 Toyota Sienna Platinum
  "20": [
    { key: "engine", label: "Engine", value: "2.5L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Moonstone" },
    { key: "exterior-color", label: "Exterior Color", value: "Magnetic Gray Metallic" },
    { key: "mpg", label: "MPG", value: "35-36" },
    { key: "mileage", label: "Mileage", value: "19,200 mi" },
    { key: "location", label: "Location", value: "Irving, TX 75062" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 21. 2024 Toyota Crown Platinum
  "21": [
    { key: "engine", label: "Engine", value: "2.4L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Moonstone" },
    { key: "exterior-color", label: "Exterior Color", value: "Supersonic Red" },
    { key: "mpg", label: "MPG", value: "30-41" },
    { key: "mileage", label: "Mileage", value: "6,100 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "6-Speed Automatic" },
  ],
  // 22. 2022 Toyota GR86 Premium
  "22": [
    { key: "engine", label: "Engine", value: "2.4L H4" },
    { key: "interior-color", label: "Interior Color", value: "Boulder" },
    { key: "exterior-color", label: "Exterior Color", value: "Midnight Black Metallic" },
    { key: "mpg", label: "MPG", value: "20-27" },
    { key: "mileage", label: "Mileage", value: "22,300 mi" },
    { key: "location", label: "Location", value: "Dallas, TX 75001" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "RWD" },
    { key: "transmission", label: "Transmission", value: "6-Speed Manual" },
  ],
  // 23. 2023 Toyota Supra 3.0
  "23": [
    { key: "engine", label: "Engine", value: "3.0L I6 Twin Turbo" },
    { key: "interior-color", label: "Interior Color", value: "Light Gray" },
    { key: "exterior-color", label: "Exterior Color", value: "Celestial Silver" },
    { key: "mpg", label: "MPG", value: "22-30" },
    { key: "mileage", label: "Mileage", value: "11,500 mi" },
    { key: "location", label: "Location", value: "Grapevine, TX 76051" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "RWD" },
    { key: "transmission", label: "Transmission", value: "8-Speed Automatic" },
  ],
  // 24. 2024 Toyota bZ4X Limited
  "24": [
    { key: "engine", label: "Engine", value: "Electric" },
    { key: "interior-color", label: "Interior Color", value: "Macadamia" },
    { key: "exterior-color", label: "Exterior Color", value: "Magnetic Gray Metallic" },
    { key: "mpg", label: "MPG", value: "121 MPGe" },
    { key: "mileage", label: "Mileage", value: "4,800 mi" },
    { key: "location", label: "Location", value: "Irving, TX 75062" },
    { key: "fuel-type", label: "Fuel Type", value: "Electric" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "Single-Speed" },
  ],
  // 25. 2021 Toyota Avalon TRD
  "25": [
    { key: "engine", label: "Engine", value: "3.5L V6" },
    { key: "interior-color", label: "Interior Color", value: "Macadamia" },
    { key: "exterior-color", label: "Exterior Color", value: "Midnight Black Metallic" },
    { key: "mpg", label: "MPG", value: "22-31" },
    { key: "mileage", label: "Mileage", value: "31,200 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "8-Speed Automatic" },
  ],
  // 26. 2023 Toyota C-HR Nightshade
  "26": [
    { key: "engine", label: "Engine", value: "2.0L I4" },
    { key: "interior-color", label: "Interior Color", value: "Cockpit Red" },
    { key: "exterior-color", label: "Exterior Color", value: "Ruby Flare Pearl" },
    { key: "mpg", label: "MPG", value: "27-31" },
    { key: "mileage", label: "Mileage", value: "14,600 mi" },
    { key: "location", label: "Location", value: "Dallas, TX 75001" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "CVT" },
  ],
  // 27. 2024 Toyota Sequoia Capstone
  "27": [
    { key: "engine", label: "Engine", value: "3.5L V6 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Boulder" },
    { key: "exterior-color", label: "Exterior Color", value: "Ice Cap" },
    { key: "mpg", label: "MPG", value: "19-22" },
    { key: "mileage", label: "Mileage", value: "2,100 mi" },
    { key: "location", label: "Location", value: "Grapevine, TX 76051" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "4WD" },
    { key: "transmission", label: "Transmission", value: "10-Speed Automatic" },
  ],
  // 28. 2022 Toyota GR Corolla Core
  "28": [
    { key: "engine", label: "Engine", value: "1.6L I3 Turbo" },
    { key: "interior-color", label: "Interior Color", value: "Moonstone" },
    { key: "exterior-color", label: "Exterior Color", value: "Army Green" },
    { key: "mpg", label: "MPG", value: "21-28" },
    { key: "mileage", label: "Mileage", value: "18,700 mi" },
    { key: "location", label: "Location", value: "Irving, TX 75062" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "6-Speed Manual" },
  ],
  // 29. 2023 Toyota Land Cruiser
  "29": [
    { key: "engine", label: "Engine", value: "3.3L V6 Twin Turbo" },
    { key: "interior-color", label: "Interior Color", value: "Saddle Tan" },
    { key: "exterior-color", label: "Exterior Color", value: "Cavalry Blue" },
    { key: "mpg", label: "MPG", value: "22-26" },
    { key: "mileage", label: "Mileage", value: "9,400 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "4WD" },
    { key: "transmission", label: "Transmission", value: "10-Speed Automatic" },
  ],
  // 30. 2024 Toyota Mirai Limited
  "30": [
    { key: "engine", label: "Engine", value: "Hydrogen FCEV" },
    { key: "interior-color", label: "Interior Color", value: "Cockpit Red" },
    { key: "exterior-color", label: "Exterior Color", value: "Magnetic Gray Metallic" },
    { key: "mpg", label: "MPG", value: "76 MPGe" },
    { key: "mileage", label: "Mileage", value: "1,200 mi" },
    { key: "location", label: "Location", value: "Dallas, TX 75001" },
    { key: "fuel-type", label: "Fuel Type", value: "Hydrogen" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "Single-Speed" },
  ],
  // 31. 2022 Toyota Camry Hybrid LE
  "31": [
    { key: "engine", label: "Engine", value: "2.5L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Cockpit Red" },
    { key: "exterior-color", label: "Exterior Color", value: "Army Green" },
    { key: "mpg", label: "MPG", value: "51-53" },
    { key: "mileage", label: "Mileage", value: "42,100 mi" },
    { key: "location", label: "Location", value: "Grapevine, TX 76051" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 32. 2023 Toyota Corolla Hatchback XSE
  "32": [
    { key: "engine", label: "Engine", value: "2.0L I4" },
    { key: "interior-color", label: "Interior Color", value: "Boulder" },
    { key: "exterior-color", label: "Exterior Color", value: "Magnetic Gray Metallic" },
    { key: "mpg", label: "MPG", value: "30-37" },
    { key: "mileage", label: "Mileage", value: "16,300 mi" },
    { key: "location", label: "Location", value: "Irving, TX 75062" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "6-Speed iMT" },
  ],
  // 33. 2024 Toyota Venza Nightshade
  "33": [
    { key: "engine", label: "Engine", value: "2.5L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Ash Fabric" },
    { key: "exterior-color", label: "Exterior Color", value: "Ice Cap" },
    { key: "mpg", label: "MPG", value: "40-37" },
    { key: "mileage", label: "Mileage", value: "7,500 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 34. 2021 Toyota RAV4 Prime SE
  "34": [
    { key: "engine", label: "Engine", value: "2.5L I4 PHEV" },
    { key: "interior-color", label: "Interior Color", value: "Cockpit Red" },
    { key: "exterior-color", label: "Exterior Color", value: "Magnetic Gray Metallic" },
    { key: "mpg", label: "MPG", value: "94 MPGe" },
    { key: "mileage", label: "Mileage", value: "29,800 mi" },
    { key: "location", label: "Location", value: "Dallas, TX 75001" },
    { key: "fuel-type", label: "Fuel Type", value: "Plug-In Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 35. 2023 Toyota Highlander Bronze Edition
  "35": [
    { key: "engine", label: "Engine", value: "3.5L V6" },
    { key: "interior-color", label: "Interior Color", value: "Harvest Beige" },
    { key: "exterior-color", label: "Exterior Color", value: "Celestial Silver" },
    { key: "mpg", label: "MPG", value: "20-27" },
    { key: "mileage", label: "Mileage", value: "13,400 mi" },
    { key: "location", label: "Location", value: "Grapevine, TX 76051" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "8-Speed Automatic" },
  ],
  // 36. 2024 Toyota Tacoma Limited
  "36": [
    { key: "engine", label: "Engine", value: "3.5L V6" },
    { key: "interior-color", label: "Interior Color", value: "Harvest Beige" },
    { key: "exterior-color", label: "Exterior Color", value: "Magnetic Gray Metallic" },
    { key: "mpg", label: "MPG", value: "18-24" },
    { key: "mileage", label: "Mileage", value: "5,600 mi" },
    { key: "location", label: "Location", value: "Irving, TX 75062" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "4WD" },
    { key: "transmission", label: "Transmission", value: "6-Speed Automatic" },
  ],
  // 37. 2022 Toyota Tundra SR5
  "37": [
    { key: "engine", label: "Engine", value: "3.5L V6 Twin Turbo" },
    { key: "interior-color", label: "Interior Color", value: "Harvest Beige" },
    { key: "exterior-color", label: "Exterior Color", value: "Cavalry Blue" },
    { key: "mpg", label: "MPG", value: "17-22" },
    { key: "mileage", label: "Mileage", value: "33,700 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "4WD" },
    { key: "transmission", label: "Transmission", value: "10-Speed Automatic" },
  ],
  // 38. 2023 Toyota Prius XLE
  "38": [
    { key: "engine", label: "Engine", value: "2.0L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Harvest Beige" },
    { key: "exterior-color", label: "Exterior Color", value: "Army Green" },
    { key: "mpg", label: "MPG", value: "57-56" },
    { key: "mileage", label: "Mileage", value: "11,900 mi" },
    { key: "location", label: "Location", value: "Dallas, TX 75001" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 39. 2024 Toyota 4Runner Limited
  "39": [
    { key: "engine", label: "Engine", value: "4.0L V6" },
    { key: "interior-color", label: "Interior Color", value: "Boulder" },
    { key: "exterior-color", label: "Exterior Color", value: "Blueprint" },
    { key: "mpg", label: "MPG", value: "16-18" },
    { key: "mileage", label: "Mileage", value: "3,800 mi" },
    { key: "location", label: "Location", value: "Grapevine, TX 76051" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "4WD" },
    { key: "transmission", label: "Transmission", value: "5-Speed Automatic" },
  ],
  // 40. 2021 Toyota Sienna XLE
  "40": [
    { key: "engine", label: "Engine", value: "2.5L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Graphite" },
    { key: "exterior-color", label: "Exterior Color", value: "Blueprint" },
    { key: "mpg", label: "MPG", value: "35-36" },
    { key: "mileage", label: "Mileage", value: "38,500 mi" },
    { key: "location", label: "Location", value: "Irving, TX 75062" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "eCVT" },
  ],
  // 41. 2023 Toyota Crown Limited
  "41": [
    { key: "engine", label: "Engine", value: "2.4L I4 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Macadamia" },
    { key: "exterior-color", label: "Exterior Color", value: "Ice Cap" },
    { key: "mpg", label: "MPG", value: "30-41" },
    { key: "mileage", label: "Mileage", value: "10,200 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "6-Speed Automatic" },
  ],
  // 42. 2024 Toyota GR86 Track
  "42": [
    { key: "engine", label: "Engine", value: "2.4L H4" },
    { key: "interior-color", label: "Interior Color", value: "Moonstone" },
    { key: "exterior-color", label: "Exterior Color", value: "Cavalry Blue" },
    { key: "mpg", label: "MPG", value: "20-27" },
    { key: "mileage", label: "Mileage", value: "2,400 mi" },
    { key: "location", label: "Location", value: "Dallas, TX 75001" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "RWD" },
    { key: "transmission", label: "Transmission", value: "6-Speed Manual" },
  ],
  // 43. 2022 Toyota Supra 2.0
  "43": [
    { key: "engine", label: "Engine", value: "2.0L I4 Turbo" },
    { key: "interior-color", label: "Interior Color", value: "Boulder" },
    { key: "exterior-color", label: "Exterior Color", value: "Ice Cap" },
    { key: "mpg", label: "MPG", value: "26-32" },
    { key: "mileage", label: "Mileage", value: "19,600 mi" },
    { key: "location", label: "Location", value: "Grapevine, TX 76051" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "RWD" },
    { key: "transmission", label: "Transmission", value: "8-Speed Automatic" },
  ],
  // 44. 2023 Toyota bZ4X XLE
  "44": [
    { key: "engine", label: "Engine", value: "Electric" },
    { key: "interior-color", label: "Interior Color", value: "Macadamia" },
    { key: "exterior-color", label: "Exterior Color", value: "Blueprint" },
    { key: "mpg", label: "MPG", value: "131 MPGe" },
    { key: "mileage", label: "Mileage", value: "8,700 mi" },
    { key: "location", label: "Location", value: "Irving, TX 75062" },
    { key: "fuel-type", label: "Fuel Type", value: "Electric" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "Single-Speed" },
  ],
  // 45. 2024 Toyota Avalon Limited
  "45": [
    { key: "engine", label: "Engine", value: "3.5L V6" },
    { key: "interior-color", label: "Interior Color", value: "Saddle Tan" },
    { key: "exterior-color", label: "Exterior Color", value: "Ruby Flare Pearl" },
    { key: "mpg", label: "MPG", value: "22-31" },
    { key: "mileage", label: "Mileage", value: "4,100 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "8-Speed Automatic" },
  ],
  // 46. 2021 Toyota C-HR Limited
  "46": [
    { key: "engine", label: "Engine", value: "2.0L I4" },
    { key: "interior-color", label: "Interior Color", value: "Graphite" },
    { key: "exterior-color", label: "Exterior Color", value: "Supersonic Red" },
    { key: "mpg", label: "MPG", value: "27-31" },
    { key: "mileage", label: "Mileage", value: "36,200 mi" },
    { key: "location", label: "Location", value: "Dallas, TX 75001" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "CVT" },
  ],
  // 47. 2023 Toyota Sequoia TRD Pro
  "47": [
    { key: "engine", label: "Engine", value: "3.5L V6 Hybrid" },
    { key: "interior-color", label: "Interior Color", value: "Moonstone" },
    { key: "exterior-color", label: "Exterior Color", value: "Blueprint" },
    { key: "mpg", label: "MPG", value: "19-22" },
    { key: "mileage", label: "Mileage", value: "12,800 mi" },
    { key: "location", label: "Location", value: "Grapevine, TX 76051" },
    { key: "fuel-type", label: "Fuel Type", value: "Hybrid" },
    { key: "drivetrain", label: "Drivetrain", value: "4WD" },
    { key: "transmission", label: "Transmission", value: "10-Speed Automatic" },
  ],
  // 48. 2024 Toyota GR Corolla Circuit
  "48": [
    { key: "engine", label: "Engine", value: "1.6L I3 Turbo" },
    { key: "interior-color", label: "Interior Color", value: "Macadamia" },
    { key: "exterior-color", label: "Exterior Color", value: "Magnetic Gray Metallic" },
    { key: "mpg", label: "MPG", value: "21-28" },
    { key: "mileage", label: "Mileage", value: "1,500 mi" },
    { key: "location", label: "Location", value: "Irving, TX 75062" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "AWD" },
    { key: "transmission", label: "Transmission", value: "6-Speed Manual" },
  ],
  // 49. 2022 Toyota Land Cruiser Heritage
  "49": [
    { key: "engine", label: "Engine", value: "3.3L V6 Twin Turbo" },
    { key: "interior-color", label: "Interior Color", value: "Harvest Beige" },
    { key: "exterior-color", label: "Exterior Color", value: "Supersonic Red" },
    { key: "mpg", label: "MPG", value: "22-26" },
    { key: "mileage", label: "Mileage", value: "24,300 mi" },
    { key: "location", label: "Location", value: "Fort Worth, TX 76116" },
    { key: "fuel-type", label: "Fuel Type", value: "Gas" },
    { key: "drivetrain", label: "Drivetrain", value: "4WD" },
    { key: "transmission", label: "Transmission", value: "10-Speed Automatic" },
  ],
  // 50. 2023 Toyota Mirai XLE
  "50": [
    { key: "engine", label: "Engine", value: "Hydrogen FCEV" },
    { key: "interior-color", label: "Interior Color", value: "Macadamia" },
    { key: "exterior-color", label: "Exterior Color", value: "Cavalry Blue" },
    { key: "mpg", label: "MPG", value: "76 MPGe" },
    { key: "mileage", label: "Mileage", value: "6,800 mi" },
    { key: "location", label: "Location", value: "Dallas, TX 75001" },
    { key: "fuel-type", label: "Fuel Type", value: "Hydrogen" },
    { key: "drivetrain", label: "Drivetrain", value: "FWD" },
    { key: "transmission", label: "Transmission", value: "Single-Speed" },
  ],
};

// ---------------------------------------------------------------------------
// Mock features by vehicle ID
// ---------------------------------------------------------------------------

export const featuresById: Record<string, FeatureCategory[]> = {
  // 1. 2023 Toyota Corolla Cross
  "1": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Automatic Emergency Braking",
        "Lane Departure Alert",
        "Blind Spot Monitor",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "Wi-Fi Connect",
        "USB-C Ports",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Dual-Zone Climate Control",
        "Power Driver Seat",
        "Smart Key",
        "Push Button Start",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Taillights",
        "Power Mirrors",
        '17" Alloy Wheels',
        "Roof Rails",
      ],
    },
  ],
  // 2. 2022 Toyota RAV4 Hybrid
  "2": [
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
        '8" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Power Liftgate",
        "Dual-Zone Climate Control",
        "SofTex Seats",
        "Smart Key System",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Daytime Running Lights",
        "Roof Rails",
        "Power Mirrors",
        '18" Alloy Wheels',
      ],
    },
    {
      name: "Capability",
      features: [
        "AWD Multi-Mode",
        "Hill Descent Control",
        "Sport-Tuned Suspension",
        "Trailer Hitch Prep",
        "All-Season Tires",
      ],
    },
  ],
  // 3. 2023 Toyota RAV4 Hybrid
  "3": [
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
        '8" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Power Liftgate",
        "Dual-Zone Climate Control",
        "SofTex Seats",
        "Smart Key System",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Daytime Running Lights",
        "Roof Rails",
        "Power Mirrors",
        '18" Alloy Wheels',
      ],
    },
    {
      name: "Capability",
      features: [
        "AWD Multi-Mode",
        "Hill Descent Control",
        "Sport-Tuned Suspension",
        "Trailer Hitch Prep",
        "All-Season Tires",
      ],
    },
  ],
  // 4. 2023 Toyota RAV4 Hybrid
  "4": [
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
        '8" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Power Liftgate",
        "Dual-Zone Climate Control",
        "SofTex Seats",
        "Smart Key System",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Daytime Running Lights",
        "Roof Rails",
        "Power Mirrors",
        '18" Alloy Wheels',
      ],
    },
    {
      name: "Capability",
      features: [
        "AWD Multi-Mode",
        "Hill Descent Control",
        "Sport-Tuned Suspension",
        "Trailer Hitch Prep",
        "All-Season Tires",
      ],
    },
  ],
  // 5. 2024 Toyota RAV4 Hybrid
  "5": [
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
        '8" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Power Liftgate",
        "Dual-Zone Climate Control",
        "SofTex Seats",
        "Smart Key System",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Daytime Running Lights",
        "Roof Rails",
        "Power Mirrors",
        '18" Alloy Wheels',
      ],
    },
    {
      name: "Capability",
      features: [
        "AWD Multi-Mode",
        "Hill Descent Control",
        "Sport-Tuned Suspension",
        "Trailer Hitch Prep",
        "All-Season Tires",
      ],
    },
  ],
  // 6. 2022 Toyota Yaris Cross Hybrid Active
  "6": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Automatic Emergency Braking",
        "Lane Departure Alert",
        "Blind Spot Monitor",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "Wi-Fi Connect",
        "USB-C Ports",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Dual-Zone Climate Control",
        "Power Driver Seat",
        "Smart Key",
        "Push Button Start",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Taillights",
        "Power Mirrors",
        '17" Alloy Wheels',
        "Roof Rails",
      ],
    },
  ],
  // 7. 2023 Toyota Corolla Cross
  "7": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Automatic Emergency Braking",
        "Lane Departure Alert",
        "Blind Spot Monitor",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "Wi-Fi Connect",
        "USB-C Ports",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Dual-Zone Climate Control",
        "Power Driver Seat",
        "Smart Key",
        "Push Button Start",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Taillights",
        "Power Mirrors",
        '17" Alloy Wheels',
        "Roof Rails",
      ],
    },
  ],
  // 8. 2024 Toyota RAV4 Hybrid
  "8": [
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
        '8" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Power Liftgate",
        "Dual-Zone Climate Control",
        "SofTex Seats",
        "Smart Key System",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Daytime Running Lights",
        "Roof Rails",
        "Power Mirrors",
        '18" Alloy Wheels',
      ],
    },
    {
      name: "Capability",
      features: [
        "AWD Multi-Mode",
        "Hill Descent Control",
        "Sport-Tuned Suspension",
        "Trailer Hitch Prep",
        "All-Season Tires",
      ],
    },
  ],
  // 9. 2020 Toyota Venza Limited Edition
  "9": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
      ],
    },
    {
      name: "Technology",
      features: [
        '12.3" Touchscreen',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "SofTex Leather Seats",
        "Panoramic Moonroof",
        "Heated Front Seats",
        "Dual-Zone Climate Control",
        "Power Liftgate",
      ],
    },
    {
      name: "Exterior",
      features: [
        "Adaptive LED Headlights",
        '18" Alloy Wheels',
        "Power Mirrors",
        "Premium Finish",
        "Panoramic View Camera",
      ],
    },
  ],
  // 10. 2022 Toyota Yaris Cross Hybrid Active
  "10": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Automatic Emergency Braking",
        "Lane Departure Alert",
        "Blind Spot Monitor",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "Wi-Fi Connect",
        "USB-C Ports",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Dual-Zone Climate Control",
        "Power Driver Seat",
        "Smart Key",
        "Push Button Start",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Taillights",
        "Power Mirrors",
        '17" Alloy Wheels',
        "Roof Rails",
      ],
    },
  ],
  // 11. 2025 Toyota RAV4 Limited Edition
  "11": [
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
        '8" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Power Liftgate",
        "Dual-Zone Climate Control",
        "SofTex Seats",
        "Smart Key System",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Daytime Running Lights",
        "Roof Rails",
        "Power Mirrors",
        '18" Alloy Wheels',
      ],
    },
    {
      name: "Capability",
      features: [
        "AWD Multi-Mode",
        "Hill Descent Control",
        "Sport-Tuned Suspension",
        "Trailer Hitch Prep",
        "All-Season Tires",
      ],
    },
  ],
  // 12. 2020 Toyota Corolla Cross Limited
  "12": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Automatic Emergency Braking",
        "Lane Departure Alert",
        "Blind Spot Monitor",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "Wi-Fi Connect",
        "USB-C Ports",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Dual-Zone Climate Control",
        "Power Driver Seat",
        "Smart Key",
        "Push Button Start",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Taillights",
        "Power Mirrors",
        '17" Alloy Wheels',
        "Roof Rails",
      ],
    },
  ],
  // 13. 2025 Toyota RAV4 Limited Edition
  "13": [
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
        '8" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Power Liftgate",
        "Dual-Zone Climate Control",
        "SofTex Seats",
        "Smart Key System",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Daytime Running Lights",
        "Roof Rails",
        "Power Mirrors",
        '18" Alloy Wheels',
      ],
    },
    {
      name: "Capability",
      features: [
        "AWD Multi-Mode",
        "Hill Descent Control",
        "Sport-Tuned Suspension",
        "Trailer Hitch Prep",
        "All-Season Tires",
      ],
    },
  ],
  // 14. 2023 Toyota Camry XSE
  "14": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Blind Spot Warning",
        "Rear Cross Traffic Alert",
      ],
    },
    {
      name: "Technology",
      features: [
        '9" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "Premium Audio System",
        "Wireless Connectivity",
        "Head-Up Display",
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
  // 15. 2024 Toyota Highlander Hybrid
  "15": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5+",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
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
      name: "Interior",
      features: [
        "Leather-Trimmed Seats",
        "Power Moonroof",
        "Dual-Zone Climate Control",
        "Heated Front Seats",
        "Power Liftgate",
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
      name: "Seating",
      features: [
        "8-Passenger Seating",
        "2nd Row Captain Chairs",
        "60/40 Split 3rd Row",
        "Driver Seat Memory",
        "Ventilated Front Seats",
      ],
    },
  ],
  // 16. 2022 Toyota Tacoma TRD Pro
  "16": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5",
        "Pre-Collision System",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "Backup Camera",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "Wireless Charging",
        "JBL Premium Audio",
        "Wi-Fi Connect",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Power Adjustable Seats",
        "Dual-Zone Climate Control",
        "Smart Key System",
        "Push Button Start",
      ],
    },
    {
      name: "Capability",
      features: [
        "TRD Off-Road Package",
        "Multi-Terrain Select",
        "Crawl Control",
        "Hill Descent Control",
        "Locking Rear Differential",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "TRD Pro Suspension",
        "Off-Road Tires",
        "Rock Rails",
        "Skid Plates",
      ],
    },
  ],
  // 17. 2023 Toyota Tundra CrewMax
  "17": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5",
        "Pre-Collision System",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "Backup Camera",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "Wireless Charging",
        "JBL Premium Audio",
        "Wi-Fi Connect",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Power Adjustable Seats",
        "Dual-Zone Climate Control",
        "Smart Key System",
        "Push Button Start",
      ],
    },
    {
      name: "Capability",
      features: [
        "TRD Off-Road Package",
        "Multi-Terrain Select",
        "Crawl Control",
        "Hill Descent Control",
        "Locking Rear Differential",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "TRD Pro Suspension",
        "Off-Road Tires",
        "Rock Rails",
        "Skid Plates",
      ],
    },
  ],
  // 18. 2024 Toyota Prius Prime
  "18": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Automatic Emergency Braking",
        "Lane Keeping Assist",
        "Blind Spot Monitor",
      ],
    },
    {
      name: "Technology",
      features: [
        '10.5" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "Wi-Fi Connect",
        "Wireless Charging",
        "Digital Rearview Mirror",
      ],
    },
    {
      name: "Efficiency",
      features: [
        "Hybrid Powertrain 57/56 MPG",
        "Regenerative Braking",
        "EV Mode",
        "Eco Mode",
        "Power Mode",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Dual-Zone Climate Control",
        "Smart Key",
        "Push Button Start",
        "USB-C Ports",
      ],
    },
  ],
  // 19. 2021 Toyota 4Runner TRD Off-Road
  "19": [
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
        '8" Entune Audio',
        "Apple CarPlay/Android Auto",
        "SiriusXM Radio",
        "JBL Premium Audio",
        "Wi-Fi Connect",
      ],
    },
    {
      name: "Interior",
      features: [
        "Leather-Trimmed Seats",
        "Heated Front Seats",
        "Power Liftgate",
        "Sliding Rear Cargo Deck",
        "Heated Steering Wheel",
      ],
    },
    {
      name: "Capability",
      features: [
        "Multi-Terrain Select",
        "Crawl Control",
        "Kinetic Dynamic Suspension",
        "Hill Descent Control",
        "5,000 lbs Towing",
      ],
    },
  ],
  // 20. 2023 Toyota Sienna Platinum
  "20": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5+",
        "Pre-Collision System",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "Backup Camera",
      ],
    },
    {
      name: "Technology",
      features: [
        '11.6" Rear Seat Entertainment',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Captain's Chair Seating",
        "Dual Power Sliding Doors",
        "Tri-Zone Climate Control",
        "Heated Front Seats",
        "Power Liftgate",
      ],
    },
    {
      name: "Comfort",
      features: [
        "Stow & Go 2nd Row Seats",
        "Ottoman Mode Seats",
        "Dual Moonroof",
        "Smart Key System",
        "Smart Flow AC",
      ],
    },
  ],
  // 21. 2024 Toyota Crown Platinum
  "21": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Blind Spot Warning",
        "Rear Cross Traffic Alert",
      ],
    },
    {
      name: "Technology",
      features: [
        '9" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "Premium Audio System",
        "Wireless Connectivity",
        "Head-Up Display",
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
  // 22. 2022 Toyota GR86 Premium
  "22": [
    {
      name: "Performance",
      features: [
        "Sport-Tuned Suspension",
        "Torsen LSD",
        "Brembo Brake System",
        "Launch Control",
        "Sport driving mode",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Display Audio',
        "Apple CarPlay/Android Auto",
        "Digital Cluster Display",
        "Sport Data Recorder",
        "Backup Camera",
      ],
    },
    {
      name: "Interior",
      features: [
        "Leather/Ultrasuede Seats",
        "Heated Front Seats",
        "Sport Steering Wheel",
        "Dual-Zone Climate",
        "Smart Key System",
      ],
    },
    {
      name: "Exterior",
      features: [
        "Aero Body Kit",
        "LED Headlights",
        '18" BBS Forged Wheels',
        "Quad Exhaust Tips",
        "Carbon Fiber Trim",
      ],
    },
  ],
  // 23. 2023 Toyota Supra 3.0
  "23": [
    {
      name: "Performance",
      features: [
        "Sport-Tuned Suspension",
        "Torsen LSD",
        "Brembo Brake System",
        "Launch Control",
        "Sport driving mode",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Display Audio',
        "Apple CarPlay/Android Auto",
        "Digital Cluster Display",
        "Sport Data Recorder",
        "Backup Camera",
      ],
    },
    {
      name: "Interior",
      features: [
        "Leather/Ultrasuede Seats",
        "Heated Front Seats",
        "Sport Steering Wheel",
        "Dual-Zone Climate",
        "Smart Key System",
      ],
    },
    {
      name: "Exterior",
      features: [
        "Aero Body Kit",
        "LED Headlights",
        '18" BBS Forged Wheels',
        "Quad Exhaust Tips",
        "Carbon Fiber Trim",
      ],
    },
  ],
  // 24. 2024 Toyota bZ4X Limited
  "24": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "Parking Assist",
      ],
    },
    {
      name: "Technology",
      features: [
        '12.3" Touchscreen',
        "Apple CarPlay/Android Auto",
        "Over-the-Air Updates",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated & Ventilated Seats",
        "Panoramic Moonroof",
        "Dual-Zone Climate Control",
        "Smart Key",
        "Power Liftgate",
      ],
    },
    {
      name: "EV Features",
      features: [
        "AWD Dual Motor",
        "DC Fast Charging",
        "Home Charging Compatible",
        "Vehicle-to-Load (V2L)",
        "One-Pedal Driving",
      ],
    },
  ],
  // 25. 2021 Toyota Avalon TRD
  "25": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Blind Spot Warning",
        "Rear Cross Traffic Alert",
      ],
    },
    {
      name: "Technology",
      features: [
        '9" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "Premium Audio System",
        "Wireless Connectivity",
        "Head-Up Display",
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
  // 26. 2023 Toyota C-HR Nightshade
  "26": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Automatic Emergency Braking",
        "Lane Departure Alert",
        "Blind Spot Monitor",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "Wi-Fi Connect",
        "USB-C Ports",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Dual-Zone Climate Control",
        "Power Driver Seat",
        "Smart Key",
        "Push Button Start",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Taillights",
        "Power Mirrors",
        '17" Alloy Wheels',
        "Roof Rails",
      ],
    },
  ],
  // 27. 2024 Toyota Sequoia Capstone
  "27": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5+",
        "Pre-Collision System",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "360° Camera",
      ],
    },
    {
      name: "Technology",
      features: [
        '14" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "JBL Quantum Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Semi-Aniline Leather Seats",
        "Heated & Ventilated Seats",
        "Tri-Zone Climate Control",
        "Power Running Boards",
        "Power Liftgate",
      ],
    },
    {
      name: "Capability",
      features: [
        "8,900 lbs Towing Capacity",
        "Hybrid 4WD System",
        "Multi-Terrain Select",
        "Crawl Control",
        "Hill Descent Control",
      ],
    },
  ],
  // 28. 2022 Toyota GR Corolla Core
  "28": [
    {
      name: "Performance",
      features: [
        "GR-FOUR AWD System",
        "1.6L GR Turbo Engine 300hp",
        "6-Speed Manual Transmission",
        "Torsen LSD (Front & Rear)",
        "Brembo 4-Pot Brakes",
      ],
    },
    {
      name: "Exterior",
      features: [
        "Carbon Fiber Roof",
        "GR Wide Body Kit",
        "Functional Front Splitter",
        "4 Exhaust Tips",
        '18" BBS Forged Wheels',
      ],
    },
    {
      name: "Interior",
      features: [
        "GR Sports Seats",
        "Suede Steering Wheel",
        "Apple CarPlay/Android Auto",
        "Digital Cluster",
        "Smart Key",
      ],
    },
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.0",
        "Backup Camera",
        "Blind Spot Monitor",
        "Forward Collision Warning",
        "Lane Departure Alert",
      ],
    },
  ],
  // 29. 2023 Toyota Land Cruiser
  "29": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5+",
        "Multi-Terrain Monitor",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "Crawl Control Camera",
      ],
    },
    {
      name: "Technology",
      features: [
        '12.3" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "JBL Quantum Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Semi-Aniline Leather",
        "Heated & Ventilated Seats",
        "Dual Sunroof",
        "Tri-Zone Climate",
        "Smart Key System",
      ],
    },
    {
      name: "Capability",
      features: [
        "Twin-Turbo V6 Engine",
        "Multi-Terrain Select",
        "Kinetic Dynamic Suspension",
        "Crawl Control",
        "Electronic Locking Differentials",
      ],
    },
  ],
  // 30. 2024 Toyota Mirai Limited
  "30": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "Automatic Emergency Braking",
      ],
    },
    {
      name: "Technology",
      features: [
        '12.3" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Semi-Aniline Leather Seats",
        "Heated & Ventilated Front Seats",
        "Power Moonroof",
        "Smart Key",
        "Tri-Zone Climate Control",
      ],
    },
    {
      name: "Hydrogen",
      features: [
        "Zero-Emission Fuel Cell",
        "400+ Mile Range",
        "3 Hydrogen Tanks",
        "Quick Refueling (~5 min)",
        "Regenerative Braking",
      ],
    },
  ],
  // 31. 2022 Toyota Camry Hybrid LE
  "31": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Blind Spot Warning",
        "Rear Cross Traffic Alert",
      ],
    },
    {
      name: "Technology",
      features: [
        '9" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "Premium Audio System",
        "Wireless Connectivity",
        "Head-Up Display",
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
  // 32. 2023 Toyota Corolla Hatchback XSE
  "32": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Blind Spot Warning",
        "Rear Cross Traffic Alert",
      ],
    },
    {
      name: "Technology",
      features: [
        '9" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "Premium Audio System",
        "Wireless Connectivity",
        "Head-Up Display",
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
  // 33. 2024 Toyota Venza Nightshade
  "33": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
      ],
    },
    {
      name: "Technology",
      features: [
        '12.3" Touchscreen',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "SofTex Leather Seats",
        "Panoramic Moonroof",
        "Heated Front Seats",
        "Dual-Zone Climate Control",
        "Power Liftgate",
      ],
    },
    {
      name: "Exterior",
      features: [
        "Adaptive LED Headlights",
        '18" Alloy Wheels',
        "Power Mirrors",
        "Premium Finish",
        "Panoramic View Camera",
      ],
    },
  ],
  // 34. 2021 Toyota RAV4 Prime SE
  "34": [
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
        '8" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Power Liftgate",
        "Dual-Zone Climate Control",
        "SofTex Seats",
        "Smart Key System",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Daytime Running Lights",
        "Roof Rails",
        "Power Mirrors",
        '18" Alloy Wheels',
      ],
    },
    {
      name: "Capability",
      features: [
        "AWD Multi-Mode",
        "Hill Descent Control",
        "Sport-Tuned Suspension",
        "Trailer Hitch Prep",
        "All-Season Tires",
      ],
    },
  ],
  // 35. 2023 Toyota Highlander Bronze Edition
  "35": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5+",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
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
      name: "Interior",
      features: [
        "Leather-Trimmed Seats",
        "Power Moonroof",
        "Dual-Zone Climate Control",
        "Heated Front Seats",
        "Power Liftgate",
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
      name: "Seating",
      features: [
        "8-Passenger Seating",
        "2nd Row Captain Chairs",
        "60/40 Split 3rd Row",
        "Driver Seat Memory",
        "Ventilated Front Seats",
      ],
    },
  ],
  // 36. 2024 Toyota Tacoma Limited
  "36": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5",
        "Pre-Collision System",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "Backup Camera",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "Wireless Charging",
        "JBL Premium Audio",
        "Wi-Fi Connect",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Power Adjustable Seats",
        "Dual-Zone Climate Control",
        "Smart Key System",
        "Push Button Start",
      ],
    },
    {
      name: "Capability",
      features: [
        "TRD Off-Road Package",
        "Multi-Terrain Select",
        "Crawl Control",
        "Hill Descent Control",
        "Locking Rear Differential",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "TRD Pro Suspension",
        "Off-Road Tires",
        "Rock Rails",
        "Skid Plates",
      ],
    },
  ],
  // 37. 2022 Toyota Tundra SR5
  "37": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5",
        "Pre-Collision System",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "Backup Camera",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "Wireless Charging",
        "JBL Premium Audio",
        "Wi-Fi Connect",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Power Adjustable Seats",
        "Dual-Zone Climate Control",
        "Smart Key System",
        "Push Button Start",
      ],
    },
    {
      name: "Capability",
      features: [
        "TRD Off-Road Package",
        "Multi-Terrain Select",
        "Crawl Control",
        "Hill Descent Control",
        "Locking Rear Differential",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "TRD Pro Suspension",
        "Off-Road Tires",
        "Rock Rails",
        "Skid Plates",
      ],
    },
  ],
  // 38. 2023 Toyota Prius XLE
  "38": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Automatic Emergency Braking",
        "Lane Keeping Assist",
        "Blind Spot Monitor",
      ],
    },
    {
      name: "Technology",
      features: [
        '10.5" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "Wi-Fi Connect",
        "Wireless Charging",
        "Digital Rearview Mirror",
      ],
    },
    {
      name: "Efficiency",
      features: [
        "Hybrid Powertrain 57/56 MPG",
        "Regenerative Braking",
        "EV Mode",
        "Eco Mode",
        "Power Mode",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Dual-Zone Climate Control",
        "Smart Key",
        "Push Button Start",
        "USB-C Ports",
      ],
    },
  ],
  // 39. 2024 Toyota 4Runner Limited
  "39": [
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
        '8" Entune Audio',
        "Apple CarPlay/Android Auto",
        "SiriusXM Radio",
        "JBL Premium Audio",
        "Wi-Fi Connect",
      ],
    },
    {
      name: "Interior",
      features: [
        "Leather-Trimmed Seats",
        "Heated Front Seats",
        "Power Liftgate",
        "Sliding Rear Cargo Deck",
        "Heated Steering Wheel",
      ],
    },
    {
      name: "Capability",
      features: [
        "Multi-Terrain Select",
        "Crawl Control",
        "Kinetic Dynamic Suspension",
        "Hill Descent Control",
        "5,000 lbs Towing",
      ],
    },
  ],
  // 40. 2021 Toyota Sienna XLE
  "40": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5+",
        "Pre-Collision System",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "Backup Camera",
      ],
    },
    {
      name: "Technology",
      features: [
        '11.6" Rear Seat Entertainment',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Captain's Chair Seating",
        "Dual Power Sliding Doors",
        "Tri-Zone Climate Control",
        "Heated Front Seats",
        "Power Liftgate",
      ],
    },
    {
      name: "Comfort",
      features: [
        "Stow & Go 2nd Row Seats",
        "Ottoman Mode Seats",
        "Dual Moonroof",
        "Smart Key System",
        "Smart Flow AC",
      ],
    },
  ],
  // 41. 2023 Toyota Crown Limited
  "41": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Blind Spot Warning",
        "Rear Cross Traffic Alert",
      ],
    },
    {
      name: "Technology",
      features: [
        '9" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "Premium Audio System",
        "Wireless Connectivity",
        "Head-Up Display",
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
  // 42. 2024 Toyota GR86 Track
  "42": [
    {
      name: "Performance",
      features: [
        "Sport-Tuned Suspension",
        "Torsen LSD",
        "Brembo Brake System",
        "Launch Control",
        "Sport driving mode",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Display Audio',
        "Apple CarPlay/Android Auto",
        "Digital Cluster Display",
        "Sport Data Recorder",
        "Backup Camera",
      ],
    },
    {
      name: "Interior",
      features: [
        "Leather/Ultrasuede Seats",
        "Heated Front Seats",
        "Sport Steering Wheel",
        "Dual-Zone Climate",
        "Smart Key System",
      ],
    },
    {
      name: "Exterior",
      features: [
        "Aero Body Kit",
        "LED Headlights",
        '18" BBS Forged Wheels',
        "Quad Exhaust Tips",
        "Carbon Fiber Trim",
      ],
    },
  ],
  // 43. 2022 Toyota Supra 2.0
  "43": [
    {
      name: "Performance",
      features: [
        "Sport-Tuned Suspension",
        "Torsen LSD",
        "Brembo Brake System",
        "Launch Control",
        "Sport driving mode",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Display Audio',
        "Apple CarPlay/Android Auto",
        "Digital Cluster Display",
        "Sport Data Recorder",
        "Backup Camera",
      ],
    },
    {
      name: "Interior",
      features: [
        "Leather/Ultrasuede Seats",
        "Heated Front Seats",
        "Sport Steering Wheel",
        "Dual-Zone Climate",
        "Smart Key System",
      ],
    },
    {
      name: "Exterior",
      features: [
        "Aero Body Kit",
        "LED Headlights",
        '18" BBS Forged Wheels',
        "Quad Exhaust Tips",
        "Carbon Fiber Trim",
      ],
    },
  ],
  // 44. 2023 Toyota bZ4X XLE
  "44": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "Parking Assist",
      ],
    },
    {
      name: "Technology",
      features: [
        '12.3" Touchscreen',
        "Apple CarPlay/Android Auto",
        "Over-the-Air Updates",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated & Ventilated Seats",
        "Panoramic Moonroof",
        "Dual-Zone Climate Control",
        "Smart Key",
        "Power Liftgate",
      ],
    },
    {
      name: "EV Features",
      features: [
        "AWD Dual Motor",
        "DC Fast Charging",
        "Home Charging Compatible",
        "Vehicle-to-Load (V2L)",
        "One-Pedal Driving",
      ],
    },
  ],
  // 45. 2024 Toyota Avalon Limited
  "45": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Blind Spot Warning",
        "Rear Cross Traffic Alert",
      ],
    },
    {
      name: "Technology",
      features: [
        '9" Touchscreen Display',
        "Apple CarPlay/Android Auto",
        "Premium Audio System",
        "Wireless Connectivity",
        "Head-Up Display",
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
  // 46. 2021 Toyota C-HR Limited
  "46": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Automatic Emergency Braking",
        "Lane Departure Alert",
        "Blind Spot Monitor",
      ],
    },
    {
      name: "Technology",
      features: [
        '8" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "Wi-Fi Connect",
        "USB-C Ports",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Heated Front Seats",
        "Dual-Zone Climate Control",
        "Power Driver Seat",
        "Smart Key",
        "Push Button Start",
      ],
    },
    {
      name: "Exterior",
      features: [
        "LED Headlights",
        "LED Taillights",
        "Power Mirrors",
        '17" Alloy Wheels',
        "Roof Rails",
      ],
    },
  ],
  // 47. 2023 Toyota Sequoia TRD Pro
  "47": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5+",
        "Pre-Collision System",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "360° Camera",
      ],
    },
    {
      name: "Technology",
      features: [
        '14" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "JBL Quantum Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Semi-Aniline Leather Seats",
        "Heated & Ventilated Seats",
        "Tri-Zone Climate Control",
        "Power Running Boards",
        "Power Liftgate",
      ],
    },
    {
      name: "Capability",
      features: [
        "8,900 lbs Towing Capacity",
        "Hybrid 4WD System",
        "Multi-Terrain Select",
        "Crawl Control",
        "Hill Descent Control",
      ],
    },
  ],
  // 48. 2024 Toyota GR Corolla Circuit
  "48": [
    {
      name: "Performance",
      features: [
        "GR-FOUR AWD System",
        "1.6L GR Turbo Engine 300hp",
        "6-Speed Manual Transmission",
        "Torsen LSD (Front & Rear)",
        "Brembo 4-Pot Brakes",
      ],
    },
    {
      name: "Exterior",
      features: [
        "Carbon Fiber Roof",
        "GR Wide Body Kit",
        "Functional Front Splitter",
        "4 Exhaust Tips",
        '18" BBS Forged Wheels',
      ],
    },
    {
      name: "Interior",
      features: [
        "GR Sports Seats",
        "Suede Steering Wheel",
        "Apple CarPlay/Android Auto",
        "Digital Cluster",
        "Smart Key",
      ],
    },
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.0",
        "Backup Camera",
        "Blind Spot Monitor",
        "Forward Collision Warning",
        "Lane Departure Alert",
      ],
    },
  ],
  // 49. 2022 Toyota Land Cruiser Heritage
  "49": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 2.5+",
        "Multi-Terrain Monitor",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "Crawl Control Camera",
      ],
    },
    {
      name: "Technology",
      features: [
        '12.3" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "JBL Quantum Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Semi-Aniline Leather",
        "Heated & Ventilated Seats",
        "Dual Sunroof",
        "Tri-Zone Climate",
        "Smart Key System",
      ],
    },
    {
      name: "Capability",
      features: [
        "Twin-Turbo V6 Engine",
        "Multi-Terrain Select",
        "Kinetic Dynamic Suspension",
        "Crawl Control",
        "Electronic Locking Differentials",
      ],
    },
  ],
  // 50. 2023 Toyota Mirai XLE
  "50": [
    {
      name: "Safety",
      features: [
        "Toyota Safety Sense 3.0",
        "Pre-Collision System",
        "Blind Spot Monitor",
        "Rear Cross Traffic Alert",
        "Automatic Emergency Braking",
      ],
    },
    {
      name: "Technology",
      features: [
        '12.3" Multimedia Display',
        "Apple CarPlay/Android Auto",
        "JBL Premium Audio",
        "Wi-Fi Connect",
        "Wireless Charging",
      ],
    },
    {
      name: "Interior",
      features: [
        "Semi-Aniline Leather Seats",
        "Heated & Ventilated Front Seats",
        "Power Moonroof",
        "Smart Key",
        "Tri-Zone Climate Control",
      ],
    },
    {
      name: "Hydrogen",
      features: [
        "Zero-Emission Fuel Cell",
        "400+ Mile Range",
        "3 Hydrogen Tanks",
        "Quick Refueling (~5 min)",
        "Regenerative Braking",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Mock ratings by vehicle ID
// ---------------------------------------------------------------------------

export const ratingById: Record<string, RatingData> = {
  // 1. 2023 Toyota Corolla Cross
  "1": {
    rating: 4.6,
    reviewCount: 87,
    distribution: [
      { stars: 5, count: 96, id: "0" },
      { stars: 4, count: 13, id: "1" },
      { stars: 3, count: 3, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 0, id: "4" },
    ],
  },
  // 2. 2022 Toyota RAV4 Hybrid
  "2": {
    rating: 4.7,
    reviewCount: 124,
    distribution: [
      { stars: 5, count: 149, id: "0" },
      { stars: 4, count: 19, id: "1" },
      { stars: 3, count: 5, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 3. 2023 Toyota RAV4 Hybrid
  "3": {
    rating: 4.8,
    reviewCount: 161,
    distribution: [
      { stars: 5, count: 209, id: "0" },
      { stars: 4, count: 24, id: "1" },
      { stars: 3, count: 6, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 4. 2023 Toyota RAV4 Hybrid
  "4": {
    rating: 4.9,
    reviewCount: 198,
    distribution: [
      { stars: 5, count: 277, id: "0" },
      { stars: 4, count: 30, id: "1" },
      { stars: 3, count: 8, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 5. 2024 Toyota RAV4 Hybrid
  "5": {
    rating: 4.5,
    reviewCount: 235,
    distribution: [
      { stars: 5, count: 235, id: "0" },
      { stars: 4, count: 35, id: "1" },
      { stars: 3, count: 9, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 6. 2022 Toyota Yaris Cross Hybrid Active
  "6": {
    rating: 4.6,
    reviewCount: 272,
    distribution: [
      { stars: 5, count: 299, id: "0" },
      { stars: 4, count: 41, id: "1" },
      { stars: 3, count: 11, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 7. 2023 Toyota Corolla Cross
  "7": {
    rating: 4.7,
    reviewCount: 309,
    distribution: [
      { stars: 5, count: 371, id: "0" },
      { stars: 4, count: 46, id: "1" },
      { stars: 3, count: 12, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 8. 2024 Toyota RAV4 Hybrid
  "8": {
    rating: 4.8,
    reviewCount: 346,
    distribution: [
      { stars: 5, count: 450, id: "0" },
      { stars: 4, count: 52, id: "1" },
      { stars: 3, count: 14, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 9. 2020 Toyota Venza Limited Edition
  "9": {
    rating: 4.9,
    reviewCount: 383,
    distribution: [
      { stars: 5, count: 536, id: "0" },
      { stars: 4, count: 57, id: "1" },
      { stars: 3, count: 15, id: "2" },
      { stars: 2, count: 4, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 10. 2022 Toyota Yaris Cross Hybrid Active
  "10": {
    rating: 4.5,
    reviewCount: 70,
    distribution: [
      { stars: 5, count: 70, id: "0" },
      { stars: 4, count: 11, id: "1" },
      { stars: 3, count: 3, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 0, id: "4" },
    ],
  },
  // 11. 2025 Toyota RAV4 Limited Edition
  "11": {
    rating: 4.6,
    reviewCount: 107,
    distribution: [
      { stars: 5, count: 118, id: "0" },
      { stars: 4, count: 16, id: "1" },
      { stars: 3, count: 4, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 12. 2020 Toyota Corolla Cross Limited
  "12": {
    rating: 4.7,
    reviewCount: 144,
    distribution: [
      { stars: 5, count: 173, id: "0" },
      { stars: 4, count: 22, id: "1" },
      { stars: 3, count: 6, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 13. 2025 Toyota RAV4 Limited Edition
  "13": {
    rating: 4.8,
    reviewCount: 181,
    distribution: [
      { stars: 5, count: 235, id: "0" },
      { stars: 4, count: 27, id: "1" },
      { stars: 3, count: 7, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 14. 2023 Toyota Camry XSE
  "14": {
    rating: 4.9,
    reviewCount: 218,
    distribution: [
      { stars: 5, count: 305, id: "0" },
      { stars: 4, count: 33, id: "1" },
      { stars: 3, count: 9, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 15. 2024 Toyota Highlander Hybrid
  "15": {
    rating: 4.5,
    reviewCount: 255,
    distribution: [
      { stars: 5, count: 255, id: "0" },
      { stars: 4, count: 38, id: "1" },
      { stars: 3, count: 10, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 16. 2022 Toyota Tacoma TRD Pro
  "16": {
    rating: 4.6,
    reviewCount: 292,
    distribution: [
      { stars: 5, count: 321, id: "0" },
      { stars: 4, count: 44, id: "1" },
      { stars: 3, count: 12, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 17. 2023 Toyota Tundra CrewMax
  "17": {
    rating: 4.7,
    reviewCount: 329,
    distribution: [
      { stars: 5, count: 395, id: "0" },
      { stars: 4, count: 49, id: "1" },
      { stars: 3, count: 13, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 18. 2024 Toyota Prius Prime
  "18": {
    rating: 4.8,
    reviewCount: 366,
    distribution: [
      { stars: 5, count: 476, id: "0" },
      { stars: 4, count: 55, id: "1" },
      { stars: 3, count: 15, id: "2" },
      { stars: 2, count: 4, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 19. 2021 Toyota 4Runner TRD Off-Road
  "19": {
    rating: 4.9,
    reviewCount: 53,
    distribution: [
      { stars: 5, count: 74, id: "0" },
      { stars: 4, count: 8, id: "1" },
      { stars: 3, count: 2, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 0, id: "4" },
    ],
  },
  // 20. 2023 Toyota Sienna Platinum
  "20": {
    rating: 4.5,
    reviewCount: 90,
    distribution: [
      { stars: 5, count: 90, id: "0" },
      { stars: 4, count: 14, id: "1" },
      { stars: 3, count: 4, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 0, id: "4" },
    ],
  },
  // 21. 2024 Toyota Crown Platinum
  "21": {
    rating: 4.6,
    reviewCount: 127,
    distribution: [
      { stars: 5, count: 140, id: "0" },
      { stars: 4, count: 19, id: "1" },
      { stars: 3, count: 5, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 22. 2022 Toyota GR86 Premium
  "22": {
    rating: 4.7,
    reviewCount: 164,
    distribution: [
      { stars: 5, count: 197, id: "0" },
      { stars: 4, count: 25, id: "1" },
      { stars: 3, count: 7, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 23. 2023 Toyota Supra 3.0
  "23": {
    rating: 4.8,
    reviewCount: 201,
    distribution: [
      { stars: 5, count: 261, id: "0" },
      { stars: 4, count: 30, id: "1" },
      { stars: 3, count: 8, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 24. 2024 Toyota bZ4X Limited
  "24": {
    rating: 4.9,
    reviewCount: 238,
    distribution: [
      { stars: 5, count: 333, id: "0" },
      { stars: 4, count: 36, id: "1" },
      { stars: 3, count: 10, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 25. 2021 Toyota Avalon TRD
  "25": {
    rating: 4.5,
    reviewCount: 275,
    distribution: [
      { stars: 5, count: 275, id: "0" },
      { stars: 4, count: 41, id: "1" },
      { stars: 3, count: 11, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 26. 2023 Toyota C-HR Nightshade
  "26": {
    rating: 4.6,
    reviewCount: 312,
    distribution: [
      { stars: 5, count: 343, id: "0" },
      { stars: 4, count: 47, id: "1" },
      { stars: 3, count: 12, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 27. 2024 Toyota Sequoia Capstone
  "27": {
    rating: 4.7,
    reviewCount: 349,
    distribution: [
      { stars: 5, count: 419, id: "0" },
      { stars: 4, count: 52, id: "1" },
      { stars: 3, count: 14, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 28. 2022 Toyota GR Corolla Core
  "28": {
    rating: 4.8,
    reviewCount: 386,
    distribution: [
      { stars: 5, count: 502, id: "0" },
      { stars: 4, count: 58, id: "1" },
      { stars: 3, count: 15, id: "2" },
      { stars: 2, count: 4, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 29. 2023 Toyota Land Cruiser
  "29": {
    rating: 4.9,
    reviewCount: 73,
    distribution: [
      { stars: 5, count: 102, id: "0" },
      { stars: 4, count: 11, id: "1" },
      { stars: 3, count: 3, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 0, id: "4" },
    ],
  },
  // 30. 2024 Toyota Mirai Limited
  "30": {
    rating: 4.5,
    reviewCount: 110,
    distribution: [
      { stars: 5, count: 110, id: "0" },
      { stars: 4, count: 17, id: "1" },
      { stars: 3, count: 4, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 31. 2022 Toyota Camry Hybrid LE
  "31": {
    rating: 4.6,
    reviewCount: 147,
    distribution: [
      { stars: 5, count: 162, id: "0" },
      { stars: 4, count: 22, id: "1" },
      { stars: 3, count: 6, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 32. 2023 Toyota Corolla Hatchback XSE
  "32": {
    rating: 4.7,
    reviewCount: 184,
    distribution: [
      { stars: 5, count: 221, id: "0" },
      { stars: 4, count: 28, id: "1" },
      { stars: 3, count: 7, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 33. 2024 Toyota Venza Nightshade
  "33": {
    rating: 4.8,
    reviewCount: 221,
    distribution: [
      { stars: 5, count: 287, id: "0" },
      { stars: 4, count: 33, id: "1" },
      { stars: 3, count: 9, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 34. 2021 Toyota RAV4 Prime SE
  "34": {
    rating: 4.9,
    reviewCount: 258,
    distribution: [
      { stars: 5, count: 361, id: "0" },
      { stars: 4, count: 39, id: "1" },
      { stars: 3, count: 10, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 35. 2023 Toyota Highlander Bronze Edition
  "35": {
    rating: 4.5,
    reviewCount: 295,
    distribution: [
      { stars: 5, count: 295, id: "0" },
      { stars: 4, count: 44, id: "1" },
      { stars: 3, count: 12, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 36. 2024 Toyota Tacoma Limited
  "36": {
    rating: 4.6,
    reviewCount: 332,
    distribution: [
      { stars: 5, count: 365, id: "0" },
      { stars: 4, count: 50, id: "1" },
      { stars: 3, count: 13, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 37. 2022 Toyota Tundra SR5
  "37": {
    rating: 4.7,
    reviewCount: 369,
    distribution: [
      { stars: 5, count: 443, id: "0" },
      { stars: 4, count: 55, id: "1" },
      { stars: 3, count: 15, id: "2" },
      { stars: 2, count: 4, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 38. 2023 Toyota Prius XLE
  "38": {
    rating: 4.8,
    reviewCount: 56,
    distribution: [
      { stars: 5, count: 73, id: "0" },
      { stars: 4, count: 8, id: "1" },
      { stars: 3, count: 2, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 0, id: "4" },
    ],
  },
  // 39. 2024 Toyota 4Runner Limited
  "39": {
    rating: 4.9,
    reviewCount: 93,
    distribution: [
      { stars: 5, count: 130, id: "0" },
      { stars: 4, count: 14, id: "1" },
      { stars: 3, count: 4, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 0, id: "4" },
    ],
  },
  // 40. 2021 Toyota Sienna XLE
  "40": {
    rating: 4.5,
    reviewCount: 130,
    distribution: [
      { stars: 5, count: 130, id: "0" },
      { stars: 4, count: 20, id: "1" },
      { stars: 3, count: 5, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 41. 2023 Toyota Crown Limited
  "41": {
    rating: 4.6,
    reviewCount: 167,
    distribution: [
      { stars: 5, count: 184, id: "0" },
      { stars: 4, count: 25, id: "1" },
      { stars: 3, count: 7, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 42. 2024 Toyota GR86 Track
  "42": {
    rating: 4.7,
    reviewCount: 204,
    distribution: [
      { stars: 5, count: 245, id: "0" },
      { stars: 4, count: 31, id: "1" },
      { stars: 3, count: 8, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 43. 2022 Toyota Supra 2.0
  "43": {
    rating: 4.8,
    reviewCount: 241,
    distribution: [
      { stars: 5, count: 313, id: "0" },
      { stars: 4, count: 36, id: "1" },
      { stars: 3, count: 10, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 44. 2023 Toyota bZ4X XLE
  "44": {
    rating: 4.9,
    reviewCount: 278,
    distribution: [
      { stars: 5, count: 389, id: "0" },
      { stars: 4, count: 42, id: "1" },
      { stars: 3, count: 11, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 45. 2024 Toyota Avalon Limited
  "45": {
    rating: 4.5,
    reviewCount: 315,
    distribution: [
      { stars: 5, count: 315, id: "0" },
      { stars: 4, count: 47, id: "1" },
      { stars: 3, count: 13, id: "2" },
      { stars: 2, count: 3, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 46. 2021 Toyota C-HR Limited
  "46": {
    rating: 4.6,
    reviewCount: 352,
    distribution: [
      { stars: 5, count: 387, id: "0" },
      { stars: 4, count: 53, id: "1" },
      { stars: 3, count: 14, id: "2" },
      { stars: 2, count: 4, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 47. 2023 Toyota Sequoia TRD Pro
  "47": {
    rating: 4.7,
    reviewCount: 389,
    distribution: [
      { stars: 5, count: 467, id: "0" },
      { stars: 4, count: 58, id: "1" },
      { stars: 3, count: 16, id: "2" },
      { stars: 2, count: 4, id: "3" },
      { stars: 1, count: 2, id: "4" },
    ],
  },
  // 48. 2024 Toyota GR Corolla Circuit
  "48": {
    rating: 4.8,
    reviewCount: 76,
    distribution: [
      { stars: 5, count: 99, id: "0" },
      { stars: 4, count: 11, id: "1" },
      { stars: 3, count: 3, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 0, id: "4" },
    ],
  },
  // 49. 2022 Toyota Land Cruiser Heritage
  "49": {
    rating: 4.9,
    reviewCount: 113,
    distribution: [
      { stars: 5, count: 158, id: "0" },
      { stars: 4, count: 17, id: "1" },
      { stars: 3, count: 5, id: "2" },
      { stars: 2, count: 1, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
  // 50. 2023 Toyota Mirai XLE
  "50": {
    rating: 4.5,
    reviewCount: 150,
    distribution: [
      { stars: 5, count: 150, id: "0" },
      { stars: 4, count: 23, id: "1" },
      { stars: 3, count: 6, id: "2" },
      { stars: 2, count: 2, id: "3" },
      { stars: 1, count: 1, id: "4" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Mock vehicle status by vehicle ID
// ---------------------------------------------------------------------------

export const vehicleStatusById: Record<string, VehicleStatusData> = {
  // 1. 2023 Toyota Corolla Cross
  "1": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 2. 2022 Toyota RAV4 Hybrid
  "2": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 3. 2023 Toyota RAV4 Hybrid
  "3": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 4. 2023 Toyota RAV4 Hybrid
  "4": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 5. 2024 Toyota RAV4 Hybrid
  "5": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 6. 2022 Toyota Yaris Cross Hybrid Active
  "6": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 7. 2023 Toyota Corolla Cross
  "7": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 8. 2024 Toyota RAV4 Hybrid
  "8": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 9. 2020 Toyota Venza Limited Edition
  "9": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 10. 2022 Toyota Yaris Cross Hybrid Active
  "10": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 11. 2025 Toyota RAV4 Limited Edition
  "11": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 12. 2020 Toyota Corolla Cross Limited
  "12": {
    noLongerAvailable: false,
    historyReportPending: true,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 13. 2025 Toyota RAV4 Limited Edition
  "13": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 14. 2023 Toyota Camry XSE
  "14": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 15. 2024 Toyota Highlander Hybrid
  "15": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 16. 2022 Toyota Tacoma TRD Pro
  "16": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 17. 2023 Toyota Tundra CrewMax
  "17": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 18. 2024 Toyota Prius Prime
  "18": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 19. 2021 Toyota 4Runner TRD Off-Road
  "19": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: true,
    limitedPhotos: false,
  },
  // 20. 2023 Toyota Sienna Platinum
  "20": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 21. 2024 Toyota Crown Platinum
  "21": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 22. 2022 Toyota GR86 Premium
  "22": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 23. 2023 Toyota Supra 3.0
  "23": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 24. 2024 Toyota bZ4X Limited
  "24": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 25. 2021 Toyota Avalon TRD
  "25": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 26. 2023 Toyota C-HR Nightshade
  "26": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 27. 2024 Toyota Sequoia Capstone
  "27": {
    noLongerAvailable: true,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 28. 2022 Toyota GR Corolla Core
  "28": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 29. 2023 Toyota Land Cruiser
  "29": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 30. 2024 Toyota Mirai Limited
  "30": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 31. 2022 Toyota Camry Hybrid LE
  "31": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 32. 2023 Toyota Corolla Hatchback XSE
  "32": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 33. 2024 Toyota Venza Nightshade
  "33": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 34. 2021 Toyota RAV4 Prime SE
  "34": {
    noLongerAvailable: false,
    historyReportPending: true,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 35. 2023 Toyota Highlander Bronze Edition
  "35": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 36. 2024 Toyota Tacoma Limited
  "36": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 37. 2022 Toyota Tundra SR5
  "37": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 38. 2023 Toyota Prius XLE
  "38": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 39. 2024 Toyota 4Runner Limited
  "39": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 40. 2021 Toyota Sienna XLE
  "40": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 41. 2023 Toyota Crown Limited
  "41": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 42. 2024 Toyota GR86 Track
  "42": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 43. 2022 Toyota Supra 2.0
  "43": {
    noLongerAvailable: true,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 44. 2023 Toyota bZ4X XLE
  "44": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 45. 2024 Toyota Avalon Limited
  "45": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 46. 2021 Toyota C-HR Limited
  "46": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: true,
    limitedPhotos: false,
  },
  // 47. 2023 Toyota Sequoia TRD Pro
  "47": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 48. 2024 Toyota GR Corolla Circuit
  "48": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 49. 2022 Toyota Land Cruiser Heritage
  "49": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
  // 50. 2023 Toyota Mirai XLE
  "50": {
    noLongerAvailable: false,
    historyReportPending: false,
    inspectionInProgress: false,
    limitedPhotos: false,
  },
};
