export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="rounded-pill bg-secondary-container px-4 py-1 text-sm font-semibold text-secondary-onContainer">
        Stage 1 · Project setup
      </span>
      <h1 className="text-headline-lg-mobile md:text-display-hero">
        Mụta Pioneer platform
      </h1>
      <p className="max-w-md text-onSurface-variant">
        The project is wired up: Next.js, Tailwind with the Mụta design
        tokens, and Supabase are connected. The real landing page comes in
        Stage 2.
      </p>
    </main>
  );
}
