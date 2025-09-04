'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PhotoUploader } from '@/components/uploader/PhotoUploader';
import { Header } from '@/components/shared/Header';
import { puzzles } from '@/lib/sudoku';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, GalleryVerticalEnd, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    )
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        {user.role === 'admin' ? <AdminDashboard /> : <PlayerDashboard />}
      </main>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-headline text-4xl font-bold text-primary-foreground/90">Game Manager</h2>
        <p className="text-muted-foreground mt-2">Manage photos, messages, and background music.</p>
      </div>
      <PhotoUploader />
    </div>
  );
}

function PlayerDashboard() {

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-headline text-4xl font-bold text-primary-foreground/90">Choose a Puzzle</h2>
        <p className="text-muted-foreground mt-2">Complete a puzzle to reveal a piece of a special photo!</p>
      </div>
      <div className="flex justify-center items-center gap-4 mb-6">
        <Link href="/gallery" passHref>
            <Button variant="outline">
                <GalleryVerticalEnd className="mr-2 h-4 w-4" />
                View Your Gallery
            </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {puzzles.map((level) => (
          <Card key={level.level} className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className='font-headline'>Level {level.level}</span>
                <div className="flex">
                    {Array.from({length: level.level}).map((_,i) => <Heart key={i} className="h-4 w-4 text-primary fill-current" />)}
                    {Array.from({length: 5 - level.level}).map((_,i) => <Heart key={i} className="h-4 w-4 text-primary/30" />)}
                </div>
              </CardTitle>
              <CardDescription>A new challenge awaits.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/play/${level.level}`} passHref>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Playing
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
