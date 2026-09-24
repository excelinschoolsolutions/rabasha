"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { SelectionTile } from "@/components/SelectionTile";
import { startCheckout } from "./actions";

const tiers = [
  { amount: 2000, label: "Pioneer" },
  { amount: 5000, label: "Pioneer Supporter" },
  { amount: 10000, label: "Pioneer Champion" },
  { amount: 25000, label: "Pioneer Partner" },
];

export default function CheckoutPage() {
  const [selected, setSelected] = useState<number>(tiers[0].amount);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const finalAmount = customAmount ? Number(customAmount) : selected;

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("amount", String(finalAmount));
    startTransition(async () => {
      const result = await startCheckout(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-8 text-center"
      >
        <p className="text-sm font-semibold text-secondary">Step 2 of 2</p>
        <h1 className="mt-2 text-headline-lg-mobile">
          Claim your Pioneer spot
        </h1>
      </motion.div>

      <form action={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          {tiers.map((tier) => (
            <SelectionTile
              key={tier.label}
              label={`₦${tier.amount.toLocaleString()}`}
              sublabel={tier.label}
              selected={!customAmount && selected === tier.amount}
              onClick={() => {
                setSelected(tier.amount);
                setCustomAmount("");
              }}
            />
          ))}
        </div>

        <div className="mt-4">
          <label
            htmlFor="custom"
            className="mb-1 block text-sm font-medium text-onSurface"
          >
            Or enter a custom amount
          </label>
          <input
            id="custom"
            type="number"
            min={2000}
            placeholder="₦"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-onSurface outline-none focus:border-secondary"
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 rounded-lg bg-error-container px-4 py-3 text-sm text-error"
          >
            {error}
          </motion.p>
        )}

        <Button type="submit" className="mt-6 w-full" disabled={isPending}>
          {isPending
            ? "Redirecting to payment…"
            : `Contribute ₦${finalAmount.toLocaleString()} & become a Pioneer`}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-onSurface-variant">
        Payment is processed securely through Paystack.
      </p>
    </main>
  );
}
