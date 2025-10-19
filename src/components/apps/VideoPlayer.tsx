'use client';
import type { File } from '@/lib/apps';
import { Film } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function VideoPlayer({ file }: { file?: File }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (file && file.content && videoRef.current) {
      videoRef.current.src = file.content;
      videoRef.current.load();
    }
  }, [file]);
  
  if (!file || !file.content) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background text-muted-foreground text-center">
        <Film className="w-24 h-24 mb-4" />
        <h2 className="text-2xl font-bold">Video Player</h2>
        <p>Open a video file to begin.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-black">
      <video ref={videoRef} controls autoPlay className="max-h-full max-w-full">
         <source src={file.content} type={file.type} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
