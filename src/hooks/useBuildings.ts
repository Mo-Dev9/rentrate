import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import type { Building } from '@/types';

export function useBuildings() {
  const [loading, setLoading] = useState(false);

  const searchBuildings = useCallback(async (searchQuery: string): Promise<Building[]> => {
    setLoading(true);
    try {
      const q = query(
        collection(getDb(), 'buildings'),
        where('area', '==', searchQuery)
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Building));

      if (results.length === 0) {
        const q2 = query(
          collection(getDb(), 'buildings'),
          where('city', '==', searchQuery)
        );
        const snap2 = await getDocs(q2);
        return snap2.docs.map((d) => ({ id: d.id, ...d.data() } as Building));
      }

      return results;
    } catch (err) {
      console.error('Search failed:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getBuilding = useCallback(async (id: string): Promise<Building | null> => {
    try {
      const docSnap = await getDoc(doc(getDb(), 'buildings', id));
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Building) : null;
    } catch (err) {
      console.error('Get building failed:', err);
      return null;
    }
  }, []);

  return { searchBuildings, getBuilding, loading };
}
