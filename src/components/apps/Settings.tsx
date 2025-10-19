import DynamicWallpaper from '@/components/system/DynamicWallpaper';
import ChangePassword from '@/components/system/ChangePassword';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { Separator } from '@/components/ui/separator';

export default function SettingsApp() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">Appearance</h2>
           <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
        </section>
        <Separator />
        <section>
          <h2 className="text-lg font-semibold mb-2">Dynamic Wallpaper</h2>
          <p className="text-muted-foreground mb-4">
            Use AI to generate a unique wallpaper based on a theme.
          </p>
          <DynamicWallpaper />
        </section>
        <Separator />
        <section>
          <h2 className="text-lg font-semibold mb-2">Security</h2>
           <p className="text-muted-foreground mb-4">
            Change your login password. The system will reboot after saving.
          </p>
          <ChangePassword />
        </section>
      </div>
    </div>
  );
}
