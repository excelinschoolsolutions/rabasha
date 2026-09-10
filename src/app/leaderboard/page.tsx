import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const rows = [
  { rank: 1, name: "Tamuno B.", referrals: 34 },
  { rank: 2, name: "Blessing E.", referrals: 27 },
  { rank: 3, name: "Favour O.", referrals: 19 },
  { rank: 4, name: "Chidinma N.", referrals: 7 },
];

export default function LeaderboardPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-center text-headline-lg-mobile md:text-headline-lg">
          Referral leaderboard
        </h1>
        <p className="mt-3 text-center text-onSurface-variant">
          Pioneers who&rsquo;ve invited the most students so far.
        </p>
        <div className="mt-8 divide-y divide-outline-variant rounded-card border border-outline-variant bg-white">
          {rows.map((row) => (
            <div
              key={row.rank}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-4">
                <span className="w-6 text-sm font-semibold text-onSurface-variant">
                  {row.rank}
                </span>
                <span className="font-medium text-onSurface">{row.name}</span>
              </div>
              <span className="text-sm font-semibold text-secondary">
                {row.referrals} referrals
              </span>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
