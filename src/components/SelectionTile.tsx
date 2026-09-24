"use client";

import { motion } from "framer-motion";

export function SelectionTile({
  label,
  sublabel,
  selected,
  onClick,
}: {
  label: string;
  sublabel: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`rounded-card border p-4 text-center transition-colors ${
        selected
          ? "border-secondary bg-secondary text-secondary-on"
          : "border-outline-variant bg-white text-onSurface"
      }`}
    >
      <p className="text-lg font-bold">{label}</p>
      <p
        className={`text-xs ${
          selected ? "text-secondary-on/80" : "text-onSurface-variant"
        }`}
      >
        {sublabel}
      </p>
    </motion.button>
  );
}
