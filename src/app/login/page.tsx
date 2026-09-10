import Link from "next/link";
import { Button } from "@/components/Button";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <p className="text-xl font-extrabold text-onSurface">
          M<span className="text-secondary">ụ</span>ta
        </p>
        <h1 className="mt-4 text-headline-lg-mobile">Welcome back</h1>
        <p className="mt-2 text-sm text-onSurface-variant">
          Log in to see your Pioneer Hub, vote on features, and check your
          referrals.
        </p>
      </div>

      {/* Not wired to Supabase yet — that happens in Stage 3 */}
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-onSurface">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-onSurface outline-none focus:border-secondary"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-onSurface">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm text-secondary">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-onSurface outline-none focus:border-secondary"
          />
        </div>

        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-onSurface-variant">
        Not a Pioneer yet?{" "}
        <Link href="/join" className="font-semibold text-secondary">
          Become one
        </Link>
      </p>
    </main>
  );
}
