'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, VideoOff } from 'lucide-react';
import { useDesktop } from '@/contexts/DesktopContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Camera() {
  const { dispatch } = useDesktop();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if(videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }

  }, [toast]);

  const takePicture = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUri = canvas.toDataURL('image/png');

    const newFile = {
      id: `file-${Date.now()}-${Math.random()}`,
      name: `photo-${Date.now()}.png`,
      type: 'image/png',
      content: dataUri,
    };

    dispatch({ type: 'ADD_DESKTOP_FILES', payload: [newFile] });
    toast({
      title: 'Photo Saved',
      description: `${newFile.name} has been saved to your desktop.`,
    });
  };

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="relative flex-grow flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
         {hasCameraPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4">
                <VideoOff className="w-16 h-16 text-muted-foreground mb-4" />
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        This app needs permission to use your camera. Please check your browser settings and allow access.
                    </AlertDescription>
                </Alert>
            </div>
        )}
         {hasCameraPermission === null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 text-white">
                Requesting camera permission...
            </div>
        )}
      </div>
      <div className="flex-shrink-0 p-4 border-t border-white/20 bg-black/50 flex justify-center">
        <Button
          size="lg"
          className="h-12"
          onClick={takePicture}
          disabled={!hasCameraPermission}
        >
          <CameraIcon className="w-6 h-6 mr-2" />
          Take Photo
        </Button>
      </div>
    </div>
  );
}
