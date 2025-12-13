
'use client';
import { useDesktop } from '@/contexts/DesktopContext';
import AppIcon from './AppIcon';
import { Separator } from '@/components/ui/separator';
import { useRef, useState } from 'react';

export default function Dock() {
  const { apps, state, dispatch } = useDesktop();
  const dockRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const openAppIds = new Set(state.windows.map((w) => w.appId));

  const pinnedAndOpenApps = apps.filter(app => state.pinnedApps.includes(app.id) || openAppIds.has(app.id));

  return (
    <footer
      className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[1900]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        ref={dockRef}
        className="flex items-end h-20 justify-center gap-2 p-2 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg"
      >
        {pinnedAndOpenApps.map((app) => (
          <AppIcon
            key={app.id}
            app={app}
            onClick={() => dispatch({ type: 'OPEN', payload: { appId: app.id } })}
            isOpen={openAppIds.has(app.id)}
            isDock
            isHovered={hovered}
          />
        ))}
      </div>
    </footer>
  );
}
