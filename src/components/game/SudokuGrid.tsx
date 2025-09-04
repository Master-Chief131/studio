'use client';

import type { Grid } from '@/types';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface SudokuGridProps {
  initialGrid: Grid;
  currentGrid: Grid;
  solution: Grid;
  onInputChange: (row: number, col: number, value: number | null) => void;
}

export function SudokuGrid({ initialGrid, currentGrid, solution, onInputChange }: SudokuGridProps) {
  const [errors, setErrors] = useState<boolean[][]>(Array(9).fill(null).map(() => Array(9).fill(false)));

  const handleCellChange = (row: number, col: number, value: string) => {
    const num = parseInt(value, 10);
    if (value === '' || (num >= 1 && num <= 9)) {
      const newErrors = errors.map(r => [...r]);
      const enteredValue = value === '' ? null : num;
      onInputChange(row, col, enteredValue);
      
      if (enteredValue !== null && enteredValue !== solution[row][col]) {
        newErrors[row][col] = true;
      } else {
        newErrors[row][col] = false;
      }
      setErrors(newErrors);
    }
  };

  return (
    <div className="relative w-full h-full grid grid-cols-9 grid-rows-9 gap-0.5 p-1 sm:p-2 bg-card/80 backdrop-blur-sm rounded-lg shadow-2xl">
      {currentGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isGiven = initialGrid[rowIndex][colIndex] !== null;
          const isError = errors[rowIndex][colIndex];
          const isCorrect = !isError && cell !== null && cell === solution[rowIndex][colIndex] && !isGiven;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "relative flex items-center justify-center aspect-square rounded-sm sm:rounded-md bg-background/80",
                (colIndex + 1) % 3 === 0 && colIndex < 8 && "border-r-2 border-r-primary/50",
                (rowIndex + 1) % 3 === 0 && rowIndex < 8 && "border-b-2 border-b-primary/50",
              )}
            >
              <input
                type="text"
                inputMode="numeric"
                pattern="[1-9]*"
                maxLength={1}
                value={cell || ''}
                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                readOnly={isGiven}
                className={cn(
                  'w-full h-full text-center bg-transparent text-lg md:text-2xl font-bold font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:z-10 rounded-sm sm:rounded-md',
                  isGiven ? 'text-primary-foreground/80' : 'text-accent-foreground',
                  isError && 'text-destructive',
                  isCorrect && 'text-green-600',
                )}
                aria-label={`Cell R${rowIndex + 1}C${colIndex + 1}`}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
