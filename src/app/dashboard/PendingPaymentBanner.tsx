import { Button } from "@/components/Button";
import { logoutPioneer } from "@/lib/auth-actions";

interface PendingPaymentBannerProps {
  fullName: string;
  email: string;
}

export function PendingPaymentBanner({ fullName, email }: PendingPaymentBannerProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-2xl text-secondary">
        ⏳
      </div>

      <h1 className="mt-6 text-headline-lg-mobile font-bold text-onSurface">
        Pioneer Payment Incomplete
      </h1>

      <p className="mt-3 text-sm text-onSurface-variant leading-relaxed">
        Hello <strong className="text-onSurface">{fullName || email}</strong>, your account is registered, but your Pioneer contribution is still <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">pending payment</span>.
      </p>

      <p className="mt-2 text-sm text-onSurface-variant leading-relaxed">
        You must complete your initial contribution (minimum ₦2,000) to activate your Pioneer status and unlock the Pioneer Hub, Hall of Fame eligibility, and referral earnings.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href="/checkout" className="w-full sm:w-auto">
          Complete Payment (₦2,000+)
        </Button>
        <form action={logoutPioneer} className="w-full sm:w-auto">
          <Button variant="secondary" type="submit" className="w-full">
            Log out
          </Button>
        </form>
      </div>

      <p className="mt-6 text-xs text-onSurface-variant">
        Already made a payment? If your network was interrupted, refreshing after a moment will verify your status.
      </p>
    </main>
  );
}
