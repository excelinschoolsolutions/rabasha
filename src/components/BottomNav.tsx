"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  LayoutGrid,
  Share2,
  Lightbulb,
  Megaphone,
  ShieldCheck,
} from "lucide-react";

const items = [
  { id: "overview", label: "Dashboard", icon: LayoutGrid },
  { id: "referrals", label: "Referrals", icon: Share2 },
  { id: "feature-lab", label: "Feature Lab", icon: Lightbulb },
  { id: "updates", label: "Updates", icon: Megaphone },
];

// Admin is shown as a placeholder nav item for visual parity with the
// reference design — it links out to /admin rather than scrolling, since
// admin lives on its own route, not a dashboard section.
const adminItem = { id: "admin", label: "Admin", icon: ShieldCheck };

export function BottomNav({ showAdmin = false }: { showAdmin?: boolean }) {
  const [active, setActive] = useState("overview");
  const allItems = showAdmin ? [...items, adminItem] : items;

  function handleClick(id: string) {
    if (id === "admin") {
      window.location.href = "/admin";
      return;
    }
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="flex items-center gap-1 rounded-pill bg-white p-1.5 shadow-floating">
        {allItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="relative flex items-center gap-2 rounded-pill px-4 py-2.5 text-sm font-semibold transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 rounded-pill bg-secondary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 flex items-center gap-2 ${
                  isActive ? "text-secondary-on" : "text-onSurface-variant"
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
