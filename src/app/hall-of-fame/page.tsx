import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/Card";

const placeholders = Array.from({ length: 6 }, (_, i) => ({
  number: String(i + 1).padStart(3, "0"),
}));

export default function HallOfFamePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-center text-headline-lg-mobile md:text-headline-lg">
          The students who believed first
        </h1>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {placeholders.map((p) => (
            <Card key={p.number} className="text-center">
              <p className="text-sm font-semibold text-secondary">
                #{p.number}
              </p>
              <p className="mt-2 font-semibold text-onSurface">
                Pioneer #{p.number}
              </p>
              <p className="text-sm text-onSurface-variant">
                Rivers State University
              </p>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-onSurface-variant">
          Sample placeholders — real Pioneers replace these as they join.
        </p>
      </main>
      <Footer />
    </>
  );
}
