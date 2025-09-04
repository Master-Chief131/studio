'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFromStorage, removeFromStorage } from '@/lib/storage';
import type { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    router.push('/');
  };

  return { user, loading, logout };
}
