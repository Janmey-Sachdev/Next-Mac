'use client';
import { useDesktop } from '@/contexts/DesktopContext';
import { AnimatePresence, motion } from 'framer-motion';
import AppIcon from './AppIcon';

interface AppMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppMenu({ isOpen, onClose }: AppMenuProps) {
  const { apps, state, dispatch } = useDesktop();
  const { installedApps } = state;

  const handleAppClick = (appId: string) => {
    dispatch({ type: 'OPEN', payload: { appId } });
    onClose();
  };

  const appsToShow = apps.filter(app => installedApps.includes(app.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-2xl z-[2100]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="grid grid-cols-6 gap-8 p-16 max-w-4xl mx-auto mt-32"
            onClick={(e) => e.stopPropagation()}
          >
            {appsToShow.map((app) => (
              <AppIcon
                key={app.id}
                app={app}
                onClick={() => handleAppClick(app.id)}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
