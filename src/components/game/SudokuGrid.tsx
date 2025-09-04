
'use client';

import type { Grid, Cell } from '@/types';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface SudokuGridProps {
  initialGrid: Grid;
  currentGrid: Grid;
  onInputChange: (row: number, col: number, value: number | null) => void;
  helpCell: Cell | null;
  revealedBlocks: boolean[];
  selectedCell: Cell | null;
  setSelectedCell: (cell: Cell | null) => void;
  errors: boolean[][];
}

export function SudokuGrid({ 
    initialGrid, 
    currentGrid, 
    onInputChange, 
    helpCell, 
    revealedBlocks,
    selectedCell,
    setSelectedCell,
    errors
}: SudokuGridProps) {
  const [revealedCell, setRevealedCell] = useState<Cell | null>(null);

  useEffect(() => {
      if (helpCell) {
          setRevealedCell(helpCell);
          const timer = setTimeout(() => setRevealedCell(null), 1500); // Resaltar por 1.5 segundos
          return () => clearTimeout(timer);
      }
  }, [helpCell]);

  const handleCellClick = (row: number, col: number) => {
    const isGiven = initialGrid[row][col] !== null;
    if (!isGiven) {
        setSelectedCell({ row, col });
    }
  }

  const getSubgrid = (row: number, col: number) => {
      return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  }

  return (
    <div className="relative w-full h-full grid grid-cols-9 grid-rows-9 gap-0.5 p-1 sm:p-2 bg-card/0 backdrop-blur-sm rounded-lg shadow-2xl">
      {currentGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isGiven = initialGrid[rowIndex][colIndex] !== null;
          const isError = errors[rowIndex][colIndex];
          const isRevealed = revealedCell && revealedCell.row === rowIndex && revealedCell.col === colIndex;
          const isSubgridRevealed = revealedBlocks[getSubgrid(rowIndex, colIndex)];
          const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={cn(
                "relative flex items-center justify-center aspect-square rounded-sm sm:rounded-md bg-background/80 transition-all duration-1000 cursor-pointer",
                (colIndex + 1) % 3 === 0 && colIndex < 8 && "border-r-2 border-r-primary/50",
                (rowIndex + 1) % 3 === 0 && rowIndex < 8 && "border-b-2 border-b-primary/50",
                isRevealed && "bg-accent/50",
                isSubgridRevealed && "bg-transparent border-transparent",
                isSelected && !isGiven && "bg-accent/30 ring-2 ring-accent z-10"
              )}
            >
              <input
                type="text"
                inputMode="numeric"
                pattern="[1-9]*"
                maxLength={1}
                value={cell || ''}
                onChange={(e) => {
                    const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
                    if (!isNaN(value!) || value === null) {
                        onInputChange(rowIndex, colIndex, value);
                    }
                }}
                readOnly
                className={cn(
                  'w-full h-full text-center bg-transparent text-lg md:text-2xl font-bold font-sans focus:outline-none rounded-sm sm:rounded-md transition-colors duration-1000 pointer-events-none',
                   isGiven ? 'text-primary-foreground/80' : 'text-accent-foreground',
                  isError && 'text-destructive',
                  isRevealed && 'text-green-600',
                  isSubgridRevealed && 'text-white'
                )}
                style={isSubgridRevealed ? { textShadow: '0 0 3px black, 0 0 3px black' } : {}}
                aria-label={`Celda F${rowIndex + 1}C${colIndex + 1}`}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
