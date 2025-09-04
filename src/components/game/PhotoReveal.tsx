'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface PhotoRevealProps {
  imageUrl: string | null;
  revealedBlocks: boolean[];
  isComplete: boolean;
}

export function PhotoReveal({ imageUrl, revealedBlocks, isComplete }: PhotoRevealProps) {
  if (!imageUrl) {
    return (
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1 bg-muted rounded-lg shadow-inner">
         {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="bg-background flex items-center justify-center rounded-md">
            <Heart className="w-8 h-8 text-primary/20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 rounded-lg overflow-hidden shadow-lg">
      <Image src={imageUrl} alt="Surprise photo" width={500} height={500} objectFit="cover" />
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {revealedBlocks.map((isRevealed, index) => (
          <div
            key={index}
            className={cn(
              'transition-opacity duration-1000',
              (isRevealed || isComplete) ? 'opacity-0' : 'opacity-100',
              'bg-primary'
            )}
            style={{
                borderRight: (index + 1) % 3 !== 0 ? '2px solid hsl(var(--background))' : 'none',
                borderBottom: index < 6 ? '2px solid hsl(var(--background))' : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
}
