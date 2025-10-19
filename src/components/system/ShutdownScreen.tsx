'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ShutdownScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white z-[9999]"
    >
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Your Computer Is Safe To Shutdown.</h1>
        <Button onClick={onRestart} variant="outline" className="bg-transparent hover:bg-white/10 text-white">
          Start Again
        </Button>
      </div>
    </motion.div>
  );
}
