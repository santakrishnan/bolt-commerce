export interface CustomerJourneySlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
}

export const customerJourneySlides: CustomerJourneySlide[] = [
  {
    id: "prequalify",
    image: "/images/prequalify-banner/carousel-image-1.png",
    title: "PREQUALIFY FOR YOUR NEXT TOYOTA",
    subtitle: "Get personalized rates with a soft credit check. Know your budget before you shop.",
    ctaText: "Get PreQualified",
  },
  {
    id: "trade-in",
    image: "/images/prequalify-banner/carousel-image-2.png",
    title: "What's your trade-in value?",
    subtitle:
      "Know What Your Car Is Worth Get a free estimate in minutes and apply it toward your next vehicle.",
    ctaText: "Get trade-in value",
  },
  {
    id: "test-drive",
    image: "/images/prequalify-banner/carousel-image-3.png",
    title: "TEST DRIVE YOUR NEXT CAR. DRIVE IT HOME.",
    subtitle: "Browse Our Inventory And Schedule A Test Drive At Your Local Toyota Dealer.",
    ctaText: "Schedule test drive",
  },
];
