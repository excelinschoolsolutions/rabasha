import { Button } from "@/components/Button";

const tiers = [
  { amount: "₦2,000", label: "Pioneer" },
  { amount: "₦5,000", label: "Pioneer Supporter" },
  { amount: "₦10,000", label: "Pioneer Champion" },
  { amount: "₦25,000+", label: "Pioneer Partner" },
];

export default function CheckoutPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold text-secondary">Step 2 of 2</p>
        <h1 className="mt-2 text-headline-lg-mobile">Claim your Pioneer spot</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tiers.map((tier, i) => (
          <label
            key={tier.label}
            className={`cursor-pointer rounded-card border p-4 text-center ${
              i === 0
                ? "border-secondary bg-secondary-container"
                : "border-outline-variant bg-white"
            }`}
          >
            <input
              type="radio"
              name="tier"
              value={tier.amount}
              defaultChecked={i === 0}
              className="sr-only"
            />
            <p className="text-lg font-bold text-onSurface">{tier.amount}</p>
            <p className="text-sm text-onSurface-variant">{tier.label}</p>
          </label>
        ))}
      </div>

      <div className="mt-4">
        <label htmlFor="custom" className="mb-1 block text-sm font-medium text-onSurface">
          Or enter a custom amount
        </label>
        <input
          id="custom"
          name="custom"
          type="number"
          min={2000}
          placeholder="₦"
          className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-onSurface outline-none focus:border-secondary"
        />
      </div>

      {/* Not wired to Paystack yet — that happens in Stage 4 */}
      <Button type="button" className="mt-6 w-full">
        Contribute &amp; become a Pioneer
      </Button>

      <p className="mt-4 text-center text-xs text-onSurface-variant">
        Payment is processed securely through Paystack.
      </p>
    </main>
  );
}
