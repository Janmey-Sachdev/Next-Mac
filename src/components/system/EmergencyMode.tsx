'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Power, RefreshCw, HardDrive, ShieldAlert, LogOut } from 'lucide-react';

interface EmergencyModeProps {
  onRestart: () => void;
  onShutdown: () => void;
  onBios: () => void;
  onExit: () => void;
}

export default function EmergencyMode({ onRestart, onShutdown, onBios, onExit }: EmergencyModeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-blue-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-white z-[9999]"
    >
      <div className="text-center p-8 border-2 border-blue-400 rounded-lg bg-blue-900/50">
        <div className="flex items-center justify-center gap-4 mb-6">
            <ShieldAlert className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl font-bold tracking-wider">Emergency Mode</h1>
        </div>
        <p className="text-blue-200 mb-8">Select an option to continue.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button onClick={onRestart} size="lg" variant="outline" className="bg-transparent hover:bg-blue-700 text-white h-24 flex-col gap-2">
            <RefreshCw className="w-8 h-8" />
            <span>Restart</span>
          </Button>
          <Button onClick={onShutdown} size="lg" variant="outline" className="bg-transparent hover:bg-red-700 text-white h-24 flex-col gap-2">
            <Power className="w-8 h-8" />
            <span>Shutdown</span>
          </Button>
          <Button onClick={onBios} size="lg" variant="outline" className="bg-transparent hover:bg-green-700 text-white h-24 flex-col gap-2">
            <HardDrive className="w-8 h-8" />
            <span>BIOS Mode</span>
          </Button>
        </div>

        <Button onClick={onExit} variant="link" className="text-blue-300 mt-12">
            <LogOut className="mr-2 h-4 w-4"/>
            Exit Emergency Mode
        </Button>
      </div>
    </motion.div>
  );
}
