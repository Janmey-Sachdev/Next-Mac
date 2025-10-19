'use client';
import type { File } from '@/lib/apps';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { editImage } from '@/ai/flows/edit-image-flow';
import { useDesktop } from '@/contexts/DesktopContext';

export default function ImageEditor({ file: initialFile }: { file?: File }) {
  const { dispatch } = useDesktop();
  const [currentFile, setCurrentFile] = useState<File | null>(initialFile || null);
  const [editedImageUri, setEditedImageUri] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset when a new file is opened from the desktop
    setCurrentFile(initialFile || null);
    setEditedImageUri(null);
  }, [initialFile]);

  const handleGenerate = async () => {
    const imageToEdit = currentFile?.content;
    if (!imageToEdit) {
      toast({
        title: 'No Image Loaded',
        description: 'Please open an image file to start editing.',
        variant: 'destructive',
      });
      return;
    }
    if (!prompt) {
      toast({
        title: 'Prompt Required',
        description: 'Please enter an editing instruction.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await editImage({
        imageDataUri: imageToEdit,
        prompt: prompt,
      });

      if (result.editedImageUri) {
        setEditedImageUri(result.editedImageUri);
        toast({
          title: 'Edit Complete!',
          description: 'Your image has been updated.',
        });
      } else {
        throw new Error('AI did not return an edited image.');
      }
    } catch (error: any) {
      console.error(error);
      let description = 'Could not edit the image. The model might be unavailable or the content may have been blocked.';
      if (error.message && error.message.includes('429')) {
        description = 'Too many requests. You have exceeded your API quota. Please wait a moment and try again.';
      }
      toast({
        title: 'Editing Failed',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = () => {
    if (!editedImageUri) return;

    if (currentFile && currentFile.id.startsWith('file-')) {
        // Update existing file from desktop
        dispatch({
            type: 'UPDATE_DESKTOP_FILE',
            payload: { ...currentFile, content: editedImageUri }
        });
        toast({
            title: 'Image Saved',
            description: `${currentFile.name} has been updated.`
        });
    } else {
        // Save as a new file to desktop
        const newFile: File = {
            id: `file-${Date.now()}-${Math.random()}`,
            name: `edited-image-${Date.now()}.png`,
            type: 'image/png', // Assuming PNG output from AI
            content: editedImageUri,
        };
        dispatch({ type: 'ADD_DESKTOP_FILES', payload: [newFile] });
        setCurrentFile(newFile); // Start tracking this new file
        toast({
            title: 'Image Saved',
            description: `${newFile.name} has been saved to your desktop.`
        });
    }
  }

  const handleLoadImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        // Create a temporary file object, it won't be on the desktop until saved
        setCurrentFile({
          id: `local-${Date.now()}`,
          name: file.name,
          type: file.type,
          content: dataUri,
        });
        setEditedImageUri(null); // Clear previous edits
      };
      reader.readAsDataURL(file);
    }
  };

  const displayImage = editedImageUri || currentFile?.content;

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <div className="flex-shrink-0 p-2 border-b flex items-center gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
        <Button onClick={handleLoadImageClick} variant="outline" size="sm" disabled={isLoading}>
            <Upload className="mr-2 h-4 w-4" />
            Load Image
        </Button>
        <Input
          placeholder="e.g., make this black and white, add a cat..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading || !currentFile}
        />
        <Button onClick={handleGenerate} disabled={isLoading || !currentFile}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
        <Button onClick={handleSave} disabled={!editedImageUri} variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save
        </Button>
      </div>
      {displayImage ? (
        <div className="flex-grow flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full h-full">
            <Image
              src={displayImage}
              alt={currentFile?.name || 'edited image'}
              fill
              style={{ objectFit: 'contain' }}
              key={displayImage} // Force re-render on image change
            />
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center text-muted-foreground">
          No image loaded. Load an image to start editing.
        </div>
      )}
    </div>
  );
}
