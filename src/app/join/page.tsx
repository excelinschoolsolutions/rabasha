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
  const referredByCode = searchParams.get("ref") ?? "";
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
        {referredByCode && (
          <p className="mt-2 text-xs text-secondary">
            Referred by a Pioneer — thanks for joining through them!
          </p>
        )}
      </div>

      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="referredByCode" value={referredByCode} />

        <Field label="Full name" name="fullName" type="text" required />
        <Field label="Email address" name="email" type="email" required />
        <Field label="Phone number" name="phone" type="tel" required />
        <Field
          label="University"
          name="university"
          type="text"
          defaultValue="Rivers State University"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Department" name="department" type="text" required />
          <Field label="Level" name="level" type="text" required />
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
          <input type="checkbox" className="mt-1" required />
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
  hint,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
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
        className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-onSurface outline-none focus:border-secondary"
      />
      {hint && <p className="mt-1 text-xs text-onSurface-variant">{hint}</p>}
    </div>
  );
}
