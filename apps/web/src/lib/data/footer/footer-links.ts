/**
 * Footer Navigation Links Data
 */

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const footerSections: FooterSection[] = [
  {
    title: "Shop",
    links: [
      { label: "Buy a Car", href: "/buy" },
      { label: "Finance Options", href: "/finance" },
      { label: "Trade-In Value", href: "/trade-in" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Financing Help", href: "/finance/help" },
      { label: "Returns & Exchanges", href: "/returns" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Arrow", href: "/about" },
      { label: "Press", href: "/press" },
      { label: "Partnerships", href: "/partnerships" },
      { label: "Locations", href: "/locations" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
];

export const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
] as const;

export const contactInfo = {
  phone: {
    label: "Call Us",
    value: "1-800-GO-Arrow",
    href: "tel:1-800-462-7769",
  },
  email: {
    label: "Email Us",
    value: "support@arrow.com",
    href: "mailto:support@arrow.com",
  },
  location: {
    label: "Find a Location",
    value: "Dealership Locator",
    href: "/locations",
  },
};
