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

// Sample dealer data
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
