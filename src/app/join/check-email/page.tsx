export default function CheckEmailPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <span className="text-4xl">📩</span>
      <h1 className="mt-4 text-headline-lg-mobile">Check your email</h1>
      <p className="mt-2 text-sm text-onSurface-variant">
        We&rsquo;ve sent you a confirmation link. Click it, then come back and
        log in to continue to payment.
      </p>
    </main>
  );
}
