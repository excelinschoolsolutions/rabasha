"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FadeUp({
  children,
  delay = 0,
  id,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  id?: string;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
