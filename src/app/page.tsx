'use client';
import { useState } from 'react';
import Desktop from '@/components/system/Desktop';
import BootScreen from '@/components/system/BootScreen';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      <BootScreen onBooted={() => setBooted(true)} />
      <AnimatePresence>
        {booted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Desktop />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
