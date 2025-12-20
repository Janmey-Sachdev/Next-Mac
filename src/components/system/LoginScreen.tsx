
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useDesktop } from '@/contexts/DesktopContext';

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const { wallpaper } = useDesktop();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onLogin, 500); // Wait for animation
    }, 1500); // Automatically log in after 1.5 seconds
    
    return () => clearTimeout(timer);
  }, [onLogin]);


  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9998] bg-cover bg-center"
          style={{ backgroundImage: `url(${wallpaper})` }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white"
          >
            <div className="bg-white/10 p-8 rounded-full inline-block mb-4">
              <User className="w-16 h-16" />
            </div>
            <h1 className="text-2xl font-semibold mb-4">User Admin</h1>
            <p className="text-white/80">Logging in...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
