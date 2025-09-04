'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFromStorage, saveToStorage } from '@/lib/storage';
import type { Photos } from '@/types';
import Image from 'next/image';
import { puzzles } from '@/lib/sudoku';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2 } from 'lucide-react';

export function PhotoUploader() {
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [photos, setPhotos] = useState<Photos>({});
  const { toast } = useToast();

  useEffect(() => {
    const storedPhotos = getFromStorage<Photos>('sudoku-photos');
    if (storedPhotos) {
      setPhotos(storedPhotos);
    }
  }, []);

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
        const newPhotos = { ...photos, [selectedLevel]: reader.result as string };
        setPhotos(newPhotos);
        saveToStorage('sudoku-photos', newPhotos);
        toast({
            title: `Photo for Level ${selectedLevel} updated!`,
            description: "The player will see this image."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (level: string) => {
    const newPhotos = {...photos};
    delete newPhotos[level];
    setPhotos(newPhotos);
    saveToStorage('sudoku-photos', newPhotos);
    toast({
        title: `Photo for Level ${level} removed.`,
        variant: "destructive"
    });
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Upload Photo</CardTitle>
        <CardDescription>Select a level and upload a corresponding photo. This will be the reward image.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2 flex-1">
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
          <div className="space-y-2 flex-1">
            <Label htmlFor="photo-upload">Photo File</Label>
            <Input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <h3 className="font-headline text-lg pt-4">Current Photos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {puzzles.map((p) => (
            <Card key={p.level} className="relative group">
              <CardHeader>
                <CardTitle className="text-base font-headline">Level {p.level}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center aspect-square bg-muted rounded-b-lg">
                {photos[p.level] ? (
                  <>
                    <Image src={photos[p.level]} alt={`Level ${p.level} photo`} layout="fill" objectFit="cover" className="rounded-b-lg" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={() => handleRemovePhoto(String(p.level))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="h-8 w-8 mx-auto" />
                    <p className="text-xs mt-2">No Photo</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
