'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';
import { useDesktop } from '@/contexts/DesktopContext';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { wallpaper, getStoredPassword } = useDesktop();
  const { toast } = useToast();

  const handleLogin = () => {
    const storedPassword = getStoredPassword();
    if (password === storedPassword) {
      onLoginSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      toast({
        title: 'Incorrect Password',
        variant: 'destructive',
      });
      setPassword('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const variants = {
    initial: {
      y: 0,
    },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center z-[9998]"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-2xl" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-4"
          variants={variants}
          animate={error ? 'shake' : 'initial'}
        >
          <Avatar className="w-24 h-24 border-4 border-white/50">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-medium text-white drop-shadow-md">
            Admin User
          </h2>
          <div className="relative w-64">
            <Input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-black/40 text-white placeholder:text-white/60 border-white/20 h-10 pl-4 pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
              onClick={handleLogin}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
