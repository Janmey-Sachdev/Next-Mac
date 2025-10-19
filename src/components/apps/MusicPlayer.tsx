'use client';
import type { File } from '@/lib/apps';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Rewind, FastForward, Volume2, VolumeX, Music4, Upload } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export default function MusicPlayer({ file: initialFile }: { file?: File }) {
  const [currentFile, setCurrentFile] = useState<File | null>(initialFile || null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (initialFile) {
        setCurrentFile(initialFile);
    }
  }, [initialFile]);

  useEffect(() => {
    if (currentFile && audioRef.current) {
      audioRef.current.src = currentFile.content;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Audio autoplay failed:", e));
    }
  }, [currentFile]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current || !currentFile) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current || !currentFile) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };
  
  const handleVolumeChange = (value: number[]) => {
      if(!audioRef.current) return;
      const newVolume = value[0];
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
  }
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleLoadFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
        const fileUrl = URL.createObjectURL(file);
        setCurrentFile({
          id: `local-${Date.now()}`,
          name: file.name,
          type: file.type,
          content: fileUrl,
        });
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
    }
  };

  if (!currentFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-muted text-muted-foreground p-8 text-center">
        <Music4 className="w-24 h-24 mb-4" />
        <h2 className="text-2xl font-bold">Music Player</h2>
        <p className="mb-4">Open a music file from your desktop or load one from your computer.</p>
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="audio/*" />
        <Button onClick={handleLoadFileClick}>
            <Upload className="mr-2 h-4 w-4" />
            Load Music
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-card text-card-foreground p-8">
      <audio ref={audioRef} />
      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-4">
            <Music4 className="w-16 h-16 text-primary" />
            <div className="flex-1">
                <h3 className="font-bold text-lg truncate">{currentFile.name}</h3>
                <p className="text-sm text-muted-foreground">Now Playing</p>
            </div>
        </div>

        <div className="w-full mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 0}
            step={1}
            onValueChange={handleSeek}
            disabled={!currentFile}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => handleSeek([Math.max(0, currentTime - 10)])}  disabled={!currentFile}>
            <Rewind />
          </Button>
          <Button size="lg" className="w-16 h-16 rounded-full" onClick={togglePlayPause} disabled={!currentFile}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleSeek([Math.min(duration, currentTime + 10)])} disabled={!currentFile}>
            <FastForward />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
            {volume > 0 ? <Volume2 className="h-5 w-5"/> : <VolumeX className="h-5 w-5"/>}
            <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
            />
        </div>

        <div className="text-center">
             <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="audio/*" />
            <Button onClick={handleLoadFileClick} variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Load Other Music
            </Button>
        </div>
      </div>
    </div>
  );
}
