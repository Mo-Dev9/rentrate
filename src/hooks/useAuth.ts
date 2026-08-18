import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInAnonymously,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getDb } from '@/lib/firebase';
import { generateAnonymousName } from '@/lib/utils';
import type { UserProfile } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const userDoc = await getDoc(doc(getDb(), 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            isAnonymous: firebaseUser.isAnonymous,
            displayName: generateAnonymousName(firebaseUser.uid),
            reviewCount: 0,
            createdAt: Date.now(),
          };
          await setDoc(doc(getDb(), 'users', firebaseUser.uid), newProfile);
          setProfile(newProfile);
        }
      } else {
        try {
          const cred = await signInAnonymously(getFirebaseAuth());
          setUser(cred.user);
        } catch (err) {
          console.error('Anonymous auth failed:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, profile, loading };
}
