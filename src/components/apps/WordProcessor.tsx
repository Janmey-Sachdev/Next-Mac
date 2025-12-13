
'use client';
import { Textarea } from '@/components/ui/textarea';
import type { File } from '@/lib/apps';
import { useDesktop } from '@/contexts/DesktopContext';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';


export default function WordProcessor({ file }: { file?: File }) {
  const { dispatch } = useDesktop();
  const [content, setContent] = useState(file?.content || '');
  // Keep track of the currently edited file internally.
  const [currentFile, setCurrentFile] = useState<File | undefined>(file);

  useEffect(() => {
    // When a different file is opened from outside (e.g., desktop), update the view.
    if (file) {
      setContent(file.content);
      setCurrentFile(file);
    }
  }, [file]);
  
  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    if (currentFile && debouncedContent !== currentFile.content) {
        // This is a mock save. We are updating the file in our global state.
        // In a real app, this would be an API call.
        dispatch({
            type: 'UPDATE_DESKTOP_FILE',
            payload: { ...currentFile, content: debouncedContent },
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent, currentFile, dispatch]);


  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleCreateNewFile = () => {
    const newFile: File = {
      id: `file-${Date.now()}-${Math.random()}`,
      name: `document-${Date.now()}.txt`,
      type: 'text/plain',
      content: '',
    };
    dispatch({ type: 'ADD_DESKTOP_FILES', payload: [newFile] });
    // Set the new file as the current one for editing
    setCurrentFile(newFile);
    setContent('');
  };


  if (!currentFile) {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-background text-muted-foreground">
            <p className="mb-4">Create or open a text file to start writing.</p>
            <Button onClick={handleCreateNewFile}>
                <FilePlus className="mr-2 h-4 w-4" />
                Create New File
            </Button>
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
