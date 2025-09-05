
'use client';

import { useState, useEffect } from 'react';
import type { Puzzle, Grid, PhotoData, Cell, GameState } from '@/types';
import { PhotoReveal } from './PhotoReveal';
import { SudokuGrid } from './SudokuGrid';
import { useRef } from 'react';
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
  onComplete: () => void;
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
    onComplete,
    selectedCell,
    setSelectedCell 
}: SudokuBoardProps) {
  const [revealedBlocks, setRevealedBlocks] = useState<boolean[]>(Array(9).fill(false));
  const [errors, setErrors] = useState<boolean[][]>(Array(9).fill(null).map(() => Array(9).fill(false)));
  const [correctCell, setCorrectCell] = useState<Cell | null>(null);
  const correctCellTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (row: number, col: number, value: number | null) => {
    if (gameState.isGameOver) return;
    
    // No permitir sobreescribir un número correcto
    if (currentGrid[row][col] === puzzleData.solution[row][col]) return;

    const newGrid = currentGrid.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? value : cell))
    );
    setCurrentGrid(newGrid);

    const newErrors = errors.map(r => [...r]);
    if (value !== null && value !== puzzleData.solution[row][col]) {
      onError(); 
      newErrors[row][col] = true;
    } else {
      newErrors[row][col] = false;
      if (value !== null && value === puzzleData.solution[row][col]) {
        setCorrectCell({ row, col });
        if (correctCellTimeout.current) clearTimeout(correctCellTimeout.current);
        correctCellTimeout.current = setTimeout(() => setCorrectCell(null), 1200);
      }
    }
    setErrors(newErrors);
  };

  const handleNumberPadClick = (number: number) => {
    if (selectedCell) {
      if (puzzleData.puzzle[selectedCell.row][selectedCell.col] === null) {
         handleInputChange(selectedCell.row, selectedCell.col, number);
      }
    }
  }

  const handleEraseClick = () => {
      if (selectedCell) {
        if(puzzleData.puzzle[selectedCell.row][selectedCell.col] === null) {
            handleInputChange(selectedCell.row, selectedCell.col, null);
        }
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
    if (gameState.isGameOver) return;

    const newRevealedBlocks = Array.from({ length: 9 }).map((_, index) => checkSubgrid(index));
    setRevealedBlocks(newRevealedBlocks);

    const allCorrect = newRevealedBlocks.every(Boolean);
    if(allCorrect) {
        setTimeout(() => {
            const completedLevels = getFromStorage<number[]>('sudoku-completed-levels') || [];
            if (!completedLevels.includes(puzzleData.level)) {
                saveToStorage('sudoku-completed-levels', [...completedLevels, puzzleData.level]);
            }
            onComplete();
        }, 1200);
    }

  }, [currentGrid, puzzleData.solution, onComplete, puzzleData.level, gameState.isGameOver]);
  
  return (
    <div className="flex flex-col items-center">
        <div className="relative w-full max-w-xl aspect-square">
            <PhotoReveal imageUrl={photoData?.imageUrl || null} revealedBlocks={revealedBlocks} isComplete={false}/>
            {!gameState.isGameOver && (
                <SudokuGrid 
                    initialGrid={puzzleData.puzzle} 
                    currentGrid={currentGrid}
                    onInputChange={handleInputChange}
                    helpCell={helpCell}
                    revealedBlocks={revealedBlocks}
                    selectedCell={selectedCell}
                    setSelectedCell={setSelectedCell}
                    errors={errors}
                    correctCell={correctCell}
                />
            )}
        </div>
        {!gameState.isGameOver && (
            <NumberPad 
                onNumberClick={handleNumberPadClick}
                onEraseClick={handleEraseClick}
                currentGrid={currentGrid}
            />
        )}
    </div>
  );
}
