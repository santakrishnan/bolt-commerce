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
      { label: "Buy a Car", href: "#" },
      { label: "Finance Options", href: "#" },
      { label: "Trade-In Value", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "FAQs", href: "#" },
      { label: "Financing Help", href: "#" },
      { label: "Returns & Exchanges", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Arrow", href: "#" },
      { label: "Press", href: "#" },
      { label: "Partnerships", href: "#" },
      { label: "Locations", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Accessibility", href: "#" },
      { label: "Sitemap", href: "#" },
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
    href: "#",
  },
};
