'use client';
import type { App } from '@/lib/apps';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AppIconProps {
  app: App;
  onClick: () => void;
  isOpen?: boolean;
  isDock?: boolean;
  isHovered?: boolean;
  className?: string;
}

export default function AppIcon({
  app,
  onClick,
  isOpen = false,
  isDock = false,
  className,
}: AppIconProps) {
  if (isDock) {
    return (
      <motion.div
        className={cn('flex flex-col items-center gap-1 group', className)}
        whileHover={{ y: -10, scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <button
          onClick={onClick}
          className="aspect-square transition-all duration-200"
          title={app.name}
        >
          <app.icon className="w-12 h-12 drop-shadow-lg" />
        </button>
        {isOpen && <div className="h-1 w-1 bg-foreground/70 rounded-full" />}
      </motion.div>
    );
  }

  return (
    <div
      className={cn('flex flex-col items-center gap-2 group cursor-pointer', className)}
      onClick={onClick}
    >
      <div className="p-4 bg-background/50 rounded-2xl shadow-md group-hover:scale-110 transition-transform">
        <app.icon className="w-12 h-12" />
      </div>
      <span className="text-sm text-white font-medium drop-shadow-md">{app.name}</span>
    </div>
  );
}
