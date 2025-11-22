'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { AppleLogo } from './AppleLogo';

export default function InstallationScreen({ onInstalled }: { onInstalled: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [statusText, setStatusText] = useState('Preparing installation...');

  useEffect(() => {
    const statuses = [
        'Copying files...',
        'Installing features...',
        'Configuring settings...',
        'Finalizing installation...',
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        
        if (newProgress > 25 && newProgress < 50) setStatusText(statuses[1]);
        else if (newProgress > 50 && newProgress < 75) setStatusText(statuses[2]);
        else if (newProgress > 75) setStatusText(statuses[3]);


        if (newProgress >= 100) {
          clearInterval(timer);
          setStatusText('Installation complete. Restarting...');
          setTimeout(() => {
            setVisible(false);
            setTimeout(onInstalled, 500);
          }, 1500);
          return 100;
        }
        return newProgress;
      });
    }, 600);

    return () => clearInterval(timer);
  }, [onInstalled]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-[#000] flex flex-col items-center justify-center z-[9999]"
        >
          <div className="text-center">
             <div className="inline-block">
                <AppleLogo className="fill-white" size={100}/>
             </div>
            <h1 className="text-white text-4xl font-light mt-8">Welcome to NextMac</h1>
            <p className="text-white/70 mt-2">The installation will begin shortly.</p>
          </div>
          
          <div className="w-full max-w-sm absolute bottom-24 text-center">
            <Progress value={progress} className="h-2" />
            <p className="text-white/80 mt-4 text-sm">{statusText}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
