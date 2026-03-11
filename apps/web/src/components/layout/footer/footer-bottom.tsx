import Image from "next/image";
import Link from "next/link";
import { contactInfo } from "~/lib/data/footer/footer-links";

/**
 * FooterBottom - Contact information and copyright
 * Server Component
 */
export function FooterBottom({ section }: { section: "contact" | "copyright" }) {
  if (section === "contact") {
    return (
      <>
        {/* Call Us - left aligned */}
        <Link
          className="group flex items-center justify-start gap-3 transition-colors hover:text-[var(--core-surfaces-inverse-foreground)]/80"
          href={contactInfo.phone.href}
        >
          <div className="text-[var(--actions-accent)]">
            <Image alt="Phone" height={20} src="/images/footer/icon-phone.svg" width={20} />
          </div>
          <div>
            <p className="text-[var(--states-inverse-muted-foreground)] text-sm sm:hidden">
              {contactInfo.phone.label}
            </p>
            <p className="hidden text-[var(--states-inverse-muted-foreground)] text-xs sm:block sm:text-sm">
              {contactInfo.phone.label}
            </p>
            <p className="hidden font-semibold text-[var(--core-surfaces-inverse-foreground)] text-sm sm:block sm:text-base">
              {contactInfo.phone.value}
            </p>
          </div>
        </Link>

        {/* Email Us - center aligned */}
        <Link
          className="group flex items-center justify-center gap-3 transition-colors hover:text-[var(--core-surfaces-inverse-foreground)]/80"
          href={contactInfo.email.href}
        >
          <div className="text-[var(--actions-accent)]">
            <Image alt="Email" height={20} src="/images/footer/icon-email.svg" width={20} />
          </div>
          <div>
            <p className="text-[var(--states-inverse-muted-foreground)] text-sm sm:hidden">
              {contactInfo.email.label}
            </p>
            <p className="hidden text-[var(--states-inverse-muted-foreground)] text-xs sm:block sm:text-sm">
              {contactInfo.email.label}
            </p>
            <p className="hidden font-semibold text-[var(--core-surfaces-inverse-foreground)] text-sm sm:block sm:text-base">
              {contactInfo.email.value}
            </p>
          </div>
        </Link>

        {/* Find a Location - right aligned */}
        <Link
          className="group flex items-center justify-end gap-3 transition-colors hover:text-[var(--core-surfaces-inverse-foreground)]/80"
          href={contactInfo.location.href}
        >
          <div className="text-[var(--actions-accent)]">
            <Image alt="Location" height={20} src="/images/footer/icon-location.svg" width={20} />
          </div>
          <div>
            <p className="text-[var(--states-inverse-muted-foreground)] text-sm sm:hidden">
              {contactInfo.location.label}
            </p>
            <p className="hidden text-[var(--states-inverse-muted-foreground)] text-xs sm:block sm:text-sm">
              {contactInfo.location.label}
            </p>
            <p className="hidden font-semibold text-[var(--core-surfaces-inverse-foreground)] text-sm sm:block sm:text-base">
              {contactInfo.location.value}
            </p>
          </div>
        </Link>
      </>
    );
  }
  // copyright row
  return (
    <div className="flex flex-col gap-2 font-normal font-toyota text-[var(--states-inverse-muted-foreground)] text-sm leading-5 tracking-[-0.15px] sm:flex-row sm:items-center sm:justify-between">
      <p>&copy; 2026 Toyota Financial Services. All rights reserved.</p>
    </div>
  );
}
