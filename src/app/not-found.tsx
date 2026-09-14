import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-extrabold text-onSurface">404</h1>
      <p className="mt-2 text-headline-lg-mobile text-onSurface">Page not found</p>
      <p className="mt-2 text-sm text-onSurface-variant">
        The page you are looking for doesn&rsquo;t exist or has been moved.
      </p>
      <div className="mt-6">
        <Button href="/">Return Home</Button>
      </div>
    </main>
  );
}
