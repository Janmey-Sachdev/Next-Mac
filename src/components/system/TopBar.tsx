'use client';
import { useDesktop } from '@/contexts/DesktopContext';
import { Wifi, Battery, Settings, Volume2, VolumeX } from 'lucide-react';
import Clock from './Clock';
import { AppleLogo } from './AppleLogo';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { useSound } from '@/contexts/SoundContext';

export default function TopBar() {
  const { state, apps, dispatch } = useDesktop();
  const { volume, setVolume, isMuted, toggleMute } = useSound();

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
          <PopoverTrigger asChild>
             <button onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 mr-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Sound</h4>
              <Slider
                defaultValue={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0] / 100)}
                disabled={isMuted}
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
