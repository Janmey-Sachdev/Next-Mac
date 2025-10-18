'use client';
import { useRef } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export default function Computer() {
  const { dispatch } = useDesktop();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const desktopFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        const content = await file.text();
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

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Computer</h1>
      <p className="text-muted-foreground mb-6">
        Import files from your local machine to the desktop.
      </p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
      />
      <Button onClick={handleUploadClick}>
        <Upload className="mr-2 h-4 w-4" />
        Upload Files
      </Button>
    </div>
  );
}
