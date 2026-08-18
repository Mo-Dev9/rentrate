'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/layout/SearchBar';
import { BuildingCard } from '@/components/building/BuildingCard';
import { useBuildings } from '@/hooks/useBuildings';
import type { Building } from '@/types';

export default function SearchPageInner() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const { searchBuildings, loading } = useBuildings();
  const [results, setResults] = useState<Building[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (q) {
      searchBuildings(q).then((r) => {
        setResults(r);
        setSearched(true);
      });
    }
  }, [q, searchBuildings]);

  return (
    <>
      <div className="mb-6">
        <SearchBar defaultValue={q} compact />
      </div>

      {loading ? (
        <div className="text-center py-20 text-[var(--color-text-secondary)]">جاري البحث...</div>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="font-semibold mb-2">لا توجد نتائج</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            جرّب البحث باسم منطقة أو شارع مختلف
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((building) => (
            <BuildingCard key={building.id} building={building} />
          ))}
        </div>
      )}
    </>
  );
}
