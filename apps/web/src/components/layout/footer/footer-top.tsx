import Image from "next/image";
import Link from "next/link";
import { socialLinks } from "~/lib/data/footer/footer-links";

const iconMap = {
  facebook: "/images/footer/icon-facebook.svg",
  twitter: "/images/footer/icon-twitter.svg",
  instagram: "/images/footer/icon-instagram.svg",
  youtube: "/images/footer/icon-youtube.svg",
} as const;

/**
 * FooterTop - Brand section with social media links
 * Client Component for interactive social links
 */
export function FooterTop() {
  return (
    <div>
      {/* Brand Section */}
      <div className="mb-4">
        <h2 className="mb-4 font-bold font-toyota text-[var(--actions-accent)] text-xl leading-6">
          Arrow
        </h2>
        <p className="font-normal font-toyota text-[var(--states-inverse-muted-foreground)] text-sm leading-5">
          Your trusted partner for quality pre-owned vehicles
        </p>
      </div>

      {/* Social Media Icons */}
      <div className="flex items-center justify-around">
        {socialLinks.map((link) => {
          const iconSrc = iconMap[link.icon];
          return (
            <Link
              aria-label={link.label}
              className="text-[var(--core-surfaces-inverse-foreground)] transition-colors hover:text-[var(--core-surfaces-inverse-foreground)]/80"
              href={link.href}
              key={link.label}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image alt={link.label} height={24} src={iconSrc} width={24} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
