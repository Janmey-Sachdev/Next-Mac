'use client';
import { useState, useEffect } from 'react';
import Desktop from '@/components/system/Desktop';
import BootScreen from '@/components/system/BootScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { DesktopProvider } from '@/contexts/DesktopContext';
import ShutdownScreen from '@/components/system/ShutdownScreen';
import LoginScreen from '@/components/system/LoginScreen';
import InstallationScreen from '@/components/system/InstallationScreen';
import EmergencyMode from '@/components/system/EmergencyMode';
import BiosScreen from '@/components/system/BiosScreen';
import UEFIScreen from '@/components/system/UEFIScreen';


type SystemState = 'installing' | 'booting' | 'login' | 'desktop' | 'shutdown' | 'emergency' | 'bios' | 'uefi';

function App() {
  const [systemState, setSystemState] = useState<SystemState>('booting');

  useEffect(() => {
    const isInstalled = localStorage.getItem('nextmac_installed') === 'true';
    setSystemState(isInstalled ? 'booting' : 'installing');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSystemState('emergency');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const handleInstalled = () => {
    localStorage.setItem('nextmac_installed', 'true');
    setSystemState('booting');
  };
  
  const handleBooted = () => {
    setSystemState('login');
  };
  
  const handleLogin = () => {
    setSystemState('desktop');
  };
  
  const handleShutdown = () => {
    setSystemState('shutdown');
  }
  
  const handleRestart = () => {
    window.location.reload();
  }

  const enterBios = () => {
    setSystemState('bios');
  }

  const enterUefi = () => {
    setSystemState('uefi');
  }

  const exitEmergency = () => {
    setSystemState('login');
  }

  return (
    <>
      <AnimatePresence>
        {systemState === 'installing' && <InstallationScreen onInstalled={handleInstalled} />}
      </AnimatePresence>

      <AnimatePresence>
        {systemState === 'booting' && <BootScreen onBooted={handleBooted} />}
      </AnimatePresence>
      
      <AnimatePresence>
        {systemState === 'login' && <LoginScreen onLogin={handleLogin} />}
      </AnimatePresence>
      
      <AnimatePresence>
        {systemState === 'desktop' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Desktop onShutdown={handleShutdown} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {systemState === 'shutdown' && <ShutdownScreen onRestart={handleRestart} />}
      </AnimatePresence>

      <AnimatePresence>
        {systemState === 'emergency' && (
            <EmergencyMode
                onRestart={handleRestart}
                onShutdown={handleShutdown}
                onBios={enterBios}
                onExit={exitEmergency}
            />
        )}
      </AnimatePresence>

       <AnimatePresence>
        {systemState === 'bios' && <BiosScreen onRestart={handleRestart} onEnterUefi={enterUefi} />}
      </AnimatePresence>

      <AnimatePresence>
        {systemState === 'uefi' && <UEFIScreen onRestart={handleRestart} />}
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
