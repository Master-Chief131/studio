import { Login } from '@/components/auth/Login';
import { Heart } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background overflow-hidden p-4">
       <div className="absolute top-0 left-0 w-full h-full">
        <Heart className="absolute -left-16 -top-16 h-64 w-64 text-primary/10" />
        <Heart className="absolute -right-20 bottom-10 h-80 w-80 text-primary/10" />
      </div>
      <div className="z-10 text-center mb-8">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary-foreground/90">SudokuLove</h1>
        <p className="mt-2 text-lg text-muted-foreground">A special puzzle for my special someone.</p>
      </div>
      <Login />
    </div>
  );
}
