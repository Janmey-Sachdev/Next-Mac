'use client';
import { Textarea } from '@/components/ui/textarea';
import type { File } from '@/lib/apps';
import { useState, useEffect } from 'react';

export default function WordProcessor({ file }: { file?: File }) {
  const [content, setContent] = useState(file?.content || '');

  useEffect(() => {
    if (file) {
      setContent(file.content);
    }
  }, [file]);

  return (
    <div className="h-full flex flex-col bg-background">
        <div className="flex-grow p-2 bg-white/5">
            <Textarea 
                className="w-full h-full resize-none border-0 rounded-none focus-visible:ring-0 bg-transparent p-4" 
                placeholder="Start writing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
    </div>
  );
}
