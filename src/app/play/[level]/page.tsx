'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getPuzzle, transformPuzzle } from '@/lib/sudoku';
import { getFromStorage } from '@/lib/storage';
import { SudokuBoard } from '@/components/game/SudokuBoard';
import { Header } from '@/components/shared/Header';
import type { Puzzle, Photos, PhotoData } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function PlayPage({ params }: { params: { level: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [puzzleData, setPuzzleData] = useState<Puzzle | null>(null);
  const [photoData, setPhotoData] = useState<PhotoData | null>(null);
  const [loading, setLoading] = useState(true);

  // useMemo will ensure the puzzle is generated only once per page load
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
    
    const level = parseInt(params.level, 10);

    if (!randomPuzzle) {
        router.push('/dashboard');
        return;
    }

    const photos = getFromStorage<Photos>('sudoku-photos');
    
    setPuzzleData(randomPuzzle);
    if (photos && photos[level]) {
        setPhotoData(photos[level]);
    }
    
    setLoading(false);

  }, [params.level, router, user, authLoading, randomPuzzle]);

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

  if (!puzzleData) {
    // This case is handled by the loading state and redirect, but as a fallback:
    return <div className='text-center p-8'>Puzzle not found.</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary-foreground/90 my-4">
          Level {params.level}
        </h2>
        <SudokuBoard puzzleData={puzzleData} photoData={photoData} />
      </main>
    </div>
  );
}
