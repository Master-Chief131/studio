'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpQuestion } from '@/types';
import { cn } from '@/lib/utils';

interface HelpQuestionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    question: HelpQuestion;
    onAnswer: (isCorrect: boolean) => void;
}

export function HelpQuestionDialog({ isOpen, onClose, question, onAnswer }: HelpQuestionDialogProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleSubmit = () => {
        if (selectedAnswer === null) return;
        setIsAnswered(true);
        const isCorrect = selectedAnswer === question.correctAnswerIndex;
        setTimeout(() => {
            onAnswer(isCorrect);
            // Reset for next time
            setSelectedAnswer(null);
            setIsAnswered(false);
        }, 1000); // show correct/incorrect state for a moment
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline text-xl">Responde para obtener ayuda</DialogTitle>
                    <DialogDescription>{question.question}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
                    {question.options.map((option, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            className={cn(
                                "h-auto py-3 whitespace-normal justify-start text-left",
                                selectedAnswer === index && "ring-2 ring-primary",
                                isAnswered && index === question.correctAnswerIndex && "bg-green-200 border-green-500 hover:bg-green-200",
                                isAnswered && selectedAnswer === index && index !== question.correctAnswerIndex && "bg-red-200 border-red-500 hover:bg-red-200"
                            )}
                            onClick={() => !isAnswered && setSelectedAnswer(index)}
                            disabled={isAnswered}
                        >
                            {option}
                        </Button>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={selectedAnswer === null || isAnswered}>
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
