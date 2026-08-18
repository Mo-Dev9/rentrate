'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  defaultValue?: string;
  compact?: boolean;
}

export function SearchBar({ defaultValue = '', compact = false }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${compact ? '' : 'w-full max-w-xl'}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث عن عنوان الشقة أو المبنى..."
        className={`flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-secondary)] outline-none focus:border-[var(--color-primary)] ${compact ? 'text-xs py-2' : ''}`}
      />
      <button
        type="submit"
        className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors"
      >
        بحث
      </button>
    </form>
  );
}
