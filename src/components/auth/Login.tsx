'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/types';
import { saveToStorage } from '@/lib/storage';
import { LogIn } from 'lucide-react';

const ADMIN_USER = 'Admin';
const PLAYER_USER = 'Player';

export function Login() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedUsername = username.trim();

    let user: User | null = null;
    if (formattedUsername.toLowerCase() === ADMIN_USER.toLowerCase()) {
      user = { username: ADMIN_USER, role: 'admin' };
    } else if (formattedUsername.toLowerCase() === PLAYER_USER.toLowerCase()) {
      user = { username: PLAYER_USER, role: 'player' };
    }

    setTimeout(() => {
        if (user) {
          saveToStorage('sudoku-user', user);
          toast({
            title: `Welcome, ${user.username}!`,
            description: 'You have successfully logged in.',
          });
          router.push('/dashboard');
        } else {
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Invalid username. Please try again.',
          });
          setLoading(false);
        }
    }, 500);
  };

  return (
    <Card className="w-full max-w-sm z-10 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Enter Your Name</CardTitle>
        <CardDescription>
          Use '{PLAYER_USER}' to play or '{ADMIN_USER}' to manage photos.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Name</Label>
            <Input
              id="username"
              type="text"
              placeholder="E.g., Player"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? 'Logging in...' : 'Enter SudokuLove'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
