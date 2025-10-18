'use client';
import { useRef } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { Button } from '@/components/ui/button';
import { Upload, FolderPlus } from 'lucide-react';

export default function Computer() {
  const { dispatch } = useDesktop();
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

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Computer</h1>
      <p className="text-muted-foreground mb-6">
        Manage files and folders on your desktop.
      </p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
        accept="image/*, text/*"
      />
      <div className="flex justify-center gap-4">
        <Button onClick={handleUploadClick}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
        <Button variant="outline" onClick={handleCreateFolder}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Create Folder
        </Button>
      </div>
    </div>
  );
}
