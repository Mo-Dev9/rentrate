'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function Loading() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-[var(--color-text-secondary)]">جاري التحميل...</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
