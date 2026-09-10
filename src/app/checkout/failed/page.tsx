import { Button } from "@/components/Button";

export default function CheckoutFailedPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-container text-error">
        !
      </div>
      <h1 className="mt-6 text-headline-lg-mobile">Payment didn&rsquo;t go through</h1>
      <p className="mt-2 text-sm text-onSurface-variant">
        Nothing was charged. You can try again, or use a different card or
        transfer method.
      </p>
      <div className="mt-6 flex gap-3">
        <Button href="/checkout">Try again</Button>
        <Button href="mailto:support@excelinschool.com" variant="secondary">
          Contact support
        </Button>
      </div>
    </main>
  );
}
