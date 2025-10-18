
'use client';
import { useDesktop } from '@/contexts/DesktopContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { APPS } from '@/lib/apps';

export default function TaskManager() {
  const { state, dispatch } = useDesktop();
  const { windows } = state;

  const getAppFromId = (appId: string) => {
    return APPS.find(app => app.id === appId);
  }

  const handleCloseWindow = (windowId: string) => {
    dispatch({ type: 'CLOSE', payload: windowId });
  };

  return (
    <div className="h-full flex flex-col bg-background/80">
      <header className="p-4 border-b border-white/10">
        <h1 className="text-lg font-bold">Task Manager</h1>
        <p className="text-sm text-muted-foreground">{windows.length} processes running</p>
      </header>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-2">
          {windows.map(win => {
            const app = getAppFromId(win.appId);
            const AppIcon = app?.icon;
            return (
              <div key={win.id} className="flex items-center justify-between p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-3">
                  {AppIcon && <AppIcon className="w-6 h-6" />}
                  <span className="font-medium">{win.title}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCloseWindow(win.id)} title={`Close ${win.title}`}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
