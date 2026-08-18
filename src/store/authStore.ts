'use client';

import { create } from 'zustand';
import type { UserProfile } from '@/types';

interface AuthState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
