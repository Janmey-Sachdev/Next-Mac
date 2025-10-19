'use client';
import { useState } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ChangePassword() {
  const { state, dispatch } = useDesktop();
  const { toast } = useToast();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (oldPassword !== state.password) {
      toast({
        title: 'Error',
        description: 'The old password you entered is incorrect.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 4) {
      toast({
        title: 'Error',
        description: 'Password must be at least 4 characters long.',
        variant: 'destructive',
      });
      return;
    }

    dispatch({ type: 'CHANGE_PASSWORD', payload: newPassword });
    toast({
      title: 'Success',
      description: 'Your password has been changed.',
    });
    // Maybe close the dialog here. For now, we'll just clear the fields.
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="old-password" className="text-right">
          Old Password
        </Label>
        <Input
          id="old-password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-password" className="text-right">
          New Password
        </Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="confirm-password" className="text-right">
          Confirm Password
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}
