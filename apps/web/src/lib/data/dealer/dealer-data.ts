// Mock dealer data keyed by zip code — sourced from state-hero-config.json zip codes
import dealersByZip from "./mock-dealers-by-zip.json";

export interface DealerInfo {
  address: string;
  dealershipImage: string;
  hours: string;
  id: string;
  name: string;
  phone: string;
  rating: number;
}

export interface DealerNotes {
  dealer: DealerInfo;
  vehicleDescription: string;
  vehicleImage: string;
}

// Fallback used when no entry exists in mock-dealers-by-zip.json for the given zip
export const sampleDealerNotes: DealerNotes = {
  vehicleDescription:
    "This well-maintained 2022 Toyota Highlander SEL comes with low miles and is in excellent condition. It has been thoroughly inspected and certified by our team of expert technicians. The vehicle features all the latest safety technology and comfort features you'd expect from a premium SUV. Don't miss this opportunity to own a reliable and stylish vehicle at a great price.",
  vehicleImage: "/images/vdp/dealer_info.png",
  dealer: {
    id: "toyota-fort-worth",
    name: "Toyota of Fort Worth",
    address: "Fort Worth, TX 76116",
    phone: "(817) 555-0123",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM",
    rating: 4.8,
    dealershipImage: "/images/vdp/dealer.png",
  },
};

// Derive the zip keys and entry shape directly from the JSON.
// TypeScript infers the structure from the imported JSON. Use a runtime
// guard when indexing by an arbitrary string to avoid unsafe `as` casts.
type DealersByZip = typeof dealersByZip;
type ZipKey = keyof DealersByZip;

function isZipKey(zip: string): zip is ZipKey {
  return Object.hasOwn(dealersByZip, zip);
}

/**
 * Look up dealer info and dealer notes for a given zip code.
 *
 * Reads from mock-dealers-by-zip.json (keyed by the zip codes defined in
 * state-hero-config.json). The zip value is sourced from the `arrow_manual_zip`
 * cookie via LocationProvider → useDealerData hook.
 *
 * Falls back to sampleDealerNotes when the zip has no entry in the mock data.
 */
export function getDealerDataByZip(zip: string): {
  dealerInfo: DealerInfo;
  dealerNotes: DealerNotes;
} {
  if (!isZipKey(zip)) {
    return {
      dealerInfo: sampleDealerNotes.dealer,
      dealerNotes: sampleDealerNotes,
    };
  }

  const entry = dealersByZip[zip];

  return {
    dealerInfo: entry.dealerInfo,
    dealerNotes: {
      vehicleDescription: entry.dealerNotes.vehicleDescription,
      vehicleImage: entry.dealerNotes.vehicleImage,
      dealer: entry.dealerInfo,
    },
  };
}
