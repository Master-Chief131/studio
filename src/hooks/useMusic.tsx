'use client';

import { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  musicUrl: string | null;
  isMuted: boolean;
  playMusic: (url: string) => void;
  stopMusic: () => void;
  toggleMute: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.loop = true;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying && musicUrl) {
            if (audioRef.current.src !== musicUrl) {
                audioRef.current.src = musicUrl;
            }
            audioRef.current.play().catch(error => console.error("Audio play failed:", error));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, musicUrl]);

  useEffect(() => {
    if(audioRef.current) {
        audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const playMusic = (url: string) => {
    setMusicUrl(url);
    setIsPlaying(true);
  };

  const stopMusic = () => {
    setIsPlaying(false);
    setMusicUrl(null);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  }

  return (
    <MusicContext.Provider value={{ isPlaying, musicUrl, isMuted, playMusic, stopMusic, toggleMute }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
