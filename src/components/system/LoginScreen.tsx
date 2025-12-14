
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, User } from 'lucide-react';
import { useDesktop } from '@/contexts/DesktopContext';
import { useToast } from '@/hooks/use-toast';

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const { wallpaper, state } = useDesktop();
  const { toast } = useToast();
  const [show, setShow] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === state.password) {
        setShow(false);
        setTimeout(onLogin, 500); // Wait for animation
    } else {
        toast({
            title: 'Incorrect Password',
            description: 'The password you entered is not correct.',
            variant: 'destructive',
        });
        setPassword('');
    }
  };

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
            <form onSubmit={handleLogin} className="flex items-center gap-2 max-w-xs mx-auto">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 text-center"
                autoFocus
              />
              <Button type="submit" size="icon" variant="ghost" className="hover:bg-white/20">
                <ArrowRight />
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
