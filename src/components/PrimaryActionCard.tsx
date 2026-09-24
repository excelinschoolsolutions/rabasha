"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function PrimaryActionCard({
  title,
  subtitle,
  onClick,
  href,
}: {
  title: string;
  subtitle: string;
  onClick?: () => void;
  href?: string;
}) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="flex cursor-pointer items-center justify-between rounded-card bg-secondary px-6 py-6 text-secondary-on shadow-soft sm:px-8 sm:py-8"
    >
      <div>
        <p className="text-lg font-bold sm:text-xl">{title}</p>
        <p className="mt-1 text-sm text-secondary-on/80">{subtitle}</p>
      </div>
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
        <ArrowRight size={20} />
      </span>
    </motion.div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }
  return <div onClick={onClick}>{content}</div>;
}
