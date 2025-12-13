'use client';

import { useDesktop } from '@/contexts/DesktopContext';
import TopBar from './TopBar';
import Dock from './Dock';
import Window from './Window';
import { useCallback, useEffect, useState } from 'react';
import AppMenu from './AppMenu';
import type { File } from '@/lib/apps';
import { FileText, Image as ImageIcon, Folder, Video, Music } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


interface DesktopProps {
    onShutdown: () => void;
}

function DesktopInner({ onShutdown }: DesktopProps) {
  const { state, wallpaper, dispatch, setWallpaper } = useDesktop();
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsAppMenuOpen((prev) => !prev);
      }
      if (event.key === 'Escape') {
        setIsAppMenuOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  const handleOpenFile = (file: File) => {
    if (file.type === 'folder') {
        dispatch({ type: 'OPEN', payload: { appId: 'finder' } });
        return;
    }

    let appId = 'writer'; // default
    if (file.type.startsWith('text/')) {
      appId = 'writer';
    } else if (file.type.startsWith('image/')) {
      appId = 'photos';
    } else if (file.type.startsWith('video/')) {
      appId = 'video';
    } else if (file.type.startsWith('audio/')) {
      appId = 'music';
    }
    
    dispatch({ type: 'OPEN', payload: { appId, file } });
  }
  
  const getFileIcon = (file: File) => {
    if (file.type === 'folder') {
        return <Folder className="h-12 w-12 text-white" />;
    }
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-12 w-12 text-white" />;
    }
    if (file.type.startsWith('text/')) {
      return <FileText className="h-12 w-12 text-white" />;
    }
     if (file.type.startsWith('video/')) {
      return <Video className="h-12 w-12 text-white" />;
    }
     if (file.type.startsWith('audio/')) {
      return <Music className="h-12 w-12 text-white" />;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;
  }

  const confirmDelete = () => {
    if (deleteFileId) {
      dispatch({ type: 'DELETE_FILE', payload: deleteFileId });
    }
    setDeleteFileId(null);
  };
  
  useEffect(() => {
    if (state.shutdownInitiated) {
      onShutdown();
    }
  }, [state.shutdownInitiated, onShutdown]);

  return (
    <main
      className="h-screen w-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <TopBar />

      <div className="relative w-full h-full">
        {/* Desktop Icons */}
        <div className="absolute top-10 left-4 h-full">
            <div className="flex flex-col flex-wrap h-[calc(100vh-120px)] gap-x-4">
                {state.desktopFiles.map((file) => (
                    <DropdownMenu key={file.id}>
                      <DropdownMenuTrigger asChild>
                        <div
                            className="flex flex-col items-center gap-2 group cursor-pointer w-24 text-center basis-[110px]"
                            onDoubleClick={() => handleOpenFile(file)}
                        >
                            <div className="p-4 bg-background/50 rounded-2xl shadow-md group-hover:scale-110 transition-transform flex items-center justify-center">
                            {getFileIcon(file)}
                            </div>
                            <span className="text-sm text-white font-medium drop-shadow-md break-words">{file.name}</span>
                        </div>
                      </DropdownMenuTrigger>
                       <DropdownMenuContent onMouseUp={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onSelect={() => handleOpenFile(file)}>Open</DropdownMenuItem>
                          {file.type.startsWith('image/') && (
                            <DropdownMenuItem onSelect={() => setWallpaper(file.content)}>Set as Wallpaper</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => setDeleteFileId(file.id)} className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ))}
            </div>
        </div>

        {state.windows.map((win) => (
          <Window key={win.id} instance={win} />
        ))}
      </div>
      
      <Dock />

      <AppMenu isOpen={isAppMenuOpen} onClose={() => setIsAppMenuOpen(false)} />
      
      <AlertDialog open={!!deleteFileId} onOpenChange={(open) => !open && setDeleteFileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move the file to the Trash. You can restore it from there.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteFileId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

export default function Desktop({ onShutdown }: DesktopProps) {
    return <DesktopInner onShutdown={onShutdown} />;
}
