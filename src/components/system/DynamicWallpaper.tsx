'use client';

import { useDesktop } from '@/contexts/DesktopContext';
import { getDynamicWallpaper } from '@/ai/flows/dynamic-wallpaper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function DynamicWallpaper() {
  const { setWallpaper } = useDesktop();
  const [theme, setTheme] = useState('serene mountain landscape at sunrise');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!theme) {
      toast({
        title: 'Theme required',
        description: 'Please enter a theme for your wallpaper.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await getDynamicWallpaper({ theme });
      if (result.wallpaperDataUri) {
        setWallpaper(result.wallpaperDataUri);
        toast({
          title: 'Success!',
          description: 'Your new wallpaper has been set.',
        });
      } else {
        throw new Error('AI did not return a wallpaper.');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Generation Failed',
        description:
          'Could not generate wallpaper. Please check the console for errors.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md">
        <div>
            <Label htmlFor="theme-input">Wallpaper Theme</Label>
            <Input
                id="theme-input"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., futuristic cityscape, calm ocean"
            />
        </div>
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Generating...' : 'Generate New Wallpaper'}
      </Button>
    </div>
  );
}
