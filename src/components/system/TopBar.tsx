'use client';
import { useDesktop } from '@/contexts/DesktopContext';
import { Wifi, Battery } from 'lucide-react';
import Clock from './Clock';
import { AppleLogo } from './AppleLogo';


export default function TopBar() {
  const { state, apps } = useDesktop();

  const focusedApp = state.focusedWindow
    ? apps.find((app) => app.id === state.windows.find(w => w.id === state.focusedWindow)?.appId)
    : null;

  return (
    <header className="fixed top-0 left-0 right-0 h-8 bg-background/30 backdrop-blur-2xl flex items-center justify-between px-4 text-sm font-medium text-foreground z-[2000] shadow-md">
      <div className="flex items-center gap-4">
        <AppleLogo className="text-foreground fill-current" size={20} />
        <span className="font-semibold">
          {focusedApp ? focusedApp.name : 'Finder'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Battery className="h-4 w-4" />
        <Wifi className="h-4 w-4" />
        <Clock />
      </div>
    </header>
  );
}
