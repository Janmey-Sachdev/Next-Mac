
'use client';
import { useDesktop } from '@/contexts/DesktopContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { APPS } from '@/lib/apps';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PerformanceView from '@/components/apps/task-manager/PerformanceView';

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
    <div className="h-full flex flex-col bg-background">
       <header className="p-4 border-b">
        <h1 className="text-lg font-bold">Task Manager</h1>
      </header>
      <Tabs defaultValue="processes" className="h-full flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="processes">Processes</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="processes" className="flex-grow overflow-y-auto">
            <div className="p-4 space-y-2">
            <p className="text-sm text-muted-foreground">{windows.length} processes running</p>
            {windows.map(win => {
                const app = getAppFromId(win.appId);
                const AppIcon = app?.icon;
                return (
                <div key={win.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
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
        </TabsContent>
        <TabsContent value="performance" className="flex-grow overflow-y-auto">
          <PerformanceView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
