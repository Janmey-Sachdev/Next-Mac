'use client';
import type { File } from '@/lib/apps';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { editImage } from '@/ai/flows/edit-image-flow';
import { useDesktop } from '@/contexts/DesktopContext';

export default function ImageEditor({ file }: { file?: File }) {
  const { dispatch } = useDesktop();
  const [editedImageUri, setEditedImageUri] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Reset edited image when a new file is opened
    setEditedImageUri(null);
  }, [file]);

  const handleGenerate = async () => {
    if (!file || !file.content) {
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
        imageDataUri: file.content,
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
    } catch (error) {
      console.error(error);
      toast({
        title: 'Editing Failed',
        description: 'Could not edit the image. The model might be unavailable or the content may have been blocked.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = () => {
    if (file && editedImageUri) {
        dispatch({
            type: 'UPDATE_DESKTOP_FILE',
            payload: { ...file, content: editedImageUri }
        });
        toast({
            title: 'Image Saved',
            description: `${file.name} has been updated.`
        });
    }
  }

  const displayImage = editedImageUri || file?.content;

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <div className="flex-shrink-0 p-2 border-b flex items-center gap-2">
        <Input
          placeholder="e.g., make this black and white, add a cat..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading || !file}
        />
        <Button onClick={handleGenerate} disabled={isLoading || !file}>
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
              alt={file?.name || 'edited image'}
              fill
              style={{ objectFit: 'contain' }}
              key={displayImage} // Force re-render on image change
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
