import DynamicWallpaper from '@/components/system/DynamicWallpaper';

export default function SettingsApp() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">Dynamic Wallpaper</h2>
          <p className="text-muted-foreground mb-4">
            Use AI to generate a unique wallpaper based on a theme.
          </p>
          <DynamicWallpaper />
        </section>
      </div>
    </div>
  );
}
