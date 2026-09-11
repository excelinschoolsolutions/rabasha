export default function CheckoutPendingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary-container border-t-secondary" />
      <h1 className="mt-6 text-headline-lg-mobile">Confirming your payment</h1>
      <p className="mt-2 text-sm text-onSurface-variant">
        This usually takes a few seconds. Don&rsquo;t close this page.
      </p>
    </main>
  );
}
