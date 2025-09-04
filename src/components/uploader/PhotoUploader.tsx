
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFromStorage, saveToStorage } from '@/lib/storage';
import type { Photos, PhotoData, HelpQuestion } from '@/types';
import Image from 'next/image';
import { puzzles } from '@/lib/sudoku';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Eye, Music, X, PlusCircle, Save } from 'lucide-react';
import { CompletionOverlay } from '@/components/game/CompletionOverlay';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const defaultMessages: {[key: string]: string} = {
    '1': 'Recuerdas cuando...',
    '2': 'Un día especial...',
    '3': 'Nuestra primera aventura...',
    '4': 'Solo tú y yo...',
    '5': 'Mi lugar favorito es a tu lado.'
}

function HelpQuestionsManager() {
    const { toast } = useToast();
    const [questions, setQuestions] = useState<HelpQuestion[]>([]);
    const [editingQuestion, setEditingQuestion] = useState<Partial<HelpQuestion>>({
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
    });
    
    useEffect(() => {
        const storedQuestions = getFromStorage<HelpQuestion[]>('sudoku-help-questions') || [];
        setQuestions(storedQuestions);
    }, []);

    const saveQuestions = (updatedQuestions: HelpQuestion[]) => {
        setQuestions(updatedQuestions);
        saveToStorage('sudoku-help-questions', updatedQuestions);
    };

    const handleAddQuestion = () => {
        if (!editingQuestion.question || editingQuestion.options?.some(o => !o)) {
            toast({ title: "Please fill all fields", variant: "destructive" });
            return;
        }

        const newQuestion: HelpQuestion = {
            id: editingQuestion.id || crypto.randomUUID(),
            ...editingQuestion,
            question: editingQuestion.question!,
            options: editingQuestion.options!,
            correctAnswerIndex: editingQuestion.correctAnswerIndex!,
        };

        let updatedQuestions;
        if(editingQuestion.id) {
            updatedQuestions = questions.map(q => q.id === newQuestion.id ? newQuestion : q);
            toast({ title: "Question updated!" });
        } else {
            updatedQuestions = [...questions, newQuestion];
            toast({ title: "Question added!" });
        }
        
        saveQuestions(updatedQuestions);
        setEditingQuestion({ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 });
    };

    const handleEdit = (question: HelpQuestion) => {
        setEditingQuestion(question);
    };

    const handleRemoveQuestion = (id: string) => {
        const updatedQuestions = questions.filter(q => q.id !== id);
        saveQuestions(updatedQuestions);
        toast({ title: "Question removed", variant: "destructive" });
    };
    
    return (
        <div className="space-y-4">
            <h3 className="font-headline text-lg">Help Questions</h3>
            <CardDescription>Create questions the player must answer to get a hint.</CardDescription>
            
            <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
                 <h4 className="font-semibold text-md">{editingQuestion.id ? 'Edit Question' : 'Add New Question'}</h4>
                 <div className="space-y-2">
                    <Label htmlFor="question-text">Question</Label>
                    <Input
                        id="question-text"
                        value={editingQuestion.question}
                        onChange={(e) => setEditingQuestion(prev => ({...prev, question: e.target.value}))}
                        placeholder="e.g., ¿Cuál es nuestra canción?"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {editingQuestion.options?.map((opt, index) => (
                        <div key={index} className="space-y-2">
                            <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
                            <Input 
                                id={`option-${index}`}
                                value={opt}
                                onChange={(e) => {
                                    const newOptions = [...editingQuestion.options!];
                                    newOptions[index] = e.target.value;
                                    setEditingQuestion(prev => ({...prev, options: newOptions}));
                                }}
                                placeholder={`Answer ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <RadioGroup
                        value={String(editingQuestion.correctAnswerIndex)}
                        onValueChange={(value) => setEditingQuestion(prev => ({...prev, correctAnswerIndex: parseInt(value, 10)}))}
                        className="flex items-center gap-4"
                    >
                       {editingQuestion.options?.map((_, index) => (
                         <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={String(index)} id={`r${index}`} />
                            <Label htmlFor={`r${index}`}>Option {index + 1}</Label>
                        </div>
                       ))}
                    </RadioGroup>
                </div>
                 <Button onClick={handleAddQuestion}>
                    <Save className="mr-2" /> {editingQuestion.id ? 'Update Question' : 'Save Question'}
                </Button>
                 {editingQuestion.id && (
                    <Button variant="ghost" onClick={() => setEditingQuestion({ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 })}>
                        Cancel Edit
                    </Button>
                )}
            </div>

            <div className="space-y-2">
                <h4 className="font-semibold">Current Questions</h4>
                {questions.length === 0 ? <p className="text-sm text-muted-foreground">No questions yet.</p> : (
                    <ul className="space-y-2">
                        {questions.map((q) => (
                            <li key={q.id} className="flex items-center justify-between p-2 rounded-md bg-background border">
                                <span className="text-sm truncate flex-1 pr-4">{q.question}</span>
                                <div className="flex items-center gap-2">
                                     <Button variant="outline" size="sm" onClick={() => handleEdit(q)}>Edit</Button>
                                     <Button variant="destructive" size="sm" onClick={() => handleRemoveQuestion(q.id)}>Remove</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}


export function PhotoUploader() {
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [currentMessage, setCurrentMessage] = useState(defaultMessages['1'] || '');
  const [photos, setPhotos] = useState<Photos>({});
  const [backgroundMusic, setBackgroundMusic] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<PhotoData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedPhotos = getFromStorage<Photos>('sudoku-photos');
    if (storedPhotos) {
      setPhotos(storedPhotos);
    }
    const storedMusic = getFromStorage<string>('sudoku-background-music');
    if(storedMusic) {
        setBackgroundMusic(storedMusic);
    }
  }, []);

  useEffect(() => {
    setCurrentMessage(photos[selectedLevel]?.message || defaultMessages[selectedLevel] || '');
  }, [selectedLevel, photos]);

  const handleSaveData = (level: string, data: Partial<PhotoData>) => {
    const existingData = photos[level] || {};
    const newData: PhotoData = {
        imageUrl: data.imageUrl || existingData.imageUrl || '',
        message: 'message' in data ? data.message! : existingData.message || defaultMessages[level] || '',
    };

    if(!newData.imageUrl) return; // Don't save if there's no image

    const newPhotos = { ...photos, [level]: newData };
    setPhotos(newPhotos);
    saveToStorage('sudoku-photos', newPhotos);
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.size > 1 * 1024 * 1024) { // 1MB limit
        toast({
          variant: "destructive",
          title: "Image too large",
          description: "Please select an image smaller than 1MB."
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        handleSaveData(selectedLevel, { imageUrl, message: currentMessage });
        toast({
            title: `Photo for Level ${selectedLevel} updated!`,
            description: "The player will see this image and message."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setCurrentMessage(newMessage);
    if(photos[selectedLevel]?.imageUrl){
        handleSaveData(selectedLevel, { message: newMessage });
        toast({
            title: `Message for Level ${selectedLevel} updated!`,
        });
    }
  }

  const handleRemovePhoto = (level: string) => {
    const newPhotos = {...photos};
    delete newPhotos[level];
    setPhotos(newPhotos);
    saveToStorage('sudoku-photos', newPhotos);
    toast({
        title: `Data for Level ${level} removed.`,
        variant: "destructive"
    });
  }

  const handlePreview = (level: string) => {
    if (photos[level]) {
      setPreviewing(photos[level]);
    }
  }

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for audio
        toast({
          variant: "destructive",
          title: "Audio file too large",
          description: "Please select a file smaller than 2MB."
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const musicDataUrl = reader.result as string;
        setBackgroundMusic(musicDataUrl);
        saveToStorage('sudoku-background-music', musicDataUrl);
        toast({
          title: "Background music updated!",
          description: "The player will hear this music in their session."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMusic = () => {
      setBackgroundMusic(null);
      saveToStorage('sudoku-background-music', null);
      toast({
        title: "Background music removed.",
        variant: "destructive"
      });
  }

  return (
    <>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">Customize Game</CardTitle>
          <CardDescription>Upload reward photos, write messages, set music, and create help questions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <h3 className="font-headline text-lg pt-4 border-t">Background Music</h3>
          <div className="space-y-2">
            <Label htmlFor="music-upload">Audio File (MP3, WAV, etc.)</Label>
            <Input id="music-upload" type="file" accept="audio/*" onChange={handleMusicUpload} />
          </div>
          {backgroundMusic && (
             <div className="flex items-center gap-4 p-2 rounded-md bg-muted">
                <Music className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                    <p className="text-sm font-medium">Music is set.</p>
                    <p className="text-xs text-muted-foreground">Players will hear this in the background.</p>
                </div>
                <audio src={backgroundMusic} controls className='h-8'/>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRemoveMusic}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
          )}

          <Separator className="my-6" />

          <HelpQuestionsManager />

          <Separator className="my-6" />

          <h3 className="font-headline text-lg">Customize Levels</h3>
          <CardDescription>Select a level to upload a reward photo and write a special message.</CardDescription>
          
          <div className='space-y-2 mb-4 pt-4'>
             <Label htmlFor="level-select">Level</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger id="level-select">
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  {puzzles.map((p) => (
                    <SelectItem key={p.level} value={String(p.level)}>
                      Level {p.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="photo-upload">Photo File</Label>
              <Input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
             <div className="space-y-2 flex-1">
                <Label htmlFor="completion-message">Completion Message</Label>
                <Textarea
                    id="completion-message"
                    placeholder={`e.g., ${defaultMessages[selectedLevel]}`}
                    value={currentMessage}
                    onChange={handleMessageChange}
                />
            </div>
          </div>

          <h3 className="font-headline text-lg pt-4">Current Levels</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {puzzles.map((p) => (
              <Card key={p.level} className="relative group">
                <CardHeader>
                  <CardTitle className="text-base font-headline">Level {p.level}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center aspect-square bg-muted rounded-b-lg">
                  {photos[p.level]?.imageUrl ? (
                    <>
                      <Image src={photos[p.level].imageUrl} alt={`Level ${p.level} photo`} width={150} height={150} className="object-cover w-full h-full rounded-b-lg" />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => handlePreview(String(p.level))}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemovePhoto(String(p.level))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                       <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs truncate">
                        {photos[p.level].message}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Upload className="h-8 w-8 mx-auto" />
                      <p className="text-xs mt-2">No Data</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      {previewing && (
        <Dialog open={!!previewing} onOpenChange={(isOpen) => !isOpen && setPreviewing(null)}>
            <DialogContent className="p-0 border-0 max-w-2xl bg-transparent">
                <div className="relative aspect-square w-full">
                    <CompletionOverlay
                        imageUrl={previewing.imageUrl}
                        message={previewing.message}
                        onBack={() => setPreviewing(null)}
                    />
                </div>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
