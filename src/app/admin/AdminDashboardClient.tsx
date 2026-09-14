"use client";

import { useState } from "react";
import { AdminSidebar, AdminTab } from "./AdminSidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

interface AdminDashboardClientProps {
  admin: {
    email: string;
    role: string;
  };
  initialMetrics: {
    totalPioneers: number;
    activePioneers: number;
    pendingPioneers: number;
    totalRevenueNaira: number;
    totalTransactions: number;
    totalFeatures: number;
  };
  initialRecentPioneers: any[];
  initialRecentContributions: any[];
}

export function AdminDashboardClient({
  admin,
  initialMetrics,
  initialRecentPioneers,
  initialRecentContributions,
}: AdminDashboardClientProps) {
  const [currentTab, setCurrentTab] = useState<AdminTab>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [metrics, setMetrics] = useState(initialMetrics);

  // Pioneers state
  const [pioneers, setPioneers] = useState<any[]>(initialRecentPioneers);
  const [pioneerSearch, setPioneerSearch] = useState("");
  const [pioneerStatusFilter, setPioneerStatusFilter] = useState("");
  const [loadingPioneers, setLoadingPioneers] = useState(false);

  // Contributions state
  const [contributions, setContributions] = useState<any[]>(initialRecentContributions);
  const [contribFilter, setContribFilter] = useState("");
  const [loadingContrib, setLoadingContrib] = useState(false);

  // Features state
  const [features, setFeatures] = useState<any[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(false);

  // Updates state
  const [updates, setUpdates] = useState<any[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(false);
  const [newUpdateTitle, setNewUpdateTitle] = useState("");
  const [newUpdateBody, setNewUpdateBody] = useState("");
  const [publishingUpdate, setPublishingUpdate] = useState(false);

  // Message alert
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  function showAlert(msg: string) {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 3000);
  }

  // Fetch full pioneers list
  async function loadPioneers(search = pioneerSearch, status = pioneerStatusFilter) {
    setLoadingPioneers(true);
    try {
      const url = new URL("/api/admin/pioneers", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (status) url.searchParams.set("status", status);
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.pioneers) setPioneers(data.pioneers);
    } catch (err) {
      console.error("Error loading pioneers:", err);
    } finally {
      setLoadingPioneers(false);
    }
  }

  // Update pioneer status
  async function handleUpdatePioneerStatus(pioneerId: string, newStatus: string) {
    try {
      const res = await fetch("/api/admin/pioneers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pioneerId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setPioneers((prev) =>
          prev.map((p) => (p.id === pioneerId ? { ...p, status: newStatus } : p))
        );
        showAlert(`Pioneer status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  // Fetch full contributions list
  async function loadContributions(status = contribFilter) {
    setLoadingContrib(true);
    try {
      const url = new URL("/api/admin/contributions", window.location.origin);
      if (status) url.searchParams.set("status", status);
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.contributions) setContributions(data.contributions);
    } catch (err) {
      console.error("Error loading contributions:", err);
    } finally {
      setLoadingContrib(false);
    }
  }

  // Fetch features list
  async function loadFeatures() {
    setLoadingFeatures(true);
    try {
      const res = await fetch("/api/admin/features");
      const data = await res.json();
      if (data.features) setFeatures(data.features);
    } catch (err) {
      console.error("Error loading features:", err);
    } finally {
      setLoadingFeatures(false);
    }
  }

  // Update feature status
  async function handleUpdateFeatureStatus(featureId: string, newStatus: string) {
    try {
      const res = await fetch("/api/admin/features", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setFeatures((prev) =>
          prev.map((f) => (f.id === featureId ? { ...f, status: newStatus } : f))
        );
        showAlert(`Feature status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error("Error updating feature status:", err);
    }
  }

  // Fetch updates
  async function loadUpdates() {
    setLoadingUpdates(true);
    try {
      const res = await fetch("/api/admin/updates");
      const data = await res.json();
      if (data.updates) setUpdates(data.updates);
    } catch (err) {
      console.error("Error loading updates:", err);
    } finally {
      setLoadingUpdates(false);
    }
  }

  // Create update
  async function handleCreateUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!newUpdateTitle.trim() || !newUpdateBody.trim()) return;

    setPublishingUpdate(true);
    try {
      const res = await fetch("/api/admin/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newUpdateTitle, body: newUpdateBody }),
      });
      const data = await res.json();
      if (data.success && data.update) {
        setUpdates((prev) => [data.update, ...prev]);
        setNewUpdateTitle("");
        setNewUpdateBody("");
        showAlert("Announcement published to pioneers!");
      }
    } catch (err) {
      console.error("Error creating update:", err);
    } finally {
      setPublishingUpdate(false);
    }
  }

  // Delete update
  async function handleDeleteUpdate(updateId: string) {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`/api/admin/updates?id=${updateId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setUpdates((prev) => prev.filter((u) => u.id !== updateId));
        showAlert("Announcement deleted");
      }
    } catch (err) {
      console.error("Error deleting update:", err);
    }
  }

  // Handle Tab Switching
  function handleSelectTab(tab: AdminTab) {
    setCurrentTab(tab);
    if (tab === "pioneers") loadPioneers();
    if (tab === "contributions") loadContributions();
    if (tab === "features") loadFeatures();
    if (tab === "updates") loadUpdates();
  }

  return (
    <div className="flex min-h-screen bg-surface-low">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        adminEmail={admin.email}
        adminRole={admin.role}
        isOpenMobile={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="rounded-lg p-2 text-onSurface hover:bg-surface-low md:hidden"
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <h1 className="text-lg font-bold text-onSurface capitalize">
              {currentTab === "overview" && "Executive Dashboard Overview"}
              {currentTab === "pioneers" && "Pioneers Directory & Moderation"}
              {currentTab === "contributions" && "Paystack Transactions & Revenue"}
              {currentTab === "features" && "Feature Lab Moderation"}
              {currentTab === "updates" && "Platform Announcements Manager"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              ● System Online
            </span>
            <Button
              variant="secondary"
              className="text-xs px-3 py-1.5"
              onClick={() => handleSelectTab(currentTab)}
            >
              ↻ Refresh
            </Button>
          </div>
        </header>

        {/* Global Toast Alert */}
        {alertMessage && (
          <div className="mx-6 mt-4 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition">
            ✓ {alertMessage}
          </div>
        )}

        {/* Body Container */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {currentTab === "overview" && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <Card className="p-4">
                  <p className="text-xs font-semibold text-onSurface-variant uppercase">
                    Total Pioneers
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-onSurface">
                    {metrics.totalPioneers}
                  </p>
                </Card>

                <Card className="p-4 bg-emerald-50 border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-800 uppercase">
                    Active (Paid)
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-emerald-900">
                    {metrics.activePioneers}
                  </p>
                </Card>

                <Card className="p-4 bg-amber-50 border-amber-200">
                  <p className="text-xs font-semibold text-amber-800 uppercase">
                    Pending Payment
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-amber-900">
                    {metrics.pendingPioneers}
                  </p>
                </Card>

                <Card className="p-4 bg-secondary-container">
                  <p className="text-xs font-semibold text-secondary-onContainer uppercase">
                    Total Revenue
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-secondary">
                    ₦{metrics.totalRevenueNaira.toLocaleString()}
                  </p>
                </Card>

                <Card className="p-4">
                  <p className="text-xs font-semibold text-onSurface-variant uppercase">
                    Paid Transactions
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-onSurface">
                    {metrics.totalTransactions}
                  </p>
                </Card>

                <Card className="p-4">
                  <p className="text-xs font-semibold text-onSurface-variant uppercase">
                    Feature Ideas
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-onSurface">
                    {metrics.totalFeatures}
                  </p>
                </Card>
              </div>

              {/* Two Column Layout for Recent Activity */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Pioneers */}
                <Card>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-bold text-onSurface">Recent Pioneer Signups</h2>
                    <button
                      onClick={() => handleSelectTab("pioneers")}
                      className="text-xs font-semibold text-secondary hover:underline"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-outline-variant text-xs text-onSurface-variant uppercase">
                        <tr>
                          <th className="pb-2">Name</th>
                          <th className="pb-2">University</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/60">
                        {pioneers.slice(0, 5).map((p) => (
                          <tr key={p.id}>
                            <td className="py-2.5 font-medium text-onSurface">
                              {p.full_name}
                              <span className="block text-xs text-onSurface-variant">
                                {p.email}
                              </span>
                            </td>
                            <td className="py-2.5 text-xs text-onSurface-variant">
                              {p.university || "RSU"}
                            </td>
                            <td className="py-2.5">
                              <span
                                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                  p.status === "active"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-bold text-onSurface">Recent Contributions</h2>
                    <button
                      onClick={() => handleSelectTab("contributions")}
                      className="text-xs font-semibold text-secondary hover:underline"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-outline-variant text-xs text-onSurface-variant uppercase">
                        <tr>
                          <th className="pb-2">Pioneer</th>
                          <th className="pb-2">Amount</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/60">
                        {contributions.slice(0, 5).map((c) => (
                          <tr key={c.id}>
                            <td className="py-2.5 font-medium text-onSurface">
                              {c.pioneers?.full_name || "Pioneer"}
                              <span className="block font-mono text-[11px] text-onSurface-variant">
                                {c.paystack_ref}
                              </span>
                            </td>
                            <td className="py-2.5 font-bold text-secondary">
                              ₦{(c.amount || 0).toLocaleString()}
                            </td>
                            <td className="py-2.5">
                              <span
                                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                  c.status === "success"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: PIONEERS MANAGEMENT */}
          {currentTab === "pioneers" && (
            <Card>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <input
                  type="text"
                  placeholder="Search by name, email, referral code..."
                  value={pioneerSearch}
                  onChange={(e) => {
                    setPioneerSearch(e.target.value);
                    loadPioneers(e.target.value, pioneerStatusFilter);
                  }}
                  className="w-full sm:max-w-xs rounded-lg border border-outline-variant px-3 py-2 text-sm outline-none focus:border-secondary"
                />

                <div className="flex gap-2 flex-wrap">
                  {["", "active", "pending_payment", "inactive"].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setPioneerStatusFilter(st);
                        loadPioneers(pioneerSearch, st);
                      }}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                        pioneerStatusFilter === st
                          ? "bg-secondary text-white"
                          : "bg-surface-low border border-outline-variant text-onSurface"
                      }`}
                    >
                      {st === "" ? "All Statuses" : st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {loadingPioneers ? (
                <p className="py-8 text-center text-sm text-onSurface-variant">Loading pioneers...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-outline-variant text-xs text-onSurface-variant uppercase">
                      <tr>
                        <th className="pb-3">Pioneer</th>
                        <th className="pb-3">Contact</th>
                        <th className="pb-3">Academics</th>
                        <th className="pb-3">Referral Code</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Change Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/60">
                      {pioneers.map((p) => (
                        <tr key={p.id}>
                          <td className="py-3 font-medium text-onSurface">
                            {p.full_name}
                            <span className="block text-xs text-secondary font-bold">
                              #{String(p.pioneer_number || 0).padStart(4, "0")}
                            </span>
                          </td>
                          <td className="py-3 text-xs text-onSurface-variant">
                            <div>{p.email}</div>
                            <div>{p.phone}</div>
                          </td>
                          <td className="py-3 text-xs text-onSurface-variant">
                            <div>{p.university}</div>
                            <div>{p.department} ({p.level})</div>
                          </td>
                          <td className="py-3 font-mono text-xs font-semibold text-onSurface">
                            {p.referral_code}
                          </td>
                          <td className="py-3">
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                p.status === "active"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <select
                              value={p.status}
                              onChange={(e) => handleUpdatePioneerStatus(p.id, e.target.value)}
                              className="rounded border border-outline-variant bg-white px-2 py-1 text-xs outline-none focus:border-secondary"
                            >
                              <option value="active">Active (Paid)</option>
                              <option value="pending_payment">Pending Payment</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* TAB 3: CONTRIBUTIONS */}
          {currentTab === "contributions" && (
            <Card>
              <div className="mb-6 flex gap-2">
                {["", "success", "pending", "failed"].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setContribFilter(st);
                      loadContributions(st);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                      contribFilter === st
                        ? "bg-secondary text-white"
                        : "bg-surface-low border border-outline-variant text-onSurface"
                    }`}
                  >
                    {st === "" ? "All Contributions" : st}
                  </button>
                ))}
              </div>

              {loadingContrib ? (
                <p className="py-8 text-center text-sm text-onSurface-variant">Loading contributions...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-outline-variant text-xs text-onSurface-variant uppercase">
                      <tr>
                        <th className="pb-3">Pioneer</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Paystack Reference</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/60">
                      {contributions.map((c) => (
                        <tr key={c.id}>
                          <td className="py-3 font-medium text-onSurface">
                            {c.pioneers?.full_name || "Pioneer"}
                            <span className="block text-xs text-onSurface-variant">
                              {c.pioneers?.email}
                            </span>
                          </td>
                          <td className="py-3 text-base font-bold text-secondary">
                            ₦{(c.amount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 font-mono text-xs text-onSurface">
                            {c.paystack_ref}
                          </td>
                          <td className="py-3">
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                c.status === "success"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3 text-xs text-onSurface-variant">
                            {new Date(c.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* TAB 4: FEATURE MODERATION */}
          {currentTab === "features" && (
            <Card>
              <h2 className="mb-4 font-bold text-onSurface">Feature Ideas & Votes</h2>
              {loadingFeatures ? (
                <p className="py-8 text-center text-sm text-onSurface-variant">Loading feature requests...</p>
              ) : features.length === 0 ? (
                <p className="py-8 text-center text-sm text-onSurface-variant">No feature ideas yet.</p>
              ) : (
                <div className="space-y-4">
                  {features.map((f) => (
                    <div
                      key={f.id}
                      className="flex flex-col gap-3 rounded-card border border-outline-variant p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-onSurface">{f.title}</h3>
                          <span className="rounded bg-secondary-container px-2 py-0.5 text-xs font-bold text-secondary-onContainer">
                            {f.votesCount} Votes
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-onSurface-variant">{f.description}</p>
                        <p className="mt-2 text-xs text-onSurface-variant">
                          Suggested by {f.pioneer?.full_name || "Pioneer"} ({f.pioneer?.university}) on{" "}
                          {new Date(f.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-onSurface-variant">
                          Status:
                        </label>
                        <select
                          value={f.status}
                          onChange={(e) => handleUpdateFeatureStatus(f.id, e.target.value)}
                          className="rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs font-medium outline-none focus:border-secondary capitalize"
                        >
                          <option value="under_review">Under Review</option>
                          <option value="planned">Planned 🚀</option>
                          <option value="shipped">Shipped ✓</option>
                          <option value="declined">Declined ✕</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* TAB 5: PLATFORM ANNOUNCEMENTS */}
          {currentTab === "updates" && (
            <div className="space-y-6">
              {/* Creator Form */}
              <Card>
                <h2 className="font-bold text-onSurface">Publish New Announcement</h2>
                <p className="text-xs text-onSurface-variant">
                  This announcement will appear directly on every Pioneer's dashboard.
                </p>

                <form onSubmit={handleCreateUpdate} className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-onSurface">
                      Announcement Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mụta Pro Beta Testing Begins for RSU Pioneers!"
                      value={newUpdateTitle}
                      onChange={(e) => setNewUpdateTitle(e.target.value)}
                      required
                      className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-onSurface">
                      Content / Body
                    </label>
                    <textarea
                      placeholder="Write announcement details..."
                      value={newUpdateBody}
                      onChange={(e) => setNewUpdateBody(e.target.value)}
                      required
                      rows={4}
                      className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm outline-none focus:border-secondary"
                    />
                  </div>

                  <Button type="submit" disabled={publishingUpdate}>
                    {publishingUpdate ? "Publishing..." : "📢 Publish Announcement"}
                  </Button>
                </form>
              </Card>

              {/* Announcements List */}
              <Card>
                <h2 className="mb-4 font-bold text-onSurface">Published Announcements</h2>
                {loadingUpdates ? (
                  <p className="py-8 text-center text-sm text-onSurface-variant">Loading announcements...</p>
                ) : updates.length === 0 ? (
                  <p className="py-8 text-center text-sm text-onSurface-variant">No announcements published yet.</p>
                ) : (
                  <div className="space-y-4">
                    {updates.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-start justify-between rounded-lg border border-outline-variant p-4"
                      >
                        <div>
                          <h3 className="font-bold text-onSurface">{u.title}</h3>
                          <p className="mt-1 text-sm text-onSurface-variant whitespace-pre-line">
                            {u.body}
                          </p>
                          <span className="mt-2 block text-xs text-onSurface-variant">
                            Published on {new Date(u.published_at).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteUpdate(u.id)}
                          className="rounded p-1 text-xs font-semibold text-error hover:bg-error-container/20 transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
