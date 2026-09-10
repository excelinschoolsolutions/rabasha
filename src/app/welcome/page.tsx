import { Button } from "@/components/Button";

const perks = [
  "Pioneer status",
  "Hall of Fame eligibility",
  "Early feature access",
  "3 months of Mụta Pro",
  "A say in what we build next",
];

export default function WelcomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <span className="text-4xl">🎉</span>
      <h1 className="mt-4 text-headline-lg-mobile">Welcome, Pioneer</h1>
      <p className="mt-2 text-onSurface-variant">You are</p>
      <p className="mt-1 text-3xl font-extrabold text-secondary">
        Mụta Pioneer #127
      </p>

      <ul className="mt-8 w-full space-y-2 text-left">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-sm text-onSurface">
            <span className="text-secondary">✓</span>
            {perk}
          </li>
        ))}
      </ul>

      <Button href="/dashboard" className="mt-8 w-full">
        Enter my Pioneer Hub
      </Button>
    </main>
  );
}
