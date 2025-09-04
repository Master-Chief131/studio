
'use client';

import { useState, useEffect } from 'react';
import type { Puzzle, Grid, PhotoData, Cell, GameState } from '@/types';
import { PhotoReveal } from './PhotoReveal';
import { SudokuGrid } from './SudokuGrid';
import { useRouter } from 'next/navigation';
import { CompletionOverlay } from './CompletionOverlay';
import { getFromStorage, saveToStorage } from '@/lib/storage';
import { NumberPad } from './NumberPad';

interface SudokuBoardProps {
  puzzleData: Puzzle;
  currentGrid: Grid;
  setCurrentGrid: (grid: Grid) => void;
  photoData: PhotoData | null;
  helpCell: Cell | null;
  gameState: GameState;
  onError: () => void;
  selectedCell: Cell | null;
  setSelectedCell: (cell: Cell | null) => void;
}

export function SudokuBoard({ 
    puzzleData, 
    photoData, 
    currentGrid, 
    setCurrentGrid, 
    helpCell, 
    gameState, 
    onError,
    selectedCell,
    setSelectedCell 
}: SudokuBoardProps) {
  const [revealedBlocks, setRevealedBlocks] = useState<boolean[]>(Array(9).fill(false));
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  const handleInputChange = (row: number, col: number, value: number | null) => {
    const newGrid = currentGrid.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? value : cell))
    );
    setCurrentGrid(newGrid);
  };

  const handleNumberPadClick = (number: number) => {
    if (selectedCell) {
      handleInputChange(selectedCell.row, selectedCell.col, number);
    }
  }

  const handleEraseClick = () => {
      if (selectedCell) {
        handleInputChange(selectedCell.row, selectedCell.col, null);
      }
  }

  const checkSubgrid = (subgridIndex: number): boolean => {
    const startRow = Math.floor(subgridIndex / 3) * 3;
    const startCol = (subgridIndex % 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentGrid[startRow + i][startCol + j] !== puzzleData.solution[startRow + i][startCol + j]) {
          return false;
        }
      }
    }
    return true;
  };

  useEffect(() => {
    if (isComplete || gameState.isGameOver) return;

    const newRevealedBlocks = Array.from({ length: 9 }).map((_, index) => checkSubgrid(index));
    setRevealedBlocks(newRevealedBlocks);

    const allCorrect = newRevealedBlocks.every(Boolean);
    if(allCorrect) {
        setTimeout(() => {
            const completedLevels = getFromStorage<number[]>('sudoku-completed-levels') || [];
            if (!completedLevels.includes(puzzleData.level)) {
                saveToStorage('sudoku-completed-levels', [...completedLevels, puzzleData.level]);
            }
            setIsComplete(true);
        }, 1200);
    }

  }, [currentGrid, puzzleData.solution, isComplete, puzzleData.level, gameState.isGameOver]);
  
  return (
    <div className="flex flex-col items-center">
        <div className="relative w-full max-w-xl aspect-square">
        <PhotoReveal imageUrl={photoData?.imageUrl || null} revealedBlocks={revealedBlocks} isComplete={isComplete}/>
        {!isComplete && !gameState.isGameOver && (
            <SudokuGrid 
            initialGrid={puzzleData.puzzle} 
            currentGrid={currentGrid}
            solution={puzzleData.solution}
            onInputChange={handleInputChange}
            helpCell={helpCell}
            onError={onError}
            revealedBlocks={revealedBlocks}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
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
        {!isComplete && !gameState.isGameOver && (
            <NumberPad 
                onNumberClick={handleNumberPadClick}
                onEraseClick={handleEraseClick}
            />
        )}
    </div>
  );
}
