
'use client';
import { Textarea } from '@/components/ui/textarea';
import type { File } from '@/lib/apps';
import { useDesktop } from '@/contexts/DesktopContext';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';


export default function WordProcessor({ file }: { file?: File }) {
  const { dispatch } = useDesktop();
  const [content, setContent] = useState(file?.content || '');

  useEffect(() => {
    // When a different file is opened, update the content.
    if (file) {
      setContent(file.content);
    }
  }, [file]);
  
  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    if (file && debouncedContent !== file.content) {
        // This is a mock save. We are updating the file in our global state.
        // In a real app, this would be an API call.
        dispatch({
            type: 'UPDATE_DESKTOP_FILE',
            payload: { ...file, content: debouncedContent },
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent]);


  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };


  if (!file) {
    return (
        <div className="h-full flex items-center justify-center bg-background text-muted-foreground">
            <p>Create or open a text file to start writing.</p>
        </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
        <div className="flex-grow p-2 bg-white/5">
            <Textarea 
                className="w-full h-full resize-none border-0 rounded-none focus-visible:ring-0 bg-transparent p-4" 
                placeholder="Start writing..."
                value={content}
                onChange={handleContentChange}
            />
        </div>
    </div>
  );
}
