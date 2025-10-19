'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useDesktop } from '@/contexts/DesktopContext';
import { Loader2 } from 'lucide-react';

export default function ChangePassword() {
  const { savePassword } = useDesktop();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    if (newPassword.length < 4) {
      toast({
        title: 'Password is too short',
        description: 'Password must be at least 4 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call and then reboot
    setTimeout(() => {
        const success = savePassword(currentPassword, newPassword);
        if (success) {
            toast({
                title: 'Password Changed',
                description: 'System will now reboot.',
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
             toast({
                title: 'Incorrect Current Password',
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    }, 1000);
  };

  return (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
       <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save and Reboot
      </Button>
    </div>
  );
}
