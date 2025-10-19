'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

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
        return prev + Math.random() * 20;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [onBooted]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-[#000] flex flex-col items-center justify-center z-[9999]"
        >
          <div className="flex-grow flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p className="text-white/80 mt-8 text-sm">Preparing NextMac</p>
          </div>
          <div className="pb-12 text-center">
            <h1 className="text-white text-3xl font-semibold">NextMac</h1>
            <p className="text-white/60 text-sm">Powered By Jan Management System</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
