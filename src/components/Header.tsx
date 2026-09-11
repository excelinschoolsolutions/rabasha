import Link from "next/link";
import { Button } from "./Button";

const navLinks = [
  { href: "/#why-muta", label: "Why Mụta" },
  { href: "/#benefits", label: "Pioneer benefits" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-extrabold text-onSurface">
          M<span className="text-secondary">ụ</span>ta
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-onSurface-variant hover:text-onSurface"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Button href="/join" className="hidden md:inline-flex">
          Become a Pioneer
        </Button>
        {/* Mobile: keep it to one clear action instead of a hidden menu for now */}
        <Button href="/join" className="md:hidden">
          Join
        </Button>
      </div>
    </header>
  );
}
