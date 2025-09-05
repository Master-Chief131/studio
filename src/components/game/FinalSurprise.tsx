
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import Image from 'next/image';
import { StorySlide } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

interface FinalSurpriseProps {
  onBack: () => void;
  slides: StorySlide[];
}

export function FinalSurprise({ onBack, slides }: FinalSurpriseProps) {
  if (slides.length === 0) {
    return (
       <div className="absolute inset-0 z-20 rounded-lg overflow-hidden flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-yellow-100 via-amber-200 to-yellow-300">
        <div className="absolute inset-0 z-0">
            <Sparkles className="absolute top-1/4 left-1/4 w-16 h-16 text-white/30 animate-pulse" />
            <Sparkles className="absolute top-10 right-10 w-8 h-8 text-white/30 animate-pulse delay-500" />
            <Sparkles className="absolute bottom-1/2 right-1/4 w-12 h-12 text-white/30 animate-pulse delay-1000" />
            <Sparkles className="absolute bottom-10 left-10 w-8 h-8 text-white/30 animate-pulse delay-1500" />
        </div>
       <div className="z-10 bg-card/50 backdrop-blur-md p-8 rounded-lg shadow-2xl transition-all duration-700 animate-in fade-in-50 slide-in-from-bottom-10 flex flex-col items-center">
            <Trophy className="h-16 w-16 text-accent-foreground mb-4" />
            <h2 className="font-headline text-3xl font-bold text-accent-foreground">¡Felicidades, mi amor!</h2>
            <p className="mt-4 text-lg text-accent-foreground/90 max-w-md">
                Has completado todos los desafíos y desbloqueado cada recuerdo. Esto demuestra lo increíble que eres.
                Cada puzzle resuelto es como un día más a tu lado, lleno de alegría y amor.
                <br /><br />
                <strong>Te amo más de lo que las palabras pueden expresar.</strong>
            </p>
            <Button onClick={onBack} className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a la Galería
            </Button>
        </div>
    </div>
    )
  }


  return (
    <div className="relative w-full h-full flex items-center justify-center bg-background rounded-lg p-4">
        <Carousel className="w-full max-w-xl">
            <CarouselContent>
                {slides.map((slide, index) => (
                    <CarouselItem key={slide.id}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center p-0 aspect-video relative rounded-lg overflow-hidden">
                                     <Image src={slide.imageUrl} alt={`Diapositiva ${index + 1}`} fill objectFit="cover" />
                                     <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm text-center">
                                        <p className="text-white text-base font-body">{slide.text}</p>
                                     </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
                 <CarouselItem>
                    <div className="p-1">
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-6 aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20">
                                <Trophy className="h-16 w-16 text-accent-foreground mb-4" />
                                <h2 className="font-headline text-3xl font-bold text-accent-foreground">Fin de la Historia (por ahora)</h2>
                                 <p className="mt-4 text-lg text-accent-foreground/90 max-w-md text-center">
                                    Gracias por este increíble viaje. ¡Por muchos más recuerdos juntos!
                                    <br /><br />
                                    <strong>Te amo infinitamente.</strong>
                                </p>
                                <Button onClick={onBack} className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver a la Galería
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-12" />
            <CarouselNext className="-right-4 md:-right-12" />
        </Carousel>
    </div>
  );
}
