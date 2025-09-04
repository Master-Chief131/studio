
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getPuzzle, transformPuzzle } from '@/lib/sudoku';
import { getFromStorage } from '@/lib/storage';
import { SudokuBoard } from '@/components/game/SudokuBoard';
import { Header } from '@/components/shared/Header';
import type { Puzzle, Photos, PhotoData, Grid, Cell } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LifeBuoy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PlayPage({ params }: { params: { level: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [puzzleData, setPuzzleData] = useState<Puzzle | null>(null);
  const [currentGrid, setCurrentGrid] = useState<Grid | null>(null);
  const [photoData, setPhotoData] = useState<PhotoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [helpCell, setHelpCell] = useState<Cell | null>(null);

  const randomPuzzle = useMemo(() => {
    const level = parseInt(params.level, 10);
    if (isNaN(level)) {
        return null;
    }
    const basePuzzle = getPuzzle(level);
    return basePuzzle ? transformPuzzle(basePuzzle) : null;
  }, [params.level]);


  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user) {
      router.push('/');
      return;
    }
    
    if (!randomPuzzle) {
        router.push('/dashboard');
        return;
    }

    const photos = getFromStorage<Photos>('sudoku-photos');
    
    setPuzzleData(randomPuzzle);
    setCurrentGrid(randomPuzzle.puzzle);
    if (photos && photos[randomPuzzle.level]) {
        setPhotoData(photos[randomPuzzle.level]);
    }
    
    setLoading(false);

  }, [params.level, router, user, authLoading, randomPuzzle]);

  const handleHelp = useCallback(() => {
    if (!currentGrid || !puzzleData) return;

    const emptyCells: Cell[] = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (currentGrid[r][c] === null) {
                emptyCells.push({ row: r, col: c });
            }
        }
    }

    if (emptyCells.length === 0) {
        toast({ title: "No more empty cells to fill!", variant: "destructive" });
        return;
    }

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const { row, col } = randomCell;
    const solutionValue = puzzleData.solution[row][col];

    const newGrid = currentGrid.map(r => [...r]);
    newGrid[row][col] = solutionValue;
    setCurrentGrid(newGrid);
    setHelpCell({ row, col });

    toast({
        title: "Help has arrived!",
        description: `Cell at row ${row + 1}, col ${col + 1} has been filled.`,
    });
  }, [currentGrid, puzzleData, toast]);

  if (authLoading || loading) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="w-80 h-80 md:w-96 md:h-96" />
                    <Skeleton className="h-10 w-48" />
                </div>
            </div>
        </div>
    );
  }

  if (!puzzleData || !currentGrid) {
    return <div className='text-center p-8'>Puzzle not found.</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary-foreground/90 my-4">
          Level {params.level}
        </h2>
        <div className="flex w-full max-w-xl justify-between items-center mb-4 px-1">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Regresar
            </Button>
            <Button variant="secondary" onClick={handleHelp}>
                <LifeBuoy className="mr-2 h-4 w-4" />
                Ayuda
            </Button>
        </div>
        <SudokuBoard 
          key={puzzleData.level}
          puzzleData={puzzleData}
          currentGrid={currentGrid}
          setCurrentGrid={setCurrentGrid}
          photoData={photoData}
          helpCell={helpCell}
        />
      </main>
    </div>
  );
}
