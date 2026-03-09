import { FooterBottom } from "./footer/footer-bottom";
import { FooterNavigation } from "./footer/footer-navigation";
import { FooterTop } from "./footer/footer-top";

/**
 * Footer - Main footer component
 * Combines all footer sections with dark theme
 */
export function Footer() {
  return (
    <div className="w-full bg-[var(--core-surfaces-foreground)]">
      <div className="mx-auto max-w-[var(--container-2xl)] px-4 sm:px-6 lg:px-20">
        <footer className="font-toyota text-[var(--states-inverse-muted-foreground)]">
          <div
            className="flex w-full flex-col"
            style={{
              paddingTop: "48px",
              paddingBottom: "48px",
            }}
          >
            {/* Row 1: Brand + Navigation (5 columns) */}
            <div className="grid w-full grid-cols-1 gap-[32px] border-[var(--structure-interaction-inverse-border)] border-b pb-[40px] md:grid-cols-5">
              {/* Brand */}
              <div className="min-w-0">
                <FooterTop />
              </div>
              {/* Navigation: 4 columns evenly spaced */}
              <FooterNavigation />
            </div>

            {/* Row 2: Contact Info (3 columns) */}
            <div className="flex w-full flex-row gap-[32px] border-[var(--structure-interaction-inverse-border)] border-b py-[32px] md:grid md:grid-cols-3">
              <FooterBottom section="contact" />
            </div>

            {/* Row 3: Copyright & Project Info */}
            <div className="w-full pt-[24px]">
              <FooterBottom section="copyright" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
