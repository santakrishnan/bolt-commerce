import { Heading } from "@tfs-ucmp/ui";
import Link from "next/link";
import { footerSections } from "~/lib/data/footer/footer-links";
import { FooterNavMobile } from "./footer-nav-mobile";

/**
 * FooterNavigation - Server Component
 *
 * Renders static desktop nav links on the server.
 * Delegates the mobile accordion to a client component (FooterNavMobile)
 * so the Radix JS is only shipped to clients that need it.
 */
export function FooterNavigation() {
  return (
    <>
      {/* Desktop grid (md+) — fully static, zero client JS */}
      {footerSections.map((section) => (
        <div className="hidden min-w-0 md:block" key={section.title}>
          <Heading
            className="mb-4 text-[var(--core-surfaces-inverse-foreground)] text-xl leading-6 md:text-xl"
            level={3}
            weight="bold"
          >
            {section.title}
          </Heading>
          <ul className="space-y-3">
            {section.links.map((link) => (
              <li key={link.label}>
                <Link
                  className="font-normal font-toyota text-[var(--states-inverse-muted-foreground)] text-sm leading-4 transition-colors hover:text-[var(--core-surfaces-inverse-foreground)]/80"
                  href={link.href}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  target={link.external ? "_blank" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Mobile accordion — client component boundary */}
      <FooterNavMobile />
    </>
  );
}
