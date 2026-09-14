"use client";

import { logoutAdmin } from "@/lib/auth-actions";

export type AdminTab = "overview" | "pioneers" | "contributions" | "features" | "updates";

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  adminEmail: string;
  adminRole: string;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const navItems: { id: AdminTab; label: string; icon: string }[] = [
  { id: "overview", label: "Dashboard Overview", icon: "📊" },
  { id: "pioneers", label: "Pioneers Management", icon: "👥" },
  { id: "contributions", label: "Payments & Revenue", icon: "💳" },
  { id: "features", label: "Feature Moderation", icon: "💡" },
  { id: "updates", label: "Platform Announcements", icon: "📢" },
];

export function AdminSidebar({
  currentTab,
  onSelectTab,
  adminEmail,
  adminRole,
  isOpenMobile,
  onCloseMobile,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-outline-variant bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo / Header */}
        <div className="flex h-16 items-center justify-between border-b border-outline-variant px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white shadow-sm">
              🛡️
            </span>
            <span className="font-extrabold text-onSurface tracking-tight">
              M<span className="text-secondary">ụ</span>ta Admin
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded p-1 text-onSurface-variant hover:bg-surface-low md:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-secondary text-white shadow-sm"
                    : "text-onSurface-variant hover:bg-surface-low hover:text-onSurface"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Admin Footer & Logout */}
        <div className="border-t border-outline-variant p-4">
          <div className="mb-3 rounded-lg bg-surface-low p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-onSurface-variant">
                Role
              </span>
              <span className="rounded bg-secondary-container px-1.5 py-0.5 text-[10px] font-bold text-secondary-onContainer uppercase">
                {adminRole}
              </span>
            </div>
            <p className="mt-1 truncate text-xs font-medium text-onSurface">
              {adminEmail}
            </p>
          </div>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-outline-variant px-3 py-2 text-xs font-semibold text-error hover:bg-error-container/20 transition"
            >
              <span>🚪</span>
              <span>Log out Admin</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
