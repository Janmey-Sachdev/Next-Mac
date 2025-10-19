'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type SoundEffect = 'startup' | 'click' | 'tink' | 'windowOpen' | 'windowClose' | 'windowMinimize' | 'windowMaximize' | 'notification' | 'trash';

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
    const baseVolume = volume * 0.5; // Reduced volume for a softer sound
    const t = 0; // start time
    
    // Chord notes (approximating Windows 7 startup sound)
    const notes = [
      { freq: 220.00, delay: 0, duration: 1.2, type: 'sine' },      // A3
      { freq: 329.63, delay: 50, duration: 1.1, type: 'sine' },      // E4
      { freq: 440.00, delay: 100, duration: 1.0, type: 'sine' },     // A4
      { freq: 523.25, delay: 150, duration: 0.9, type: 'sine' },     // C5
      
      // Upper harmony
      { freq: 659.25, delay: 200, duration: 0.8, type: 'triangle' }, // E5
      { freq: 880.00, delay: 250, duration: 0.7, type: 'triangle' }, // A5
    ];

    notes.forEach(note => {
        setTimeout(() => playNote(note.freq, note.duration, baseVolume, note.type), t + note.delay);
    });
  },
  click: (volume) => playNote(1000, 0.05, volume * 0.5, 'triangle'),
  tink: (volume) => playNote(1200, 0.05, volume * 0.6, 'sine'),
  windowOpen: (volume) => playNote(600, 0.1, volume, 'sine'),
  windowClose: (volume) => playNote(400, 0.1, volume, 'sine'),
  windowMinimize: (volume) => playNote(300, 0.15, volume, 'sawtooth'),
  windowMaximize: (volume) => playNote(500, 0.15, volume, 'sawtooth'),
  trash: (volume) => playNote(100, 0.2, volume * 0.7, 'square'),
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
