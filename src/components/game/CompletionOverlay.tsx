'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Eye } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CompletionOverlayProps {
  onBack: () => void;
  imageUrl: string;
  message: string;
}

export function CompletionOverlay({ onBack, imageUrl, message }: CompletionOverlayProps) {
  const [showMessage, setShowMessage] = useState(true);

  return (
    <div className="absolute inset-0 z-20 rounded-lg overflow-hidden">
      <Image src={imageUrl} alt="Completed puzzle" layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
        <div 
          className={cn(
            "bg-card/30 backdrop-blur-sm p-8 rounded-lg shadow-2xl transition-all duration-700 animate-in fade-in-50",
            showMessage ? "slide-in-from-bottom-10" : "animate-out fade-out-0 slide-out-to-bottom-10 fill-mode-forwards"
          )}
          onClick={() => setShowMessage(false)}
        >
          <h2 className="font-headline text-4xl font-bold text-white">¡Felicitaciones!</h2>
          <p className="mt-2 text-lg text-white/90 max-w-md">
            {message}
          </p>
          <Button onClick={(e) => { e.stopPropagation(); onBack(); }} className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>
       {!showMessage && (
         <div className="absolute bottom-4 right-4 z-30">
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => { e.stopPropagation(); setShowMessage(true); }}
              className="rounded-full h-12 w-12 animate-in fade-in-50"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
         </div>
       )}
    </div>
  );
}
