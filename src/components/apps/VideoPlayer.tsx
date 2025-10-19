'use client';
import type { File } from '@/lib/apps';
import { Film, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';

export default function VideoPlayer({ file: initialFile }: { file?: File }) {
  const [currentFile, setCurrentFile] = useState<File | null>(initialFile || null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialFile) {
        setCurrentFile(initialFile);
    }
  }, [initialFile]);
  
  useEffect(() => {
    if (currentFile && currentFile.content && videoRef.current) {
      videoRef.current.src = currentFile.content;
      videoRef.current.load();
    }
  }, [currentFile]);

  const handleLoadFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
        const fileUrl = URL.createObjectURL(file);
        setCurrentFile({
          id: `local-${Date.now()}`,
          name: file.name,
          type: file.type,
          content: fileUrl,
        });
    }
  };
  
  if (!currentFile || !currentFile.content) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background text-muted-foreground text-center">
        <Film className="w-24 h-24 mb-4" />
        <h2 className="text-2xl font-bold">Video Player</h2>
        <p className="mb-4">Open a video file to begin or load one from your computer.</p>
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="video/*" />
        <Button onClick={handleLoadFileClick}>
            <Upload className="mr-2 h-4 w-4" />
            Load Video
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black">
      <div className="absolute top-2 right-2 z-10">
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="video/*" />
        <Button onClick={handleLoadFileClick} variant="secondary" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Load Video
        </Button>
      </div>
      <video ref={videoRef} controls autoPlay className="max-h-full max-w-full">
         <source src={currentFile.content} type={currentFile.type} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
