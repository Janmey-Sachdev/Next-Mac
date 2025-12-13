'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BiosScreenProps {
  onRestart: () => void;
  onEnterUefi: () => void;
}

const BIOS_TEXT = `
Phoenix - AwardBIOS v6.00PG, An Energy Star Ally
Copyright (C) 1984-2023, Phoenix Technologies, LTD

Main Processor : Intel(R) Core(TM) i9-9980HK CPU @ 2.40GHz
Memory Testing : 16384M OK

Primary Master : VIRTUAL-HD 1024GB
Primary Slave  : None
Secondary Master : VIRTUAL-CD/DVD
Secondary Slave  : None

Press B to enter UEFI SETUP, F12 for boot menu...

Initializing USB Controllers .. Done
16384MB OK


Booting from Hard Disk...
`;

export default function BiosScreen({ onRestart, onEnterUefi }: BiosScreenProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [showRebootMessage, setShowRebootMessage] = useState(false);
    
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(BIOS_TEXT.slice(0, i));
            i++;
            if (i > BIOS_TEXT.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setShowRebootMessage(true);
                }, 1000);
            }
        }, 10);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(showRebootMessage) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key.toLowerCase() === 'r') {
                    onRestart();
                }
                if (e.key.toLowerCase() === 'b') {
                    onEnterUefi();
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [showRebootMessage, onRestart, onEnterUefi]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#000080] text-[#FFFFFF] font-mono text-lg p-8 z-[10000]"
    >
      <pre className="whitespace-pre-wrap">{displayedText}</pre>
      {showRebootMessage && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="mt-4">
            <p>System Check Complete. All systems nominal.</p>
            <p className="bg-white text-blue-800 p-1 mt-2 inline-block">Press 'R' to Restart or 'B' to enter UEFI setup.</p>
          </motion.div>
      )}
    </motion.div>
  );
}
