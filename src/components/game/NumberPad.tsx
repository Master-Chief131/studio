'use client';

import { Button } from '@/components/ui/button';
import { Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberPadProps {
  onNumberClick: (number: number) => void;
  onEraseClick: () => void;
}

export function NumberPad({ onNumberClick, onEraseClick }: NumberPadProps) {
  return (
    <div className="flex w-full max-w-xl justify-center items-center gap-1 sm:gap-2 my-4">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => (
        <Button
          key={number}
          variant={'outline'}
          size="icon"
          className="h-9 w-9 md:h-12 md:w-12 text-lg font-bold"
          onClick={() => onNumberClick(number)}
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
