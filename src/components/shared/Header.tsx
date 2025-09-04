'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getFromStorage } from '@/lib/storage';
import { Heart, LogOut } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const [music, setMusic] = useState<string | null>(null);
  
  useEffect(() => {
    if (user?.role === 'player') {
        const storedMusic = getFromStorage('sudoku-background-music');
        if (storedMusic) {
            setMusic(storedMusic);
        }
    }
  }, [user]);

  return (
    <header className="w-full bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-xl font-bold text-primary-foreground/90">
            SudokuLove
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Welcome, <span className="font-semibold">{user.username}</span>
            </span>
          )}
          {music && user?.role === 'player' && (
            <audio src={music} controls autoPlay loop className="h-8 hidden sm:block" />
          )}
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
