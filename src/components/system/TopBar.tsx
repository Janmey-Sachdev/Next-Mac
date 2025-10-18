'use client';
import { useDesktop } from '@/contexts/DesktopContext';
import { Wifi, Battery, Settings, Volume2 } from 'lucide-react';
import Clock from './Clock';
import { AppleLogo } from './AppleLogo';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

export default function TopBar() {
  const { state, apps, dispatch } = useDesktop();
  const [volume, setVolume] = useState(50);

  const focusedApp = state.focusedWindow
    ? apps.find(
        (app) => app.id === state.windows.find((w) => w.id === state.focusedWindow)?.appId
      )
    : null;

  const openSettings = () => {
    dispatch({ type: 'OPEN', payload: { appId: 'settings' } });
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-8 bg-background/30 backdrop-blur-2xl flex items-center justify-between px-4 text-sm font-medium text-foreground z-[2000] shadow-md">
      <div className="flex items-center gap-4">
        <AppleLogo className="text-foreground fill-current" size={20} />
        <span className="font-semibold">
          {focusedApp ? focusedApp.name : 'Finder'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger>
            <Volume2 className="h-4 w-4" />
          </PopoverTrigger>
          <PopoverContent className="w-48 mr-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Sound</h4>
              <Slider
                defaultValue={[volume]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
              />
            </div>
          </PopoverContent>
        </Popover>
        <button onClick={openSettings}>
          <Settings className="h-4 w-4" />
        </button>
        <Battery className="h-4 w-4" />
        <Wifi className="h-4 w-4" />
        <Clock />
      </div>
    </header>
  );
}
