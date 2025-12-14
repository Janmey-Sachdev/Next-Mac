'use client';
import { Textarea } from '@/components/ui/textarea';
import type { File } from '@/lib/apps';
import { useDesktop } from '@/contexts/DesktopContext';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

export default function CodeEditor({ file }: { file?: File }) {
  const { dispatch } = useDesktop();
  const [content, setContent] = useState(file?.content || '');
  const [currentFile, setCurrentFile] = useState<File | undefined>(file);

  useEffect(() => {
    if (file) {
      setContent(file.content);
      setCurrentFile(file);
    }
  }, [file]);
  
  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    if (currentFile && debouncedContent !== currentFile.content) {
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
      name: `script-${Date.now()}.js`,
      type: 'application/javascript',
      content: '',
    };
    dispatch({ type: 'ADD_DESKTOP_FILES', payload: [newFile] });
    setCurrentFile(newFile);
    setContent('');
  };


  if (!currentFile) {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-900 text-muted-foreground">
            <p className="mb-4">Create or open a file to start coding.</p>
            <Button onClick={handleCreateNewFile}>
                <FilePlus className="mr-2 h-4 w-4" />
                Create New File
            </Button>
        </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
        <div className="flex-grow p-2 bg-[#1e1e1e]">
            <Textarea 
                className="w-full h-full resize-none border-0 rounded-none focus-visible:ring-0 bg-transparent font-mono text-sm text-gray-200 p-4" 
                placeholder="Start coding..."
                value={content}
                onChange={handleContentChange}
            />
        </div>
    </div>
  );
}
