'use client';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { AppleLogo } from './AppleLogo';
import { AnimatePresence, motion } from 'framer-motion';

export default function BootScreen({ onBooted }: { onBooted: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setVisible(false);
            setTimeout(onBooted, 500);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [onBooted]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]"
        >
          <AppleLogo className="mb-8" size={100} />
          <div className="w-48">
            <Progress value={progress} className="h-1 bg-gray-700" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
