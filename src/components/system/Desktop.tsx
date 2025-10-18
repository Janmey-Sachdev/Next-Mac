'use client';

import { DesktopProvider, useDesktop } from '@/contexts/DesktopContext';
import TopBar from './TopBar';
import Dock from './Dock';
import Window from './Window';
import { useCallback, useEffect, useState } from 'react';
import AppMenu from './AppMenu';
import { cn } from '@/lib/utils';
import AppIcon from './AppIcon';
import type { File } from '@/lib/apps';
import { FileText, Image as ImageIcon } from 'lucide-react';

function DesktopInner() {
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
    let appId = 'writer'; // default
    if (file.type.startsWith('text/')) {
      appId = 'writer';
    } else if (file.type.startsWith('image/')) {
      appId = 'gallery';
    }
    // Could add more associations here, e.g. for spreadsheets
    
    dispatch({ type: 'OPEN', payload: { appId, file } });
  }
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-12 w-12 text-white" />;
    }
    if (fileType.startsWith('text/')) {
      return <FileText className="h-12 w-12 text-white" />;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;
  }


  return (
    <main
      className="h-screen w-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <TopBar />

      <div className="relative w-full h-full">
        {/* Desktop Icons */}
        <div className="absolute top-12 left-4 grid grid-cols-1 gap-4">
          {state.desktopFiles.map((file) => (
             <div
              key={file.id}
              className="flex flex-col items-center gap-2 group cursor-pointer w-24 text-center"
              onDoubleClick={() => handleOpenFile(file)}
            >
              <div className="p-4 bg-background/50 rounded-2xl shadow-md group-hover:scale-110 transition-transform flex items-center justify-center">
                {getFileIcon(file.type)}
              </div>
              <span className="text-sm text-white font-medium drop-shadow-md break-words">{file.name}</span>
            </div>
          ))}
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

export default function Desktop() {
  return (
    <DesktopProvider>
      <DesktopInner />
    </DesktopProvider>
  );
}
