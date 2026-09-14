"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { loginAdmin } from "./actions";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await loginAdmin(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white shadow-md">
          🛡️
        </div>
        <h1 className="text-2xl font-extrabold text-onSurface">
          Mụta Administrator Portal
        </h1>
        <p className="mt-2 text-sm text-onSurface-variant">
          Sign in to access platform controls, revenue metrics, and pioneer moderation.
        </p>
      </div>

      <Card>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-onSurface"
            >
              Admin Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="yam@gmail.com"
              className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-onSurface outline-none focus:border-secondary transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-onSurface"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-onSurface outline-none focus:border-secondary transition"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-error-container p-3 text-sm text-error">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Verifying credentials…" : "Sign In as Admin"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-xs text-onSurface-variant">
        Protected administrator area. All logins and modifications are audited.
      </p>
    </main>
  );
}
