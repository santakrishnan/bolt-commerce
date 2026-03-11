export interface ProcessStep {
  icon: "refresh" | "search" | "shield" | "clipboard";
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
}
