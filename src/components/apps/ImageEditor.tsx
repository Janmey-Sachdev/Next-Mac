'use client';
import type { File } from '@/lib/apps';
import Image from 'next/image';

export default function ImageEditor({ file }: { file?: File }) {
  return (
    <div className="h-full w-full flex flex-col bg-background">
        <div className="flex-shrink-0 p-2 border-b text-center">
            <h2 className="text-lg font-semibold">Image Editor</h2>
            <p className="text-sm text-muted-foreground">Editing tools coming soon!</p>
        </div>
      {file && file.content ? (
        <div className="flex-grow flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full h-full">
            <Image 
                src={file.content} 
                alt={file.name} 
                fill
                style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center text-muted-foreground">
          No image loaded. Open an image file to start editing.
        </div>
      )}
    </div>
  );
}
