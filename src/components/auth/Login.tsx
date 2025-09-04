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
import { getFromStorage, saveToStorage } from '@/lib/storage';
import { LogIn } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';

const ADMIN_USER = 'Admin';
const PLAYER_USER = 'Abby';

export function Login() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { playMusic } = useMusic();

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
            title: `¡Bienvenid@, ${user.username}!`,
            description: 'Has iniciado sesión correctamente.',
          });
          if (user.role === 'player') {
            const music = getFromStorage<string>('sudoku-background-music');
            if(music) {
                playMusic(music);
            }
          }
          router.push('/dashboard');
        } else {
          toast({
            variant: 'destructive',
            title: 'Inicio de Sesión Fallido',
            description: 'Nombre de usuario inválido. Por favor, inténtalo de nuevo.',
          });
          setLoading(false);
        }
    }, 500);
  };

  return (
    <Card className="w-full max-w-sm z-10 shadow-lg bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Ingresa tu Nombre</CardTitle>
        <CardDescription>
          Usa '{PLAYER_USER}' para jugar o '{ADMIN_USER}' para configurar el juego.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre</Label>
            <Input
              id="username"
              type="text"
              placeholder="Ej., Player"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="bg-background/80"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? 'Iniciando sesión...' : 'Entrar a SudokuLove'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
