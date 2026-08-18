'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-[var(--color-primary)]">
          RentRate
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/search" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
            بحث
          </Link>
          <Link href="/profile" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
            حسابي
          </Link>
        </nav>
      </div>
    </header>
  );
}
