"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { logoutPioneer } from "@/lib/auth-actions";

interface PioneerData {
  id: string;
  pioneer_number?: number;
  full_name: string;
  email: string;
  university: string;
  department: string;
  level: string;
  referral_code: string;
  status: string;
  created_at: string;
}

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  importance: string;
  status: string;
  votesCount: number;
  userVote: "up" | "down" | null;
}

interface UpdateItem {
  id: string;
  title: string;
  body: string;
  published_at: string;
}

interface JourneyStep {
  label: string;
  done: boolean;
}

interface DashboardClientProps {
  pioneer: PioneerData;
  referredCount: number;
  journey: JourneyStep[];
  initialFeatures: FeatureItem[];
  updates: UpdateItem[];
}

/* ─── Share popup modal ─────────────────────────────────────────────────── */
function SharePopup({
  pioneer,
  formattedPioneerNumber,
  memberSince,
  onClose,
}: {
  pioneer: PioneerData;
  formattedPioneerNumber: string;
  memberSince: string;
  onClose: () => void;
}) {
  const shareText = `🎓 I just became a Mụta Pioneer ${formattedPioneerNumber}!\n\nMụta is building the future of education in Nigeria — and I'm one of the first backing it.\n\nJoin as a Pioneer with my link: https://muta.excelinschool.com/?ref=${pioneer.referral_code || "MUTA"}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(`https://muta.excelinschool.com/?ref=${pioneer.referral_code || "MUTA"}`);

  const socials = [
    {
      name: "WhatsApp",
      icon: "💬",
      color: "bg-[#25D366] hover:bg-[#1ebe5d]",
      href: `https://api.whatsapp.com/send?text=${encodedText}`,
    },
    {
      name: "Telegram",
      icon: "✈️",
      color: "bg-[#0088cc] hover:bg-[#0077b3]",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: "X (Twitter)",
      icon: "🐦",
      color: "bg-black hover:bg-neutral-800",
      href: `https://twitter.com/intent/tweet?text=${encodedText}`,
    },
    {
      name: "Facebook",
      icon: "📘",
      color: "bg-[#1877F2] hover:bg-[#1565d8]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: "💼",
      color: "bg-[#0A66C2] hover:bg-[#0959a8]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pioneer card visual preview */}
        <div className="mb-5 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#0a7a5a] p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
              Mụta Pioneer
            </p>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
              Official Card
            </span>
          </div>
          <p className="mt-2 text-3xl font-black tracking-tight">{formattedPioneerNumber}</p>
          <p className="mt-3 text-base font-bold capitalize">{pioneer.full_name}</p>
          <p className="text-xs text-white/80">{pioneer.university}</p>
          <p className="text-[11px] text-white/60">
            {pioneer.department} • {pioneer.level}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-2 text-[10px] text-white/60">
            <span>Since {memberSince}</span>
            <span className="font-mono text-white/80">muta.excelinschool.com</span>
          </div>
        </div>

        <p className="mb-3 text-center text-sm font-bold text-onSurface">
          Share your Pioneer card to social media 🚀
        </p>

        <div className="flex flex-col gap-2">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition ${s.color}`}
            >
              <span>{s.icon}</span>
              <span>Share on {s.name}</span>
            </a>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl border border-outline-variant py-2.5 text-sm font-semibold text-onSurface-variant transition hover:bg-surface-low"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ─── Main Dashboard Client ──────────────────────────────────────────────── */
export function DashboardClient({
  pioneer,
  referredCount,
  journey,
  initialFeatures,
  updates,
}: DashboardClientProps) {
  const [features, setFeatures] = useState<FeatureItem[]>(initialFeatures);
  const [copied, setCopied] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [suggestTitle, setSuggestTitle] = useState("");
  const [suggestDesc, setSuggestDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedPioneerNumber = pioneer.pioneer_number
    ? `#${String(pioneer.pioneer_number).padStart(4, "0")}`
    : "#0001";

  const memberSince = pioneer.created_at
    ? new Date(pioneer.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "September 2026";

  const referralLink = `muta.excelinschool.com/?ref=${pioneer.referral_code || "MUTA"}`;
  const referralFull = `https://muta.excelinschool.com/?ref=${pioneer.referral_code || "MUTA"}`;

  function handleCopy() {
    navigator.clipboard.writeText(referralFull);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleVote(featureId: string) {
    try {
      const res = await fetch("/api/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote", featureId, voteType: "up" }),
      });
      if (res.ok) {
        setFeatures((prev) =>
          prev.map((f) => {
            if (f.id === featureId) {
              const isLiked = f.userVote === "up";
              return {
                ...f,
                votesCount: isLiked ? f.votesCount - 1 : f.votesCount + 1,
                userVote: isLiked ? null : "up",
              };
            }
            return f;
          })
        );
      }
    } catch (err) {
      console.error("Voting error:", err);
    }
  }

  async function handleSuggestFeature(e: React.FormEvent) {
    e.preventDefault();
    if (!suggestTitle.trim() || !suggestDesc.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suggest",
          title: suggestTitle,
          description: suggestDesc,
        }),
      });
      const data = await res.json();
      if (data.success && data.idea) {
        setFeatures((prev) => [
          {
            id: data.idea.id,
            title: data.idea.title,
            description: data.idea.description,
            importance: data.idea.importance,
            status: data.idea.status,
            votesCount: 0,
            userVote: null,
          },
          ...prev,
        ]);
        setSuggestTitle("");
        setSuggestDesc("");
        setShowSuggestModal(false);
      }
    } catch (err) {
      console.error("Feature submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {/* Share Popup */}
      {showSharePopup && (
        <SharePopup
          pioneer={pioneer}
          formattedPioneerNumber={formattedPioneerNumber}
          memberSince={memberSince}
          onClose={() => setShowSharePopup(false)}
        />
      )}

      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xl font-extrabold text-onSurface">
            M<span className="text-secondary">ụ</span>ta
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-pill bg-secondary-container px-3 py-1 text-xs font-semibold text-secondary-onContainer">
            Active Pioneer
          </span>
          <span className="text-sm text-onSurface-variant">
            Welcome, {pioneer.full_name?.split(" ")[0] || "Pioneer"}
          </span>
          <form action={logoutPioneer}>
            <button
              type="submit"
              className="text-sm text-onSurface-variant hover:text-onSurface hover:underline"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      {/* Overview */}
      <section className="grid gap-6 md:grid-cols-[280px_1fr]">
        <div
          className="rounded-card p-6 text-white shadow-sm"
          style={{ background: "linear-gradient(135deg, #1e3a5f, #0a7a5a)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Pioneer
          </p>
          <p className="mt-1 text-2xl font-extrabold">{formattedPioneerNumber}</p>
          <p className="mt-4 font-semibold capitalize">{pioneer.full_name}</p>
          <p className="text-sm text-white/70">{pioneer.university}</p>
          <p className="text-xs text-white/50">
            {pioneer.department} • {pioneer.level}
          </p>
          <p className="mt-4 text-xs text-white/50">Since {memberSince}</p>
          <Button
            variant="secondary"
            className="mt-4 w-full"
            onClick={() => setShowSharePopup(true)}
          >
            🃏 Share my Pioneer card
          </Button>
        </div>

        <Card>
          <h2 className="font-semibold text-onSurface">Your journey</h2>
          <ul className="mt-4 space-y-2">
            {journey.map((step) => (
              <li
                key={step.label}
                className={`flex items-center gap-2 text-sm ${
                  step.done ? "text-onSurface" : "text-onSurface-variant"
                }`}
              >
                <span className={step.done ? "text-secondary font-bold" : ""}>
                  {step.done ? "✓" : "○"}
                </span>
                {step.label}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Referrals */}
      <section className="mt-8">
        <Card className="bg-secondary-container">
          <h2 className="font-semibold text-secondary-onContainer">
            Refer and earn — a Pioneer-only benefit
          </h2>
          <p className="mt-2 text-sm text-secondary-onContainer/80">
            As a Pioneer, you can earn commission on referrals once Mụta
            launches. Students who join after launch can still refer
            friends, but only Pioneers earn from it.
          </p>
        </Card>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-sm text-onSurface-variant">Your referral link</p>
            <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-outline-variant bg-surface-low px-3 py-2 text-sm">
              <span className="truncate font-mono text-xs">{referralLink}</span>
            </div>
            <Button
              variant="secondary"
              className="mt-3 w-full"
              onClick={handleCopy}
            >
              {copied ? "Copied to Clipboard! ✓" : "Copy referral link"}
            </Button>
          </Card>
          <Card>
            <p className="text-sm text-onSurface-variant">
              Pioneers you&rsquo;ve referred
            </p>
            <p className="mt-2 text-3xl font-extrabold text-onSurface">
              {referredCount}
            </p>
          </Card>
        </div>
      </section>

      {/* Feature Lab */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-onSurface">Feature Lab</h2>
            <p className="text-xs text-onSurface-variant">
              Like features you want built, or suggest your own ideas.
            </p>
          </div>
          <button
            onClick={() => setShowSuggestModal(true)}
            className="flex items-center gap-2 rounded-pill border border-secondary/40 bg-secondary-container px-4 py-2 text-sm font-bold text-secondary transition hover:bg-secondary hover:text-white"
          >
            💡 Suggest an idea
          </button>
        </div>

        {/* Suggest Modal */}
        {showSuggestModal && (
          <div className="mb-6 rounded-card border border-secondary/30 bg-secondary-container/20 p-5">
            <h3 className="text-sm font-bold text-onSurface">Suggest a Feature for Mụta</h3>
            <form onSubmit={handleSuggestFeature} className="mt-3 space-y-3">
              <input
                type="text"
                placeholder="Feature title (e.g. Past Questions AI Solver)"
                value={suggestTitle}
                onChange={(e) => setSuggestTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-onSurface outline-none focus:border-secondary"
              />
              <textarea
                placeholder="Explain why this feature would help Nigerian students study better..."
                value={suggestDesc}
                onChange={(e) => setSuggestDesc(e.target.value)}
                required
                rows={3}
                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-onSurface outline-none focus:border-secondary"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Idea"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowSuggestModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {features.length === 0 ? (
            <p className="text-sm text-onSurface-variant italic">
              No feature ideas submitted yet. Be the first to suggest one!
            </p>
          ) : (
            features.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-card border border-outline-variant bg-white px-5 py-4 transition hover:border-secondary/50"
              >
                <div>
                  <span className="font-medium text-onSurface">{f.title}</span>
                  {f.description && (
                    <p className="mt-1 text-xs text-onSurface-variant">{f.description}</p>
                  )}
                  {f.status && f.status !== "under_review" && (
                    <span className="mt-1 inline-block rounded bg-secondary-container px-2 py-0.5 text-[10px] font-semibold text-secondary-onContainer uppercase">
                      {f.status}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleVote(f.id)}
                  className={`flex items-center gap-1.5 rounded-pill border px-4 py-2 text-sm font-bold transition ${
                    f.userVote === "up"
                      ? "border-red-400 bg-red-50 text-red-500"
                      : "border-outline-variant text-onSurface-variant hover:border-red-300 hover:text-red-400"
                  }`}
                  title={f.userVote === "up" ? "Unlike" : "Like this idea"}
                >
                  <span className="text-base leading-none">{f.userVote === "up" ? "❤️" : "🤍"}</span>
                  <span className="font-bold">{f.votesCount}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Platform Updates */}
      {updates.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 font-semibold text-onSurface">Platform Updates</h2>
          <div className="space-y-3">
            {updates.map((update) => (
              <Card key={update.id}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-onSurface">{update.title}</h3>
                  <span className="text-xs text-onSurface-variant">
                    {new Date(update.published_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-onSurface-variant whitespace-pre-line">
                  {update.body}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Telegram Community */}
      <section className="mt-8">
        <Card className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-onSurface">
              Join the Pioneer Telegram community ✈️
            </h2>
            <p className="mt-1 text-sm text-onSurface-variant">
              Get updates, ask questions, and meet other Pioneers from your university.
            </p>
          </div>
          <Button href="https://t.me/excelinschool" target="_blank" rel="noopener noreferrer">
            Join Telegram group
          </Button>
        </Card>
      </section>
    </main>
  );
}
