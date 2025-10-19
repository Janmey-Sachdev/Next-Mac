'use client';

import { useDesktop } from '@/contexts/DesktopContext';
import TopBar from './TopBar';
import Dock from './Dock';
import Window from './Window';
import { useCallback, useEffect, useState } from 'react';
import AppMenu from './AppMenu';
import type { File } from '@/lib/apps';
import { FileText, Image as ImageIcon, Folder } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface DesktopProps {
    onShutdown: () => void;
}

function DesktopInner({ onShutdown }: DesktopProps) {
  const { state, wallpaper, dispatch } = useDesktop();
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);

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
        // Maybe open finder to this folder path in the future?
        // For now, let's open the Finder app as a default action.
        dispatch({ type: 'OPEN', payload: { appId: 'finder' } });
        return;
    }

    let appId = 'writer'; // default
    if (file.type.startsWith('text/')) {
      appId = 'writer';
    } else if (file.type.startsWith('image/')) {
      appId = 'gallery';
    }
    // Could add more associations here, e.g. for spreadsheets
    
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
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;
  }

  const handleDeleteFile = (fileId: string) => {
    dispatch({ type: 'TRASH_FILE', payload: fileId });
  }
  
  useEffect(() => {
    const handleShutdownEvent = () => onShutdown();
    dispatch({ type: 'REGISTER_SHUTDOWN', payload: handleShutdownEvent });
  }, [dispatch, onShutdown])

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
                       <DropdownMenuContent>
                          <DropdownMenuItem onSelect={() => handleOpenFile(file)}>Open</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleDeleteFile(file.id)}>Move to Trash</DropdownMenuItem>
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
    </main>
  );
}

export default function Desktop({ onShutdown }: DesktopProps) {
    return <DesktopInner onShutdown={onShutdown} />;
}
