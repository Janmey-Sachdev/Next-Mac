'use client';
import type { File } from '@/lib/apps';
import Image from 'next/image';

export default function Photos({ file }: { file?: File }) {
  if (!file || !file.content) {
    return (
      <div className="h-full flex items-center justify-center bg-background text-muted-foreground">
        No image to display.
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full h-full">
        <Image 
            src={file.content} 
            alt={file.name} 
            fill
            style={{ objectFit: 'contain' }}
        />
      </div>
    </div>
  );
}
