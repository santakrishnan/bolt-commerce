import Link from "next/link";
import { cn } from "@/lib/utils";

export const HeaderNav = ({ useSolidStyles }: { useSolidStyles: boolean }) => {
  const navLinkClass = cn(
    "font-normal text-sm leading-none hover:underline hover:underline-offset-4",
    useSolidStyles ? "text-text-dark" : "text-white"
  );

  return (
    <nav className="hidden items-center gap-3 lg:flex xl:gap-12">
      <Link className={navLinkClass} href="#" style={{ fontFamily: "var(--font-toyota-type)" }}>
        Buy
      </Link>
      <Link className={navLinkClass} href="#" style={{ fontFamily: "var(--font-toyota-type)" }}>
        Finance
      </Link>
      <Link className={navLinkClass} href="#" style={{ fontFamily: "var(--font-toyota-type)" }}>
        Why Arrow
      </Link>
    </nav>
  );
};
