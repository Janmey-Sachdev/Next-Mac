
'use client';
import { APPS } from '@/lib/apps';
import { useDesktop } from '@/contexts/DesktopContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AppStore() {
  const { state, dispatch } = useDesktop();
  const { toast } = useToast();
  const { installedApps } = state;

  const coreAppIds = ['finder', 'settings', 'task-manager', 'terminal', 'trash', 'app-store'];
  const appsToShow = APPS.filter(app => !coreAppIds.includes(app.id));

  const handleInstall = (appId: string) => {
    dispatch({ type: 'INSTALL_APP', payload: appId });
    const app = APPS.find(a => a.id === appId);
    toast({
        title: 'App Installed',
        description: `${app?.name} has been successfully installed.`,
    });
  };

  const handleUninstall = (appId: string) => {
    dispatch({ type: 'UNINSTALL_APP', payload: appId });
    const app = APPS.find(a => a.id === appId);
    toast({
        title: 'App Uninstalled',
        description: `${app?.name} has been uninstalled.`,
        variant: 'destructive'
    });
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
            const isInstalled = installedApps.includes(app.id);
            return (
              <div key={app.id} className="flex flex-col items-center justify-between p-4 bg-secondary rounded-lg text-center">
                <div className="flex-grow flex flex-col items-center justify-center">
                    <AppIcon className="w-16 h-16 mb-4 text-primary" />
                    <h2 className="text-lg font-semibold">{app.name}</h2>
                </div>
                {isInstalled ? (
                   <Button onClick={() => handleUninstall(app.id)} variant="destructive" className="mt-4">
                        Uninstall
                    </Button>
                ) : (
                    <Button onClick={() => handleInstall(app.id)} className="mt-4">
                        Install
                    </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
