import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
};

const styles = {
  primary:
    "bg-secondary text-secondary-on hover:bg-[#00543a] disabled:bg-outline-variant disabled:text-outline",
  secondary:
    "bg-white text-onSurface border border-outline-variant hover:bg-surface-low",
  ghost: "text-secondary hover:underline",
};

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm font-semibold transition-colors ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button className={base} {...props}>
      {children}
    </button>
  );
}
