'use client';
import { Textarea } from '@/components/ui/textarea';

export default function WordProcessor() {
  return (
    <div className="h-full flex flex-col bg-background">
        <div className="flex-grow p-2 bg-white/5">
            <Textarea 
                className="w-full h-full resize-none border-0 rounded-none focus-visible:ring-0 bg-transparent p-4" 
                placeholder="Start writing..." 
            />
        </div>
    </div>
  );
}
