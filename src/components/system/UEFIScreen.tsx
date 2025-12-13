'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { HardDrive, Power, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface UEFIScreenProps {
    onRestart: () => void;
}

export default function UEFIScreen({ onRestart }: UEFIScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(5px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      className="fixed inset-0 bg-gray-800 text-white font-mono z-[10001] p-8 flex items-center justify-center"
    >
        <Card className="w-full max-w-4xl bg-gray-900/80 backdrop-blur-sm border-blue-500 text-gray-200">
            <CardHeader className="border-b border-blue-500/50">
                <CardTitle className="text-2xl text-center text-blue-300">
                    NextMac UEFI BIOS Utility
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-blue-400">System Configuration</h3>
                    <div className="flex items-center justify-between">
                        <label>SATA Mode:</label>
                        <Select defaultValue="ahci">
                            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                <SelectItem value="ahci">AHCI</SelectItem>
                                <SelectItem value="raid">RAID</SelectItem>
                                <SelectItem value="ide">IDE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="flex items-center justify-between">
                        <label>Virtualization:</label>
                        <Select defaultValue="enabled">
                            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                <SelectItem value="enabled">Enabled</SelectItem>
                                <SelectItem value="disabled">Disabled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator orientation="vertical" className="hidden md:block bg-blue-500/50" />
                
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-blue-400">Boot Options</h3>
                    <div className="flex items-center justify-between">
                        <label>Boot Priority #1:</label>
                         <Select defaultValue="hd">
                            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                <SelectItem value="hd">Hard Drive</SelectItem>
                                <SelectItem value="usb">USB Device</SelectItem>
                                <SelectItem value="network">Network Boot</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <label>Fast Boot:</label>
                         <Select defaultValue="enabled">
                            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                <SelectItem value="enabled">Enabled</SelectItem>
                                <SelectItem value="disabled">Disabled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 pt-6 flex justify-end gap-4 border-t border-blue-500/50">
                    <Button variant="outline" className="border-blue-400 text-blue-300 hover:bg-blue-900 hover:text-white" onClick={onRestart}>
                        <Save className="mr-2 h-4 w-4"/>
                        Save & Exit
                    </Button>
                     <Button variant="destructive" onClick={onRestart}>
                        <Power className="mr-2 h-4 w-4"/>
                        Discard & Exit
                    </Button>
                </div>
            </CardContent>
        </Card>
    </motion.div>
  );
}
