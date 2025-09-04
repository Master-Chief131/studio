'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface CompletionOverlayProps {
  onBack: () => void;
  imageUrl: string;
  message: string;
}

export function CompletionOverlay({ onBack, imageUrl, message }: CompletionOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 rounded-lg overflow-hidden">
      <Image src={imageUrl} alt="Completed puzzle" layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
        <div className="bg-card/30 backdrop-blur-sm p-8 rounded-lg shadow-2xl animate-in fade-in-50 slide-in-from-bottom-10 duration-700">
            <h2 className="font-headline text-4xl font-bold text-white">¡Felicitaciones!</h2>
            <p className="mt-2 text-lg text-white/90 max-w-md">
                {message}
            </p>
            <Button onClick={onBack} className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Button>
        </div>
      </div>
    </div>
  );
}
