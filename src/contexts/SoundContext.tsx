'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type SoundEffect = 'startup' | 'click' | 'tink' | 'windowOpen' | 'windowClose' | 'windowMinimize' | 'windowMaximize' | 'notification';

interface SoundContextType {
  playSound: (sound: SoundEffect) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// A simple in-browser sound generation library
const createAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContext();
};

let audioContext = createAudioContext();

const playNote = (frequency: number, duration: number, volume: number, type: OscillatorType = 'sine') => {
  if (!audioContext || volume === 0) return;
  
  // Re-create context if it's suspended (e.g., by browser policies)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  gainNode.gain.setValueAtTime(volume * 0.5, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

const sounds: Record<SoundEffect, (volume: number) => void> = {
  startup: (volume) => {
    if (volume === 0) return;
    const baseVolume = volume * 0.6;
    const t = 0; // start time
    
    // F#4, A#4, C#5, F#5
    setTimeout(() => playNote(370, 0.7, baseVolume, 'sine'), t);
    setTimeout(() => playNote(466, 0.7, baseVolume * 0.8, 'sine'), t + 50);

    setTimeout(() => playNote(554, 0.9, baseVolume, 'sine'), t + 250);
    setTimeout(() => playNote(698, 0.9, baseVolume * 0.8, 'sine'), t + 300);
  },
  click: (volume) => playNote(1000, 0.05, volume * 0.5, 'triangle'),
  tink: (volume) => playNote(1200, 0.05, volume * 0.6, 'sine'),
  windowOpen: (volume) => playNote(600, 0.1, volume, 'sine'),
  windowClose: (volume) => playNote(400, 0.1, volume, 'sine'),
  windowMinimize: (volume) => playNote(300, 0.15, volume, 'sawtooth'),
  windowMaximize: (volume) => playNote(500, 0.15, volume, 'sawtooth'),
  notification: (volume) => {
    if (volume === 0) return;
    playNote(900, 0.1, volume, 'sine');
    setTimeout(() => playNote(1200, 0.1, volume, 'sine'), 120);
  }
};


export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [volume, setVolumeState] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('app-volume');
      const savedMute = localStorage.getItem('app-muted');
      if (savedVolume) setVolumeState(parseFloat(savedVolume));
      if (savedMute) setIsMuted(savedMute === 'true');
    }
  }, []);

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem('app-volume', newVolume.toString());
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem('app-muted', newMuteState.toString());
  };

  const playSound = useCallback((sound: SoundEffect) => {
    if (isMuted || !sounds[sound]) return;
    sounds[sound](volume);
  }, [isMuted, volume]);

  return (
    <SoundContext.Provider value={{ playSound, volume, setVolume, isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
