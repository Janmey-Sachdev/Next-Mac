'use client';
import { useDesktop } from '@/contexts/DesktopContext';
import { Button } from '@/components/ui/button';
import { Upload, FolderPlus, FileText, ImageIcon as ImageIconLucide, Folder as FolderIcon } from 'lucide-react';
import { useRef } from 'react';
import type { File } from '@/lib/apps';

export default function Finder() {
  const { state, dispatch } = useDesktop();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFileAsDataURL = (file: globalThis.File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const desktopFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        let content: string;
        if (file.type.startsWith('image/')) {
          content = await readFileAsDataURL(file);
        } else {
          content = await file.text();
        }
        
        return {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type,
          content: content,
        };
      })
    );

    dispatch({ type: 'ADD_DESKTOP_FILES', payload: desktopFiles });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCreateFolder = () => {
    dispatch({ type: 'CREATE_FOLDER' });
  };
  
  const handleOpenFile = (file: File) => {
    if (file.type === 'folder') return;
    
    let appId = 'writer'; // default
    if (file.type.startsWith('text/')) {
      appId = 'writer';
    } else if (file.type.startsWith('image/')) {
      appId = 'gallery';
    }
    dispatch({ type: 'OPEN', payload: { appId, file } });
  }
  
  const getFileIcon = (file: File) => {
    if (file.type === 'folder') {
        return <FolderIcon className="h-10 w-10 text-primary" />;
    }
    if (file.type.startsWith('image/')) {
      return <ImageIconLucide className="h-10 w-10 text-blue-500" />;
    }
    if (file.type.startsWith('text/')) {
      return <FileText className="h-10 w-10 text-gray-500" />;
    }
    return <FileText className="h-10 w-10 text-gray-500" />;
  }


  return (
    <div className="p-4 h-full flex flex-col">
       <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b">
        <h1 className="text-xl font-bold">Desktop</h1>
        <div className="flex items-center gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                className="hidden"
                accept="image/*, text/*"
            />
            <Button variant="outline" size="sm" onClick={handleUploadClick}>
                <Upload className="mr-2 h-4 w-4" />
                Import File
            </Button>
            <Button variant="outline" size="sm" onClick={handleCreateFolder}>
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
            </Button>
        </div>
      </header>
      <div className="flex-grow pt-4">
        {state.desktopFiles.length === 0 ? (
             <div className="text-center text-muted-foreground">This folder is empty.</div>
        ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {state.desktopFiles.map((file) => (
                <div
                key={file.id}
                className="flex flex-col items-center gap-2 group cursor-pointer w-24 text-center"
                onDoubleClick={() => handleOpenFile(file)}
                >
                <div className="flex items-center justify-center">
                    {getFileIcon(file)}
                </div>
                <span className="text-xs text-foreground font-medium break-words">{file.name}</span>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
