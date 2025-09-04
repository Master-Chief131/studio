'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Heart, LogOut, Music, Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';

export function Header() {
  const { user, logout } = useAuth();
  const { musicUrl, isPlaying, toggleMute, isMuted } = useMusic();
  
  const handleLogout = () => {
    logout();
  }

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
          {musicUrl && user?.role === 'player' && isPlaying && (
            <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-muted-foreground" />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
