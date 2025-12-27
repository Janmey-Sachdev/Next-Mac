'use client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PreInstallScreenProps {
  onContinue: () => void;
}

export default function PreInstallScreen({ onContinue }: PreInstallScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900 text-white flex flex-col items-center justify-center z-[10000]"
    >
      <div className="text-center p-8 max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Important Notice</h1>
        <p className="text-lg text-gray-300 mb-8">
          This Is A Website That is Published Using, So The Website Might Stop Working.
        </p>
        <Button onClick={onContinue} size="lg">
          Continue Installation
        </Button>
      </div>
    </motion.div>
  );
}
