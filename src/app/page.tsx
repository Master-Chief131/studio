import { Login } from '@/components/auth/Login';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background overflow-hidden p-4">
      <div className="absolute inset-0 pointer-events-none">
        <Heart 
          className="absolute -left-20 -top-20 h-72 w-72 text-primary/20"
          style={{ animation: 'float-heart 12s ease-in-out infinite' }}
        />
        <Heart 
          className="absolute -right-24 bottom-0 h-96 w-96 text-primary/20"
          style={{ animation: 'float-heart-slow 15s ease-in-out infinite' }}
        />
        <Heart 
          className="absolute top-1/2 left-1/4 h-32 w-32 text-primary/10"
          style={{ animation: 'float-heart 10s ease-in-out infinite reverse' }}
        />
         <Heart 
          className="absolute bottom-1/4 right-1/4 h-24 w-24 text-primary/10"
          style={{ animation: 'float-heart-slow 9s ease-in-out infinite' }}
        />
      </div>
      <div className="z-10 text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary-foreground/90 tracking-wider">
          SudokuLove
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
          Un Sudoku especial para mi persona especial, con mucho amor para Abigahyl
        </p>
      </div>
      <Login />
    </div>
  );
}
