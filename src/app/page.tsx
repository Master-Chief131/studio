'use client';

import { useState, useRef, useEffect } from 'react';
import { Login } from '@/components/auth/Login';
import { Heart, Flower, Dna } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const easterEggMessages = [
    "Curiosa, ¿eh?",
    "El juego aún no ha empezado y ya estás explorando",
    "Esa curiosidad tuya me encanta ❤️"
];

const easterEggIcons = [
    { Icon: Heart, color: "text-primary/70", size: "h-8 w-8" },
    { Icon: Heart, color: "text-green-400/70", size: "h-10 w-10" },
    { Icon: Heart, color: "text-sky-400/70", size: "h-6 w-6" },
    { Icon: Flower, color: "text-pink-400/70", size: "h-8 w-8" }, // Tulipán
    { Icon: Dna, color: "text-green-500/70", size: "h-8 w-8", transform: "rotate-45" }, // Dinosaurio improvisado
];

export default function LoginPage() {
  const { toast } = useToast();
  const [clickCount, setClickCount] = useState(0);
  const [raining, setRaining] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTitleClick = () => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
    }
    
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount >= 5 && !raining) {
        setRaining(true);
        const randomMessage = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];
        toast({
            title: randomMessage,
        });
        setTimeout(() => setRaining(false), 8000); // Detener la lluvia después de 8 segundos
        setClickCount(0);
    }

    timerRef.current = setTimeout(() => {
        setClickCount(0);
    }, 1500); // Reset after 1.5 seconds
  };
  
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background overflow-hidden p-4">
       {raining && Array.from({ length: 25 }).map((_, i) => {
         const item = easterEggIcons[i % easterEggIcons.length];
         const animationDuration = `${Math.random() * 5 + 5}s`; // 5s to 10s
         const animationDelay = `${Math.random() * 5}s`; // 0s to 5s
         const leftPosition = `${Math.random() * 100}vw`;
         const animationName = `fall-and-fade, side-to-side-${i % 2 + 1}`;

         return (
            <item.Icon 
                key={i} 
                className={cn("absolute -top-12 animate-fall-and-fade", item.color, item.size)}
                style={{
                    left: leftPosition,
                    animationName,
                    animationDuration: `${animationDuration}, 3s`,
                    animationDelay,
                    animationTimingFunction: 'linear, ease-in-out',
                    animationIterationCount: 'infinite, infinite',
                    transform: item.transform,
                }}
            />
         )
       })}

      <div className="absolute inset-0 pointer-events-none">
        <Heart 
          className="absolute -left-20 -top-20 h-72 w-72 text-primary/20"
          style={{ animation: 'float-heart 12s ease-in-out infinite' }}
        />
        <Heart 
          className="absolute -right-24 bottom-0 h-96 w-96 text-primary/20"
          style={{ animation: 'float-heart-slow 15s ease-in-out infinite' }}
        />
        <Heart 
          className="absolute top-1/2 left-1/4 h-32 w-32 text-primary/10"
          style={{ animation: 'float-heart 10s ease-in-out infinite reverse' }}
        />
         <Heart 
          className="absolute bottom-1/4 right-1/4 h-24 w-24 text-primary/10"
          style={{ animation: 'float-heart-slow 9s ease-in-out infinite' }}
        />
      </div>
      <div className="z-10 text-center mb-12">
        <h1 
          className="font-headline text-5xl md:text-7xl font-bold text-primary-foreground/90 tracking-wider cursor-pointer"
          onClick={handleTitleClick}
        >
          SudokuLove
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
          Un Sudoku especial para mi persona especial
        </p>
      </div>
      <Login />
    </div>
  );
}
