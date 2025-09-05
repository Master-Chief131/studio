'use client';

import { Button } from '@/components/ui/button';
import { Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { Grid } from '@/types';

interface NumberPadProps {
  onNumberClick: (number: number) => void;
  onEraseClick: () => void;
  currentGrid: Grid;
}

export function NumberPad({ onNumberClick, onEraseClick, currentGrid }: NumberPadProps) {
  // Contar cuántas veces aparece cada número en el tablero
  const counts = Array(10).fill(0); // 0 no se usa
  currentGrid.forEach(row => row.forEach(cell => {
    if (cell && cell >= 1 && cell <= 9) counts[cell]++;
  }));

  return (
    <div className="flex w-full max-w-xl justify-center items-center gap-1 sm:gap-2 my-4">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => (
        <Button
          key={number}
          variant={'outline'}
          size="icon"
          className={cn(
            "h-9 w-9 md:h-12 md:w-12 text-lg font-bold",
            counts[number] === 9 && "invisible"
          )}
          onClick={() => onNumberClick(number)}
          disabled={counts[number] === 9}
        >
          {number}
        </Button>
      ))}
      <Button
        variant="secondary"
        size="icon"
        className="h-9 w-9 md:h-12 md:w-12"
        onClick={() => onEraseClick()}
      >
        <Eraser className="h-5 w-5" />
      </Button>
    </div>
  );
}
