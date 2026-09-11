import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-onSurface-variant md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-extrabold text-onSurface">
            M<span className="text-secondary">ụ</span>ta
          </p>
          <p className="mt-1">AI study app, by Excel In School</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:gap-8">
          <Link href="/#why-muta">Why Mụta</Link>
          <Link href="/join">Become a Pioneer</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/privacy-policy">Privacy policy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <div>
          <a href="https://www.excelinschool.com" className="hover:underline">
            excelinschool.com
          </a>
        </div>
      </div>
    </footer>
  );
}
