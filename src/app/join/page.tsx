"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { Button } from "@/components/Button";
import { registerPioneer } from "./actions";

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinForm />
    </Suspense>
  );
}

function JoinForm() {
  const searchParams = useSearchParams();
  const initialReferral = searchParams.get("ref") ?? "";
  const [referralCode, setReferralCode] = useState(initialReferral);
  const [university, setUniversity] = useState("Rivers State University");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await registerPioneer(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold text-secondary">Step 1 of 2</p>
        <h1 className="mt-2 text-headline-lg-mobile">
          Let&rsquo;s get you started
        </h1>
        <p className="mt-2 text-sm text-onSurface-variant">
          Become a Mụta Pioneer in less than 2 minutes.
        </p>
        {initialReferral && (
          <p className="mt-2 text-xs font-semibold text-secondary">
            Referred by a Pioneer ({initialReferral}) — thanks for joining through them!
          </p>
        )}
      </div>

      <form action={handleSubmit} className="space-y-4">
        <Field label="Full name" name="fullName" type="text" required placeholder="e.g. Delight Worgu" />
        <Field label="Email address" name="email" type="email" required placeholder="e.g. delight@example.com" />
        <Field label="Phone number" name="phone" type="tel" required placeholder="e.g. 08012345678" />

        {/* University Dropdown - strictly Rivers State University and Others */}
        <div>
          <label
            htmlFor="university"
            className="mb-1 block text-sm font-medium text-onSurface"
          >
            University
          </label>
          <select
            id="university"
            name="university"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            required
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-onSurface outline-none focus:border-secondary"
          >
            <option value="Rivers State University">Rivers State University</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Department" name="department" type="text" required placeholder="e.g. Mathematics" />
          <Field label="Level" name="level" type="text" required placeholder="e.g. 400 lvl" />
        </div>

        {/* Referral Code Field */}
        <div>
          <label
            htmlFor="referredByCode"
            className="mb-1 block text-sm font-medium text-onSurface"
          >
            Referral code <span className="text-xs text-onSurface-variant font-normal">(optional)</span>
          </label>
          <input
            id="referredByCode"
            name="referredByCode"
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="e.g. MUTA-1234"
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-mono text-sm text-onSurface outline-none focus:border-secondary"
          />
        </div>

        <Field
          label="Password"
          name="password"
          type="password"
          required
          hint="At least 8 characters."
        />
        <Field
          label="Confirm password"
          name="confirmPassword"
          type="password"
          required
        />

        <label className="flex items-start gap-2 text-sm text-onSurface-variant">
          <input type="checkbox" className="mt-1" required defaultChecked />
          I agree to receive Mụta Pioneer updates.
        </label>

        {error && (
          <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating your account…" : "Continue to contribution"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-onSurface-variant">
        Already a Pioneer?{" "}
        <Link href="/login" className="font-semibold text-secondary">
          Log in
        </Link>
      </p>
    </main>
  );
}

function Field({
  label,
  name,
  type,
  required,
  defaultValue,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-onSurface"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-onSurface outline-none focus:border-secondary"
      />
      {hint && <p className="mt-1 text-xs text-onSurface-variant">{hint}</p>}
    </div>
  );
}
