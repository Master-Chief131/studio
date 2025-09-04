'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFromStorage, removeFromStorage } from '@/lib/storage';
import type { User } from '@/types';
import { useMusic } from './useMusic';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { stopMusic } = useMusic();

  useEffect(() => {
    const storedUser = getFromStorage<User>('sudoku-user');
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    removeFromStorage('sudoku-user');
    setUser(null);
    stopMusic();
    router.push('/');
  };

  return { user, loading, logout };
}
