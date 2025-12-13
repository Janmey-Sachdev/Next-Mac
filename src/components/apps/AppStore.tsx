
'use client';
import { APPS } from '@/lib/apps';
import { useDesktop } from '@/contexts/DesktopContext';
import { Button } from '@/components/ui/button';

export default function AppStore() {
  const { dispatch } = useDesktop();

  // Exclude core system apps that are always present
  const coreAppIds = ['finder', 'settings', 'task-manager', 'terminal', 'trash', 'app-store'];
  const appsToShow = APPS.filter(app => !coreAppIds.includes(app.id));

  const handleOpenApp = (appId: string) => {
    dispatch({ type: 'OPEN', payload: { appId } });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">App Store</h1>
        <p className="text-muted-foreground">Discover new applications for your desktop.</p>
      </header>
      <div className="flex-grow p-8 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {appsToShow.map(app => {
            const AppIcon = app.icon;
            return (
              <div key={app.id} className="flex flex-col items-center justify-between p-4 bg-secondary rounded-lg text-center">
                <div className="flex-grow flex flex-col items-center justify-center">
                    <AppIcon className="w-16 h-16 mb-4 text-primary" />
                    <h2 className="text-lg font-semibold">{app.name}</h2>
                </div>
                <Button onClick={() => handleOpenApp(app.id)} className="mt-4">
                  Open
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
