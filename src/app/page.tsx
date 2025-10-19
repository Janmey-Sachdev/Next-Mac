'use client';
import { useState } from 'react';
import Desktop from '@/components/system/Desktop';
import BootScreen from '@/components/system/BootScreen';
import LoginScreen from '@/components/system/LoginScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { DesktopProvider } from '@/contexts/DesktopContext';

type SystemState = 'booting' | 'login' | 'desktop';

function App() {
  const [systemState, setSystemState] = useState<SystemState>('booting');

  const handleBooted = () => {
    setSystemState('login');
  };

  const handleLoginSuccess = () => {
    setSystemState('desktop');
  };

  return (
    <>
      <AnimatePresence>
        {systemState === 'booting' && <BootScreen onBooted={handleBooted} />}
      </AnimatePresence>
      
      <AnimatePresence>
        {systemState === 'login' && <LoginScreen onLoginSuccess={handleLoginSuccess} />}
      </AnimatePresence>

      <AnimatePresence>
        {systemState === 'desktop' && (
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


export default function Home() {
    return (
        <DesktopProvider>
            <App />
        </DesktopProvider>
    )
}