import { MessageCircle, Users2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { BottomNav } from "@/components/BottomNav";
import { PrimaryActionCard } from "@/components/PrimaryActionCard";
import { IconLinkCard } from "@/components/IconLinkCard";
import { FadeUp } from "@/components/FadeUp";
import { logout } from "@/lib/auth-actions";

const journey = [
  { label: "Joined waitlist", done: true },
  { label: "Became a Pioneer", done: true },
  { label: "Explore Mụta", done: false },
  { label: "Submit a feature idea", done: false },
  { label: "Attend a Pioneer meeting", done: false },
  { label: "Mụta launch", done: false },
];

const features = [
  { title: "AI voice tutor", votes: 143 },
  { title: "Smart study planner", votes: 121 },
  { title: "Offline study mode", votes: 98 },
];

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-32 pt-10">
      <header className="mb-8 flex items-center justify-between">
        <p className="text-xl font-extrabold text-onSurface">
          M<span className="text-secondary">ụ</span>ta
        </p>
        <div className="flex items-center gap-3">
          <span className="rounded-pill bg-secondary-container px-3 py-1 text-xs font-semibold text-secondary-onContainer">
            Active Pioneer
          </span>
          <form action={logout}>
            <button className="text-sm text-onSurface-variant hover:text-onSurface hover:underline">
              Log out
            </button>
          </form>
        </div>
      </header>

      {/* Overview */}
      <FadeUp id="overview">
        <PrimaryActionCard
          title="Explore Mụta"
          subtitle="Preview the app concept and what's coming next"
          href="#feature-lab"
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <IconLinkCard
            icon={MessageCircle}
            iconBg="#dcfce7"
            iconColor="#16a34a"
            title="WhatsApp Group"
            subtitle="Join the discussion"
            href="#"
          />
          <IconLinkCard
            icon={Users2}
            iconBg="#dbeafe"
            iconColor="#2563eb"
            title="Pioneer Card"
            subtitle="#0127 · Chidinma Nnamdi"
            href="#profile"
          />
        </div>

        <Card className="mt-4">
          <h2 className="font-semibold text-onSurface">Your journey</h2>
          <ul className="mt-4 space-y-2">
            {journey.map((step) => (
              <li
                key={step.label}
                className={`flex items-center gap-2 text-sm ${
                  step.done ? "text-onSurface" : "text-onSurface-variant"
                }`}
              >
                <span>{step.done ? "✓" : "○"}</span>
                {step.label}
              </li>
            ))}
          </ul>
        </Card>
      </FadeUp>

      {/* Feature Lab */}
      <FadeUp id="feature-lab" delay={0.05} className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-onSurface">Feature Lab</h2>
          <Button variant="ghost">Suggest an idea</Button>
        </div>
        <div className="space-y-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-center justify-between rounded-card border border-outline-variant bg-white px-5 py-4 shadow-soft"
            >
              <span className="font-medium text-onSurface">{f.title}</span>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-secondary">
                  {f.votes} votes
                </span>
                <button className="rounded-pill border border-outline-variant px-3 py-1">
                  ▲
                </button>
              </div>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Referrals */}
      <FadeUp id="referrals" delay={0.1} className="mt-10">
        <h2 className="mb-4 font-semibold text-onSurface">Referrals</h2>
        <Card className="bg-secondary-container">
          <h3 className="font-semibold text-secondary-onContainer">
            Invite friends → earn rewards
          </h3>
          <p className="mt-2 text-sm text-secondary-onContainer/80">
            As a Pioneer, you can earn commission on referrals once Mụta
            launches. Students who join after launch can still refer
            friends, but only Pioneers earn from it.
          </p>
        </Card>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-sm text-onSurface-variant">Your referral link</p>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-low px-3 py-2 text-sm">
              <span className="truncate">mụta.com/?ref=CN0127</span>
            </div>
            <Button variant="secondary" className="mt-3 w-full">
              Copy link
            </Button>
          </Card>
          <Card>
            <p className="text-sm text-onSurface-variant">Pioneers you&rsquo;ve referred</p>
            <p className="mt-2 text-3xl font-extrabold text-onSurface">7</p>
          </Card>
        </div>
      </FadeUp>

      {/* Profile */}
      <FadeUp id="profile" delay={0.15} className="mt-10">
        <h2 className="mb-4 font-semibold text-onSurface">Profile</h2>
        <Card>
          <p className="font-semibold text-onSurface">Chidinma Nnamdi</p>
          <p className="text-sm text-onSurface-variant">
            Rivers State University
          </p>
          <p className="mt-1 text-xs text-onSurface-variant">
            Pioneer #0127 · Since September 2026
          </p>
        </Card>
      </FadeUp>

      <BottomNav />
    </main>
  );
}
