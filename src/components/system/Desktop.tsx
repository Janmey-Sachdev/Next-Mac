'use client';

import { DesktopProvider, useDesktop } from '@/contexts/DesktopContext';
import TopBar from './TopBar';
import Dock from './Dock';
import Window from './Window';
import { useCallback, useEffect, useState } from 'react';
import AppMenu from './AppMenu';
import { cn } from '@/lib/utils';

function DesktopInner() {
  const { state, wallpaper } = useDesktop();
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

  return (
    <main
      className="h-screen w-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <TopBar />

      <div className="relative w-full h-full">
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
