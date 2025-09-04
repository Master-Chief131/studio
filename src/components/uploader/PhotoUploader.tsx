'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFromStorage, saveToStorage } from '@/lib/storage';
import type { Photos, PhotoData } from '@/types';
import Image from 'next/image';
import { puzzles } from '@/lib/sudoku';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Eye } from 'lucide-react';
import { CompletionOverlay } from '@/components/game/CompletionOverlay';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Textarea } from '../ui/textarea';

const defaultMessages: {[key: string]: string} = {
    '1': 'Recuerdas cuando...',
    '2': 'Un día especial...',
    '3': 'Nuestra primera aventura...',
    '4': 'Solo tú y yo...',
    '5': 'Mi lugar favorito es a tu lado.'
}

export function PhotoUploader() {
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [currentMessage, setCurrentMessage] = useState(defaultMessages['1'] || '');
  const [photos, setPhotos] = useState<Photos>({});
  const [previewing, setPreviewing] = useState<PhotoData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedPhotos = getFromStorage<Photos>('sudoku-photos');
    if (storedPhotos) {
      setPhotos(storedPhotos);
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
      if(file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: "destructive",
          title: "Image too large",
          description: "Please select an image smaller than 2MB."
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

  return (
    <>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">Customize Levels</CardTitle>
          <CardDescription>Select a level to upload a reward photo and write a special message.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className='space-y-2 mb-4'>
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
                      <Image src={photos[p.level].imageUrl} alt={`Level ${p.level} photo`} layout="fill" objectFit="cover" className="rounded-b-lg" />
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
