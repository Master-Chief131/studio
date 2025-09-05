
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Photos, PhotoData, HelpQuestion, StorySlide } from '@/types';
import Image from 'next/image';
import { puzzles } from '@/lib/sudoku';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Eye, Music, X, PlusCircle, Save, GripVertical, ArrowUp, ArrowDown, BookOpen } from 'lucide-react';
import { CompletionOverlay } from '@/components/game/CompletionOverlay';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { FinalSurprise } from '../game/FinalSurprise';
import { VisuallyHidden, DialogTitle as VisuallyHiddenTitle, DialogDescription as VisuallyHiddenDesc } from '@/components/ui/dialog';


const defaultMessages: {[key: string]: string} = {
    '1': '¿Recuerdas cuando...?',
    '2': 'Un día especial...',
    '3': 'Nuestra primera aventura...',
    '4': 'Solo tú y yo...',
    '5': 'Mi lugar favorito es a tu lado.'
};

const defaultLevelDescriptions: {[key: string]: string} = {
  '1': "Este juego fue creado especialmente para ti.",
  '2': "Cada nivel completado revelará una sorpresa especial.",
  '3': "¿Lista para descubrir qué he preparado para ti?",
  '4': "Un nuevo desafío te espera.",
  '5': "El último secreto está a punto de ser revelado."
};

function HelpQuestionsManager() {
    const { toast } = useToast();
    const [questions, setQuestions] = useState<HelpQuestion[]>([]);
    const [editingQuestion, setEditingQuestion] = useState<Partial<HelpQuestion>>({
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
    });
    

  useEffect(() => {
    fetch('/api/admin/questions')
      .then(res => res.json())
      .then(data => setQuestions(Array.isArray(data) ? data : []));
  }, []);

  const saveQuestions = async (updatedQuestions: HelpQuestion[]) => {
    setQuestions(updatedQuestions);
    await fetch('/api/admin/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedQuestions),
    });
  };

    const handleAddQuestion = () => {
        if (!editingQuestion.question || editingQuestion.options?.some(o => !o)) {
            toast({ title: "Por favor, completa todos los campos", variant: "destructive" });
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
            toast({ title: "¡Pregunta actualizada!" });
        } else {
            updatedQuestions = [...questions, newQuestion];
            toast({ title: "¡Pregunta añadida!" });
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
        toast({ title: "Pregunta eliminada", variant: "destructive" });
    };
    
    return (
        <div className="space-y-4">
            <h3 className="font-headline text-lg">Preguntas de Ayuda</h3>
            <CardDescription>Crea preguntas que el jugador deba responder para obtener una pista.</CardDescription>
            
            <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
                 <h4 className="font-semibold text-md">{editingQuestion.id ? 'Editar Pregunta' : 'Añadir Nueva Pregunta'}</h4>
                 <div className="space-y-2">
                    <Label htmlFor="question-text">Pregunta</Label>
                    <Input
                        id="question-text"
                        value={editingQuestion.question}
                        onChange={(e) => setEditingQuestion(prev => ({...prev, question: e.target.value}))}
                        placeholder="Ej., ¿Cuál es nuestra canción?"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {editingQuestion.options?.map((opt, index) => (
                        <div key={index} className="space-y-2">
                            <Label htmlFor={`option-${index}`}>Opción {index + 1}</Label>
                            <Input 
                                id={`option-${index}`}
                                value={opt}
                                onChange={(e) => {
                                    const newOptions = [...editingQuestion.options!];
                                    newOptions[index] = e.target.value;
                                    setEditingQuestion(prev => ({...prev, options: newOptions}));
                                }}
                                placeholder={`Respuesta ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <Label>Respuesta Correcta</Label>
                    <RadioGroup
                        value={String(editingQuestion.correctAnswerIndex)}
                        onValueChange={(value) => setEditingQuestion(prev => ({...prev, correctAnswerIndex: parseInt(value, 10)}))}
                        className="flex items-center gap-4"
                    >
                       {editingQuestion.options?.map((_, index) => (
                         <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={String(index)} id={`r${index}`} />
                            <Label htmlFor={`r${index}`}>Opción {index + 1}</Label>
                        </div>
                       ))}
                    </RadioGroup>
                </div>
                 <Button onClick={handleAddQuestion}>
                    <Save className="mr-2" /> {editingQuestion.id ? 'Actualizar Pregunta' : 'Guardar Pregunta'}
                </Button>
                 {editingQuestion.id && (
                    <Button variant="ghost" onClick={() => setEditingQuestion({ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 })}>
                        Cancelar Edición
                    </Button>
                )}
            </div>

            <div className="space-y-2">
                <h4 className="font-semibold">Preguntas Actuales</h4>
                {questions.length === 0 ? <p className="text-sm text-muted-foreground">Aún no hay preguntas.</p> : (
                    <ul className="space-y-2">
                        {questions.map((q) => (
                            <li key={q.id} className="flex items-center justify-between p-2 rounded-md bg-background border">
                                <span className="text-sm truncate flex-1 pr-4">{q.question}</span>
                                <div className="flex items-center gap-2">
                                     <Button variant="outline" size="sm" onClick={() => handleEdit(q)}>Editar</Button>
                                     <Button variant="destructive" size="sm" onClick={() => handleRemoveQuestion(q.id)}>Eliminar</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function StoryManager() {
    const [slides, setSlides] = useState<StorySlide[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        fetch('/api/admin/story')
            .then(res => res.json())
            .then(data => setSlides(Array.isArray(data) ? data : []));
    }, []);

    const saveStory = async (newSlides: StorySlide[]) => {
        setSlides(newSlides);
        await fetch('/api/admin/story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSlides),
        });
    };

    const handleAddSlide = () => {
        const newSlide = { id: crypto.randomUUID(), imageUrl: '', text: '' };
        saveStory([...slides, newSlide]);
    };

    const handleRemoveSlide = (id: string) => {
        saveStory(slides.filter(s => s.id !== id));
        toast({ title: "Diapositiva eliminada", variant: "destructive" });
    };

    const handleUpdateText = (id: string, text: string) => {
        const newSlides = slides.map(s => (s.id === id ? { ...s, text } : s));
        setSlides(newSlides); // Update local state immediately for better UX
    };
    
    const handleUpdateImage = (id: string, imageUrl: string) => {
        const newSlides = slides.map(s => (s.id === id ? { ...s, imageUrl } : s));
        saveStory(newSlides);
    }
    
    const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1 * 1024 * 1024) { // 1MB limit
                toast({ variant: "destructive", title: "Imagen demasiado grande" });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                handleUpdateImage(id, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const moveSlide = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === slides.length - 1)) {
            return;
        }
        const newSlides = [...slides];
        const slide = newSlides[index];
        newSlides.splice(index, 1);
        newSlides.splice(index + (direction === 'down' ? 1 : -1), 0, slide);
        saveStory(newSlides);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-headline text-lg">Story Time Final</h3>
                    <CardDescription>Crea la secuencia de fotos y textos para la sorpresa final.</CardDescription>
                </div>
                <Button onClick={handleAddSlide}>
                    <PlusCircle className="mr-2" /> Añadir Diapositiva
                </Button>
            </div>
            
            <div className="space-y-4">
                {slides.map((slide, index) => (
                    <Card key={slide.id} className="p-4 flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0 flex sm:flex-col items-center gap-2">
                           <Button size="icon" variant="ghost" onClick={() => moveSlide(index, 'up')} disabled={index === 0}><ArrowUp className="w-4 h-4" /></Button>
                           <span className="font-bold">{index + 1}</span>
                           <Button size="icon" variant="ghost" onClick={() => moveSlide(index, 'down')} disabled={index === slides.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                        </div>
                        <div className='flex-shrink-0 w-32 h-32 bg-muted rounded-md flex items-center justify-center relative'>
                             {slide.imageUrl ? (
                                <Image src={slide.imageUrl} alt={`Diapositiva ${index+1}`} fill objectFit="cover" className="rounded-md" />
                            ) : (
                                <div className="text-center text-muted-foreground p-2">
                                    <Upload className="h-6 w-6 mx-auto" />
                                    <p className="text-xs mt-1">Subir Imagen</p>
                                </div>
                            )}
                             <Input 
                                id={`story-img-${slide.id}`} 
                                type="file" 
                                accept="image/*" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(slide.id, e)}
                            />
                        </div>
                        <div className="flex-grow space-y-2">
                            <Label htmlFor={`story-text-${slide.id}`}>Texto de la Diapositiva</Label>
                            <Textarea 
                                id={`story-text-${slide.id}`}
                                value={slide.text}
                                onChange={(e) => handleUpdateText(slide.id, e.target.value)}
                                onBlur={() => saveStory(slides)} // Save on blur
                                placeholder="Escribe la historia de este momento..."
                                rows={3}
                            />
                        </div>
                         <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleRemoveSlide(slide.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function PhotoUploader() {
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [photos, setPhotos] = useState<Photos>({});
  const [musicFiles, setMusicFiles] = useState<string[]>([]);
  const [story, setStory] = useState<StorySlide[]>([]);
  const [previewing, setPreviewing] = useState<PhotoData | null>(null);
  const [previewingStory, setPreviewingStory] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/admin/photos')
      .then(res => res.json())
      .then(data => setPhotos(data || {}));
    fetch('/api/admin/music')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.files)) setMusicFiles(data.files);
      });
     fetch('/api/admin/story')
        .then(res => res.json())
        .then(data => setStory(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    setCurrentMessage(photos[selectedLevel]?.message || defaultMessages[selectedLevel] || '');
    setCurrentDescription(photos[selectedLevel]?.description || defaultLevelDescriptions[selectedLevel] || '');
  }, [selectedLevel, photos]);

  const handleSaveData = async (level: string, data: Partial<PhotoData>) => {
    const existingData = photos[level] || {};
    const newData: PhotoData = {
        imageUrl: data.imageUrl || existingData.imageUrl || '',
        message: 'message' in data ? data.message! : existingData.message || defaultMessages[level] || '',
        description: 'description' in data ? data.description! : existingData.description || defaultLevelDescriptions[level] || '',
    };

    if(!newData.imageUrl) {
        toast({
            title: "Primero sube una imagen",
            description: "No se pueden guardar los textos si no hay una imagen para el nivel.",
            variant: "destructive"
        });
        return;
    }

    const newPhotos = { ...photos, [level]: newData };
    setPhotos(newPhotos);
    await fetch('/api/admin/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPhotos),
    });
    toast({
        title: `¡Datos del Nivel ${level} actualizados!`,
    });
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.size > 1 * 1024 * 1024) { // 1MB limit
        toast({
          variant: "destructive",
          title: "Imagen demasiado grande",
          description: "Por favor, selecciona una imagen de menos de 1MB."
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        handleSaveData(selectedLevel, { imageUrl, message: currentMessage, description: currentDescription });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentDescription(e.target.value);
  }
  
  const handleTextSave = () => {
    handleSaveData(selectedLevel, { message: currentMessage, description: currentDescription });
  }

  const handleRemovePhoto = async (level: string) => {
    const newPhotos = {...photos};
    delete newPhotos[level];
    setPhotos(newPhotos);
    await fetch('/api/admin/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPhotos),
    });
    toast({
        title: `Datos del Nivel ${level} eliminados.`,
        variant: "destructive"
    });
  }

  const handlePreview = (level: string) => {
    if (photos[level]) {
      setPreviewing(photos[level]);
    }
  }

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) { // 10MB por archivo
        toast({
          variant: "destructive",
          title: `Archivo demasiado grande: ${file.name}`,
          description: "Por favor, selecciona archivos de menos de 10MB."
        });
        return;
      }
      formData.append('files', file);
    }
    const res = await fetch('/api/admin/music', {
      method: 'PUT',
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setMusicFiles(prev => [...prev, ...(data.files || [])]);
      toast({ title: "¡Archivos de música subidos!" });
    } else {
      toast({ title: "Error al subir archivos de música", variant: "destructive" });
    }
    e.target.value = '';
  };

  const handleRemoveMusic = async (filename: string) => {
    await fetch('/api/admin/music', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename }),
    });
    setMusicFiles(prev => prev.filter(f => f !== filename));
    toast({ title: `Archivo eliminado: ${filename}`, variant: "destructive" });
  }

  return (
    <>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">Personalizar Juego</CardTitle>
          <CardDescription>Sube fotos de recompensa, escribe mensajes, establece la música y crea preguntas de ayuda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          

          <h3 className="font-headline text-lg pt-4 border-t">Música de Fondo</h3>
          <div className="space-y-2">
            <Label htmlFor="music-upload">Archivos de Audio (MP3, puedes subir varios)</Label>
            <Input id="music-upload" type="file" accept="audio/mp3" multiple onChange={handleMusicUpload} />
          </div>
          {musicFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm">Archivos subidos:</p>
              <ul className="space-y-2">
                {musicFiles.map((file) => (
                  <li key={file} className="flex items-center gap-2 bg-muted p-2 rounded">
                    <Music className="h-5 w-5 text-muted-foreground" />
                    <span className="flex-1 text-xs">{file}</span>
                    <audio src={`/music/${file}`} controls className="h-8" preload="none" />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveMusic(file)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator className="my-6" />
          
          <StoryManager />
          
          <Separator className="my-6" />

          <HelpQuestionsManager />

          <Separator className="my-6" />

          <h3 className="font-headline text-lg">Personalizar Niveles</h3>
          <CardDescription>Selecciona un nivel para subir una foto, escribir un mensaje y una descripción.</CardDescription>
          
          <div className='space-y-2 mb-4 pt-4'>
             <Label htmlFor="level-select">Nivel</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger id="level-select">
                  <SelectValue placeholder="Selecciona un nivel" />
                </SelectTrigger>
                <SelectContent>
                  {puzzles.map((p) => (
                    <SelectItem key={p.level} value={String(p.level)}>
                      Nivel {p.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
            <div className="space-y-2">
              <Label htmlFor="photo-upload">Archivo de Foto (Recompensa)</Label>
              <Input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="level-description">Descripción del Nivel (en el tablero)</Label>
                    <Textarea
                        id="level-description"
                        placeholder={`Ej., ${defaultLevelDescriptions[selectedLevel]}`}
                        value={currentDescription}
                        onChange={handleDescriptionChange}
                        rows={3}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="completion-message">Mensaje de Finalización (al completar)</Label>
                    <Textarea
                        id="completion-message"
                        placeholder={`Ej., ${defaultMessages[selectedLevel]}`}
                        value={currentMessage}
                        onChange={handleMessageChange}
                        rows={3}
                    />
                </div>
            </div>
            <Button onClick={handleTextSave}>
                <Save className="mr-2" />
                Guardar Textos del Nivel {selectedLevel}
            </Button>


          <div className="flex items-center justify-between pt-4 mt-4 border-t">
              <h3 className="font-headline text-lg">Galería de Niveles</h3>
              <Button variant="outline" onClick={() => setPreviewingStory(true)} disabled={story.length === 0}>
                  <Eye className="mr-2" /> Vista Previa del Story Time
              </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {puzzles.map((p) => (
              <Card key={p.level} className="relative group">
                <CardHeader>
                  <CardTitle className="text-base font-headline">Nivel {p.level}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center aspect-square bg-muted rounded-b-lg">
                  {photos[p.level]?.imageUrl ? (
                    <>
                      <Image src={photos[p.level].imageUrl} alt={`Foto del Nivel ${p.level}`} width={150} height={150} className="object-cover w-full h-full rounded-b-lg" />
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
                      <p className="text-xs mt-2">Sin Datos</p>
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
            <DialogContent className="p-0 border-0 max-w-2xl bg-transparent" aria-labelledby="preview-title" aria-describedby="preview-desc">
                 <VisuallyHidden>
                   <VisuallyHiddenTitle id="preview-title">Vista Previa del Recuerdo</VisuallyHiddenTitle>
                   <VisuallyHiddenDesc id="preview-desc">{previewing.message}</VisuallyHiddenDesc>
                 </VisuallyHidden>
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
       {previewingStory && (
         <Dialog open={previewingStory} onOpenChange={setPreviewingStory}>
            <DialogContent className="p-0 border-0 max-w-4xl bg-transparent" aria-labelledby="story-preview-title">
                 <VisuallyHidden>
                   <VisuallyHiddenTitle id="story-preview-title">Vista Previa del Story Time</VisuallyHiddenTitle>
                 </VisuallyHidden>
                 <FinalSurprise
                    slides={story}
                    onBack={() => setPreviewingStory(false)}
                 />
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
