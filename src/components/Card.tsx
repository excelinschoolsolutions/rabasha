import { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-outline-variant bg-white p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
