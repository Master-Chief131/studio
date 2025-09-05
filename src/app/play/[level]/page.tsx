

'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getPuzzle, transformPuzzle } from '@/lib/sudoku';
import { getFromStorage, saveToStorage } from '@/lib/storage';
import { SudokuBoard } from '@/components/game/SudokuBoard';
import { Header } from '@/components/shared/Header';
import type { Puzzle, Photos, PhotoData, Cell, HelpQuestion, GameState, Grid } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LifeBuoy, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HelpQuestionDialog } from '@/components/game/HelpQuestionDialog';
import { CompletionOverlay } from '@/components/game/CompletionOverlay';
import { Dialog, DialogContent, DialogDescription, DialogTitle as VisuallyHiddenTitle, VisuallyHidden } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export default function PlayPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [puzzleData, setPuzzleData] = useState<Puzzle | null>(null);
  const [currentGrid, setCurrentGrid] = useState<Grid | null>(null);
  const [photoData, setPhotoData] = useState<PhotoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [helpCell, setHelpCell] = useState<Cell | null>(null);
  const [isComplete, setIsComplete] = useState(false);


  // Game State
  const [gameState, setGameState] = useState<GameState>({ lives: 3, isGameOver: false });
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  // Help Questions State
  const [questions, setQuestions] = useState<HelpQuestion[]>([]);
  const [askedQuestionIds, setAskedQuestionIds] = useState<string[]>([]);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<HelpQuestion | null>(null);

  const levelStr = Array.isArray(params.level) ? params.level[0] : params.level;
  const level = useMemo(() => parseInt(levelStr, 10), [levelStr]);
  const pageTitle = useMemo(() => `Nivel ${level}`, [level]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user) {
      router.push('/');
      return;
    }
    
    if (isNaN(level)) {
        router.push('/dashboard');
        return;
    }
    
    const basePuzzle = getPuzzle(level);
    const randomPuzzle = basePuzzle ? transformPuzzle(basePuzzle) : null;

    if (!randomPuzzle) {
        router.push('/dashboard');
        return;
    }


    const photos = getFromStorage<Photos>('sudoku-photos');
    setPuzzleData(randomPuzzle);
    setCurrentGrid(randomPuzzle.puzzle);

    // Fetch help questions from the server
    fetch('/api/admin/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(Array.isArray(data) ? data : []);
      })
      .catch(() => setQuestions([]));

    if (photos && photos[randomPuzzle.level]) {
        setPhotoData(photos[randomPuzzle.level]);
    }
    setLoading(false);

  }, [level, router, user, authLoading]);

  const triggerHelp = useCallback(() => {
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
        toast({ title: "No quedan más celdas vacías para rellenar.", variant: "destructive" });
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
        title: "¡La ayuda ha llegado!",
        description: `La celda en la fila ${row + 1}, columna ${col + 1} ha sido rellenada.`,
    });
  }, [currentGrid, puzzleData, toast]);

  const handleHelpClick = () => {
    const availableQuestions = questions.filter(q => !askedQuestionIds.includes(q.id));
    if (availableQuestions.length === 0) {
      toast({
        title: "¡Te quedaste sin ayudas!",
        description: "Has usado todas las preguntas disponibles.",
        variant: "destructive",
      });
      return;
    }

    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setShowQuestionDialog(true);
  };

  const handleQuestionAnswered = (isCorrect: boolean) => {
    setShowQuestionDialog(false);
    if (currentQuestion) {
      setAskedQuestionIds(prev => [...prev, currentQuestion.id]);
    }

    if (isCorrect) {
      toast({
        title: "¡Correcto!",
        description: "Aquí tienes tu ayuda.",
        className: "bg-green-500 text-white",
      });
      triggerHelp();
    } else {
        toast({
            title: "Respuesta incorrecta",
            description: "¡No te preocupes, no pierdes vidas aquí! Inténtalo la próxima vez.",
            variant: "destructive",
        });
    }
    setCurrentQuestion(null);
  }

  const handleError = () => {
    if(gameState.isGameOver) return;
    
    const newLives = gameState.lives - 1;
    setGameState(prev => ({ ...prev, lives: newLives }));

    if (newLives > 0) {
        toast({
            title: "¡Ups! Número incorrecto",
            description: `Te quedan ${newLives} ${newLives === 1 ? 'vida' : 'vidas'}.`,
            variant: "destructive",
        });
    } else {
        toast({
            title: "¡Oh no!",
            description: "Te quedaste sin vidas.",
            variant: "destructive",
        });
        setGameState(prev => ({ ...prev, isGameOver: true, lives: 0 }));
    }
  }


  if (authLoading || loading || isNaN(level)) {
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
    return <div className='text-center p-8'>Puzzle no encontrado.</div>;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary-foreground/90 my-4">
            {pageTitle}
          </h2>
          <div className="flex w-full max-w-xl justify-between items-center mb-4 px-1">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Regresar
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({length: gameState.lives}).map((_, i) => (
                    <Heart key={`life-${i}`} className="h-6 w-6 text-red-500 fill-current" />
                ))}
                {Array.from({length: 3 - gameState.lives}).map((_, i) => (
                    <Heart key={`lost-${i}`} className="h-6 w-6 text-muted-foreground/50" />
                ))}
              </div>
              <Button variant="secondary" onClick={handleHelpClick} disabled={gameState.isGameOver}>
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
            gameState={gameState}
            onError={handleError}
            onComplete={() => setIsComplete(true)}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
          />
        </main>
      </div>

      {currentQuestion && (
        <HelpQuestionDialog
          isOpen={showQuestionDialog}
          onClose={() => setShowQuestionDialog(false)}
          question={currentQuestion}
          onAnswer={handleQuestionAnswered}
        />
      )}
      
      <AlertDialog open={gameState.isGameOver}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle className='font-headline text-2xl'>Fin del Juego</AlertDialogTitle>
            <AlertDialogDescription>
                Te has quedado sin vidas. ¡Pero no te preocupes, el amor siempre da otra oportunidad!
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push('/dashboard')}>Volver a Intentarlo</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {isComplete && photoData && (
         <Dialog open={isComplete} onOpenChange={(isOpen) => { if(!isOpen) { router.push('/dashboard')}}}>
            <DialogContent className="p-0 border-0 max-w-2xl bg-transparent" aria-labelledby="completion-title" aria-describedby="completion-desc">
                <VisuallyHidden>
                  <VisuallyHiddenTitle id="completion-title">¡Nivel Completado!</VisuallyHiddenTitle>
                  <DialogDescription id="completion-desc">{photoData.message}</DialogDescription>
                </VisuallyHidden>
                <div className="relative aspect-square w-full">
                    <CompletionOverlay
                        imageUrl={photoData.imageUrl}
                        message={photoData.message}
                        onBack={() => router.push('/dashboard')}
                    />
                </div>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
