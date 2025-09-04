'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getFromStorage } from '@/lib/storage';
import { Header } from '@/components/shared/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompletionOverlay } from '@/components/game/CompletionOverlay';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import type { PhotoData, Photos } from '@/types';
import { puzzles } from '@/lib/sudoku';
import { ArrowLeft, Maximize } from 'lucide-react';

type UnlockedPhoto = PhotoData & {
  level: number;
};

export default function GalleryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [unlockedPhotos, setUnlockedPhotos] = useState<UnlockedPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<UnlockedPhoto | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (user) {
      const completedLevels = getFromStorage<number[]>('sudoku-completed-levels') || [];
      const allPhotos = getFromStorage<Photos>('sudoku-photos') || {};
      
      const photos: UnlockedPhoto[] = completedLevels
        .sort((a, b) => a - b)
        .map(level => {
          if (allPhotos[level]) {
            return {
              ...allPhotos[level],
              level: level
            };
          }
          return null;
        })
        .filter((p): p is UnlockedPhoto => p !== null);

      setUnlockedPhotos(photos);
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
            <div className='flex items-center justify-between mb-8'>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Puzzles
                </Button>
                <div className="text-center">
                    <h2 className="font-headline text-4xl font-bold text-primary-foreground/90">Your Memories</h2>
                    <p className="text-muted-foreground mt-2">A collection of your unlocked moments.</p>
                </div>
                {/* Spacer div */}
                <div style={{ width: '150px' }}></div>
            </div>

          {unlockedPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {unlockedPhotos.map((photo) => (
                <Card key={photo.level} className="group relative overflow-hidden">
                  <CardHeader className="absolute top-0 left-0 z-10 w-full bg-gradient-to-b from-black/60 to-transparent p-4">
                    <CardTitle className="text-white font-headline text-lg">Level {photo.level}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 aspect-w-1 aspect-h-1">
                    <Image src={photo.imageUrl} alt={`Memory from level ${photo.level}`} layout="fill" objectFit="cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                       <Button
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setSelectedPhoto(photo)}
                        >
                            <Maximize className="mr-2 h-4 w-4" />
                            View
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">You haven't unlocked any photos yet.</p>
              <p className="mt-2">Complete some puzzles to start your collection!</p>
            </div>
          )}
        </main>
      </div>

      {selectedPhoto && (
         <Dialog open={!!selectedPhoto} onOpenChange={(isOpen) => !isOpen && setSelectedPhoto(null)}>
            <DialogContent className="p-0 border-0 max-w-2xl bg-transparent">
                <div className="relative aspect-square w-full">
                    <CompletionOverlay
                        imageUrl={selectedPhoto.imageUrl}
                        message={selectedPhoto.message}
                        onBack={() => setSelectedPhoto(null)}
                    />
                </div>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
