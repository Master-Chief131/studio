'use client';

import { useState, useEffect } from 'react';
import type { Puzzle, Grid, PhotoData } from '@/types';
import { PhotoReveal } from './PhotoReveal';
import { SudokuGrid } from './SudokuGrid';
import { useRouter } from 'next/navigation';
import { CompletionOverlay } from './CompletionOverlay';

interface SudokuBoardProps {
  puzzleData: Puzzle;
  photoData: PhotoData | null;
}

export function SudokuBoard({ puzzleData, photoData }: SudokuBoardProps) {
  const [grid, setGrid] = useState<Grid>(puzzleData.puzzle);
  const [revealedBlocks, setRevealedBlocks] = useState<boolean[]>(Array(9).fill(false));
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  const checkSubgrid = (subgridIndex: number): boolean => {
    const startRow = Math.floor(subgridIndex / 3) * 3;
    const startCol = (subgridIndex % 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] !== puzzleData.solution[startRow + i][startCol + j]) {
          return false;
        }
      }
    }
    return true;
  };

  useEffect(() => {
    if (isComplete) return;

    const newRevealedBlocks = revealedBlocks.map((_, index) => checkSubgrid(index));
    setRevealedBlocks(newRevealedBlocks);

    const allCorrect = newRevealedBlocks.every(Boolean);
    if(allCorrect) {
        // A small delay to allow the last block to reveal before showing the completion overlay
        setTimeout(() => setIsComplete(true), 1200);
    }

  }, [grid, puzzleData.solution, isComplete]); // removed revealedBlocks dependency

  const handleInputChange = (row: number, col: number, value: number | null) => {
    const newGrid = grid.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? value : cell))
    );
    setGrid(newGrid);
  };
  
  return (
    <div className="relative w-full max-w-xl aspect-square">
      <PhotoReveal imageUrl={photoData?.imageUrl || null} revealedBlocks={revealedBlocks} isComplete={isComplete}/>
      {!isComplete && (
        <SudokuGrid 
          initialGrid={puzzleData.puzzle} 
          currentGrid={grid}
          solution={puzzleData.solution}
          onInputChange={handleInputChange} 
        />
      )}
      {isComplete && photoData && (
        <CompletionOverlay
          imageUrl={photoData.imageUrl}
          message={photoData.message}
          onBack={() => router.push('/dashboard')}
        />
      )}
    </div>
  );
}
