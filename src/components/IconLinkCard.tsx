"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export function IconLinkCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  href,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 rounded-card border border-outline-variant bg-white p-4 shadow-soft"
    >
      <span
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={20} color={iconColor} />
      </span>
      <div>
        <p className="text-sm font-bold text-onSurface">{title}</p>
        <p className="text-xs text-onSurface-variant">{subtitle}</p>
      </div>
    </motion.a>
  );
}
