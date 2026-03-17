export interface ProcessStep {
  description: string;
  icon: "refresh" | "search" | "shield" | "clipboard";
  linkHref?: string;
  linkText?: string;
  title: string;
}
