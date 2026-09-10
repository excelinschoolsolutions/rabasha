import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

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
    <main className="mx-auto max-w-4xl px-6 py-10">
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
            Welcome, Chidinma
          </span>
        </div>
      </header>

      {/* Overview */}
      <section className="grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="rounded-card bg-primary-container p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Pioneer
          </p>
          <p className="mt-1 text-2xl font-extrabold">#0127</p>
          <p className="mt-4 font-semibold">Chidinma Nnamdi</p>
          <p className="text-sm text-white/70">Rivers State University</p>
          <p className="mt-4 text-xs text-white/50">Since September 2026</p>
          <Button variant="secondary" className="mt-4 w-full">
            Share my Pioneer card
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
                <span>{step.done ? "✓" : "○"}</span>
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
      </section>

      {/* Feature Lab */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-onSurface">Feature Lab</h2>
          <Button variant="ghost">Suggest an idea</Button>
        </div>
        <div className="space-y-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-center justify-between rounded-card border border-outline-variant bg-white px-5 py-4"
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
      </section>

      {/* WhatsApp */}
      <section className="mt-8">
        <Card className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-onSurface">
              Join the Pioneer WhatsApp community
            </h2>
            <p className="mt-1 text-sm text-onSurface-variant">
              Get updates, ask questions, and meet other Pioneers.
            </p>
          </div>
          <Button>Join WhatsApp group</Button>
        </Card>
      </section>
    </main>
  );
}
