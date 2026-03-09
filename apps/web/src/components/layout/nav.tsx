import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Nav - Server Component
 * Main navigation links
 */
export function Nav() {
  return (
    <nav className="hidden md:flex md:gap-6">
      {navItems.map((item) => (
        <Link
          className="font-medium text-sm transition-colors hover:text-primary"
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
