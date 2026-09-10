import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

const problems = [
  {
    title: "Too much information",
    body: "Notes, slides, textbooks, group chats — everything scattered, nothing organized.",
  },
  {
    title: "Difficult to revise",
    body: "No fast way to turn hours of lecture material into something you can actually study from.",
  },
  {
    title: "Limited study support",
    body: "Most students figure it out alone, with no structured help between classes and exams.",
  },
  {
    title: "No personalized learning",
    body: "Every student learns differently, but most study tools treat everyone the same.",
  },
];

const benefits = [
  {
    title: "Mụta Hall of Fame",
    body: "Your name — and photo, if you want — featured among the students who supported Mụta from day one.",
  },
  {
    title: "First access",
    body: "Try new features before they're released to everyone else.",
  },
  {
    title: "3 months of Mụta Pro",
    body: "Full Pro access for three months, free, once Mụta launches.",
  },
  {
    title: "Help shape Mụta",
    body: "Suggest features, vote on ideas, and give direct feedback on the design.",
  },
  {
    title: "Pioneer recognition",
    body: "An official Pioneer number, proof you were here first.",
  },
];

const steps = [
  {
    title: "Join the waitlist",
    body: "Create your Pioneer account — it takes about a minute.",
  },
  {
    title: "Make your contribution",
    body: "Support the early development of Mụta with ₦2,000 or more.",
  },
  {
    title: "Start building with us",
    body: "Get into your Pioneer Hub, follow updates, and help shape the product.",
  },
];

const faqs = [
  {
    q: "What is Mụta?",
    a: "Mụta is an AI-powered study app being built specifically for Nigerian undergraduate students, by the team behind Excel In School. It's currently in development — the Pioneer program is how we build it together with students.",
  },
  {
    q: "Who can become a Pioneer?",
    a: "Any Nigerian undergraduate student can join. We're starting with students already connected to Excel In School, especially at Rivers State University, before opening more widely.",
  },
  {
    q: "How much does it cost?",
    a: "₦2,000 is the minimum contribution. You can contribute more if you'd like — ₦5,000, ₦10,000, ₦25,000, or a custom amount.",
  },
  {
    q: "What do I get as a Pioneer?",
    a: "A Pioneer number, a place in the Hall of Fame, early access to features, 3 months of Mụta Pro after launch, and a direct say in what we build.",
  },
  {
    q: "When will Mụta launch?",
    a: "We're building in the open with our Pioneers. There's no public launch date yet — Pioneers will be the first to know as we get closer.",
  },
  {
    q: "How will I receive updates?",
    a: "Through your Pioneer Hub, email, and our WhatsApp community for Pioneers.",
  },
];

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center md:pt-24">
          <span className="inline-block rounded-pill bg-secondary-container px-4 py-1 text-sm font-semibold text-secondary-onContainer">
            Mụta Pioneer Program
          </span>
          <h1 className="mt-6 text-headline-lg-mobile md:text-display-hero">
            Become a M<span className="text-secondary">ụ</span>ta Pioneer
          </h1>
          <p className="mt-4 text-lg font-semibold text-onSurface">
            Help us build Nigeria&rsquo;s smarter way of learning.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-onSurface-variant">
            You&rsquo;ve been specially invited to make history. Become one of
            the first 500 students shaping Mụta — an AI-powered study app
            built to help Nigerian undergraduates learn smarter.
          </p>
          <p className="mt-6 text-sm font-bold uppercase tracking-wide text-onSurface">
            The first 500 won&rsquo;t just use Mụta. They&rsquo;ll help build
            it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/join">Become a Pioneer</Button>
            <Button href="#how-it-works" variant="secondary">
              See how it works
            </Button>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-2 text-sm text-onSurface-variant sm:flex-row sm:gap-6">
            <span>
              <strong className="text-onSurface">500</strong> pioneer slots
            </span>
            <span>
              <strong className="text-onSurface">₦2,000+</strong> to join
            </span>
            <span>Starting with students at Rivers State University</span>
          </div>
        </section>

        <section id="why-muta" className="bg-surface-low py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-headline-lg-mobile md:text-headline-lg">
              Studying shouldn&rsquo;t be this hard
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-onSurface-variant">
              Every semester, Nigerian students spend hours going through
              lecture notes, preparing for exams, searching for resources,
              and trying to figure out what they actually need to learn.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {problems.map((p) => (
                <Card key={p.title}>
                  <h3 className="font-semibold text-onSurface">{p.title}</h3>
                  <p className="mt-2 text-sm text-onSurface-variant">
                    {p.body}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-headline-lg-mobile md:text-headline-lg">
              Meet M<span className="text-secondary">ụ</span>ta
            </h2>
            <p className="mt-4 text-onSurface-variant">
              An AI-powered study app being built to give Nigerian
              undergraduate students smarter tools for studying and
              learning.
            </p>
            <div className="mt-8 rounded-card border border-outline-variant bg-primary-container p-8 text-left text-primary-onContainer">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">
                  M<span className="text-secondary">ụ</span>ta
                </span>
                <span className="rounded-pill bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  Product concept
                </span>
              </div>
              <p className="mt-6 text-sm text-white/70">
                Screens shown throughout this site are early product
                concepts, not a finished or launched product.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary-container py-16 text-white">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-headline-lg-mobile md:text-headline-lg">
              We don&rsquo;t want to build Mụta alone
            </h2>
            <p className="mt-4 text-white/80">
              We want students to help us build it. Pioneers help us
              understand real student problems, suggest features, test
              ideas, and give feedback on the experience.
            </p>
            <p className="mt-6 text-sm text-white/60">
              Student problem → Idea → Pioneer feedback → Product → Mụta
            </p>
            <div className="mt-8">
              <Button href="/join">Become one of the first 500</Button>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-headline-lg-mobile md:text-headline-lg">
              Your Pioneer benefits
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <Card key={b.title}>
                  <h3 className="font-semibold text-onSurface">{b.title}</h3>
                  <p className="mt-2 text-sm text-onSurface-variant">
                    {b.body}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-surface-low py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-center text-headline-lg-mobile md:text-headline-lg">
              Becoming a Pioneer takes 3 steps
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.title} className="text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-on font-bold">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 font-semibold text-onSurface">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-onSurface-variant">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button href="/join">Become a Pioneer</Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-headline-lg-mobile md:text-headline-lg">
              500 Pioneers. One community.
            </h2>
            <p className="mt-6 text-4xl font-extrabold text-secondary">
              127
              <span className="text-lg text-onSurface-variant">
                {" "}
                / 500 pioneers
              </span>
            </p>
            <div className="mt-4 h-3 w-full overflow-hidden rounded-pill bg-surface-highest">
              <div className="h-full w-[25%] rounded-pill bg-secondary" />
            </div>
            <p className="mt-3 text-sm text-onSurface-variant">
              ₦254,000 raised toward ₦1,000,000
            </p>
          </div>
        </section>

        <section className="bg-surface-low py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center text-headline-lg-mobile md:text-headline-lg">
              What should we build next?
            </h2>
            <p className="mt-3 text-center text-onSurface-variant">
              As a Pioneer, your ideas can influence what we build.
            </p>
            <div className="mt-8 space-y-3">
              {[
                ["AI voice tutor", 143],
                ["Smart study planner", 121],
                ["Offline study mode", 98],
                ["AI past-question assistant", 87],
              ].map(([title, votes]) => (
                <div
                  key={title as string}
                  className="flex items-center justify-between rounded-card border border-outline-variant bg-white px-5 py-4"
                >
                  <span className="font-medium text-onSurface">{title}</span>
                  <span className="text-sm font-semibold text-secondary">
                    ▲ {votes} votes
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-onSurface-variant">
              Example of how Feature Lab voting works once you&rsquo;re a
              Pioneer.
            </p>
          </div>
        </section>

        <section id="faq" className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center text-headline-lg-mobile md:text-headline-lg">
              Frequently asked questions
            </h2>
            <div className="mt-8 divide-y divide-outline-variant rounded-card border border-outline-variant bg-white">
              {faqs.map((f) => (
                <details key={f.q} className="group px-6 py-4">
                  <summary className="cursor-pointer list-none font-semibold text-onSurface">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm text-onSurface-variant">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary-container py-16 text-center text-white">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="text-headline-lg-mobile md:text-headline-lg">
              The first 500 won&rsquo;t just be users. They&rsquo;ll be
              Pioneers.
            </h2>
            <p className="mt-4 text-white/80">
              Help us build a smarter way for Nigerian students to learn.
            </p>
            <div className="mt-8">
              <Button href="/join">Become a Mụta Pioneer</Button>
            </div>
            <p className="mt-4 text-sm text-white/60">
              ₦2,000+ contribution · Limited to the first 500 Pioneers
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
