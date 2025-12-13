
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Power, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

interface UEFIScreenProps {
    onRestart: () => void;
}

const BIOSSetting = ({ label, children, focused = false }: { label: string, children: React.ReactNode, focused?: boolean }) => (
    <div className={`flex items-center justify-between py-2 border-b border-gray-700/50 ${focused ? 'bg-blue-800/50 -mx-2 px-2' : ''}`}>
        <label className="text-gray-400">{label}:</label>
        <div className="w-[250px] text-right">
            {children}
        </div>
    </div>
);

const ChipsetConfiguration = ({ onBack }: { onBack: () => void }) => {
     useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onBack();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onBack]);

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Advanced / Chipset Configuration</h3>
            <BIOSSetting label="VT-d">
                <Select defaultValue="enabled">
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                </Select>
            </BIOSSetting>
            <BIOSSetting label="Internal Graphics">
                 <Select defaultValue="auto">
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                </Select>
            </BIOSSetting>
             <BIOSSetting label="Primary Display">
                 <Select defaultValue="auto">
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="igfx">IGFX</SelectItem>
                        <SelectItem value="pcie">PCIE</SelectItem>
                    </SelectContent>
                </Select>
            </BIOSSetting>

            <div className="mt-8 text-center text-sm text-gray-500">
                <p>Press [ESC] to return to previous menu.</p>
            </div>
        </div>
    )
}

export default function UEFIScreen({ onRestart }: UEFIScreenProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [activeTab, setActiveTab] = useState('main');
  const [currentView, setCurrentView] = useState<'main' | 'chipset'>('main');
  const [focusedSetting, setFocusedSetting] = useState(0);

  const advancedSettingsCount = 4; // Number of settings in the Advanced tab

  useEffect(() => {
    const timer = setInterval(() => {
        const now = new Date();
        setTime(now.toLocaleTimeString('en-US', { hour12: false }));
        setDate(now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (currentView !== 'main') return;
          
          if (e.key === 'ArrowDown') {
              e.preventDefault();
              if(activeTab === 'advanced') {
                setFocusedSetting(prev => (prev + 1) % advancedSettingsCount);
              }
          }
          if (e.key === 'ArrowUp') {
              e.preventDefault();
               if(activeTab === 'advanced') {
                setFocusedSetting(prev => (prev - 1 + advancedSettingsCount) % advancedSettingsCount);
              }
          }
          if (e.key === 'Enter' && activeTab === 'advanced' && focusedSetting === 3) {
              setCurrentView('chipset');
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);

  }, [currentView, activeTab, focusedSetting, advancedSettingsCount]);

  // Reset focus when tab changes
  useEffect(() => {
    setFocusedSetting(0);
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(5px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      className="fixed inset-0 bg-gray-800 text-white font-mono z-[10001] p-4 flex items-center justify-center"
    >
        <Card className="w-full max-w-6xl h-[90vh] bg-gray-900/80 backdrop-blur-sm border-blue-500 text-gray-200 flex flex-col">
            <CardHeader className="border-b border-blue-500/50 text-center py-2">
                <CardTitle className="text-xl text-blue-300">
                    NextMac UEFI BIOS Utility
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-grow overflow-hidden">
                {currentView === 'main' ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-7 bg-blue-900/50">
                        <TabsTrigger value="main">Main</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        <TabsTrigger value="peripherals">Peripherals</TabsTrigger>
                        <TabsTrigger value="power">Power</TabsTrigger>
                        <TabsTrigger value="health">PC Health</TabsTrigger>
                        <TabsTrigger value="boot">Boot</TabsTrigger>
                        <TabsTrigger value="exit">Exit</TabsTrigger>
                    </TabsList>

                    <div className="flex-grow mt-4 overflow-y-auto pr-2">
                        <TabsContent value="main" className="space-y-2">
                            <h3 className="text-lg font-semibold text-blue-400 mb-4">System Information</h3>
                             <BIOSSetting label="BIOS Version">
                                <span className="text-white font-semibold">F1.0</span>
                            </BIOSSetting>
                             <BIOSSetting label="Build Date">
                                <span className="text-white font-semibold">05/29/2024</span>
                            </BIOSSetting>
                            <BIOSSetting label="System Date">
                                <span className="text-white font-semibold">{date}</span>
                            </BIOSSetting>
                            <BIOSSetting label="System Time">
                                <span className="text-white font-semibold">{time}</span>
                            </BIOSSetting>
                            <BIOSSetting label="Processor Type">
                                <span className="text-white">Intel(R) Core(TM) i9-9980HK</span>
                            </BIOSSetting>
                            <BIOSSetting label="Processor Speed">
                                <span className="text-white">2.40 GHz</span>
                            </BIOSSetting>
                             <BIOSSetting label="Total Memory">
                                <span className="text-white">16384 MB</span>
                             </BIOSSetting>
                             <BIOSSetting label="SATA Port 1">
                                <span className="text-white">VIRTUAL-HD 1024GB</span>
                            </BIOSSetting>
                             <BIOSSetting label="SATA Port 2">
                                <span className="text-white">VIRTUAL-CD/DVD</span>
                            </BIOSSetting>
                        </TabsContent>

                        <TabsContent value="advanced" className="space-y-2">
                            <h3 className="text-lg font-semibold text-blue-400 mb-4">Advanced BIOS Features</h3>
                             <BIOSSetting label="CPU Virtualization" focused={focusedSetting === 0}>
                                <Select defaultValue="enabled">
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        <SelectItem value="enabled">Enabled</SelectItem>
                                        <SelectItem value="disabled">Disabled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </BIOSSetting>
                             <BIOSSetting label="Hyper-Threading" focused={focusedSetting === 1}>
                                 <Select defaultValue="enabled">
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        <SelectItem value="enabled">Enabled</SelectItem>
                                        <SelectItem value="disabled">Disabled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </BIOSSetting>
                            <BIOSSetting label="XHCI Hand-off" focused={focusedSetting === 2}>
                                 <Select defaultValue="enabled">
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        <SelectItem value="enabled">Enabled</SelectItem>
                                        <SelectItem value="disabled">Disabled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </BIOSSetting>
                             <BIOSSetting label="Chipset Configuration" focused={focusedSetting === 3}>
                                 <span className="text-gray-200 cursor-pointer hover:text-blue-300">Press Enter</span>
                            </BIOSSetting>
                        </TabsContent>

                        <TabsContent value="peripherals" className="space-y-2">
                            <h3 className="text-lg font-semibold text-blue-400 mb-4">Integrated Peripherals</h3>
                             <BIOSSetting label="Onboard LAN Controller">
                                <Select defaultValue="enabled">
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        <SelectItem value="enabled">Enabled</SelectItem>
                                        <SelectItem value="disabled">Disabled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </BIOSSetting>
                              <BIOSSetting label="Onboard Audio Controller">
                                <Select defaultValue="enabled">
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        <SelectItem value="enabled">Enabled</SelectItem>
                                        <SelectItem value="disabled">Disabled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </BIOSSetting>
                             <BIOSSetting label="SATA Mode">
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
                            </BIOSSetting>
                        </TabsContent>
                        
                        <TabsContent value="power" className="space-y-2">
                            <h3 className="text-lg font-semibold text-blue-400 mb-4">Power Management Setup</h3>
                            <BIOSSetting label="ACPI Suspend Type">
                                <Select defaultValue="s3">
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        <SelectItem value="s1">S1 (POS)</SelectItem>
                                        <SelectItem value="s3">S3 (STR)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </BIOSSetting>
                             <BIOSSetting label="Repost Video on S3 Resume">
                                <Select defaultValue="no">
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        <SelectItem value="no">No</SelectItem>
                                        <SelectItem value="yes">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </BIOSSetting>
                        </TabsContent>

                        <TabsContent value="health" className="space-y-2">
                            <h3 className="text-lg font-semibold text-blue-400 mb-4">PC Health Status</h3>
                            <BIOSSetting label="CPU Temperature">
                                <span className="text-green-400">45°C / 113°F</span>
                            </BIOSSetting>
                             <BIOSSetting label="System Temperature">
                                <span className="text-green-400">35°C / 95°F</span>
                            </BIOSSetting>
                            <BIOSSetting label="CPU Fan Speed">
                                <span className="text-white">1500 RPM</span>
                            </BIOSSetting>
                             <BIOSSetting label="Chassis Fan Speed">
                                <span className="text-white">800 RPM</span>
                            </BIOSSetting>
                            <BIOSSetting label="Vcore Voltage">
                                <span className="text-yellow-400">1.250V</span>
                            </BIOSSetting>
                             <BIOSSetting label="DRAM Voltage">
                                <span className="text-yellow-400">1.350V</span>
                            </BIOSSetting>
                             <BIOSSetting label="+3.3V Voltage">
                                <span className="text-yellow-400">3.312V</span>
                            </BIOSSetting>
                             <BIOSSetting label="+5V Voltage">
                                <span className="text-yellow-400">5.025V</span>
                            </BIOSSetting>
                             <BIOSSetting label="+12V Voltage">
                                <span className="text-yellow-400">12.096V</span>
                            </BIOSSetting>
                        </TabsContent>
                        
                        <TabsContent value="boot" className="space-y-2">
                            <h3 className="text-lg font-semibold text-blue-400 mb-4">Boot Options</h3>
                            <BIOSSetting label="Boot Priority #1">
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
                            </BIOSSetting>
                             <BIOSSetting label="Boot Priority #2">
                                <Select defaultValue="usb">
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        <SelectItem value="hd">Hard Drive</SelectItem>
                                        <SelectItem value="usb">USB Device</SelectItem>
                                        <SelectItem value="network">Network Boot</SelectItem>
                                        <SelectItem value="disabled">Disabled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </BIOSSetting>
                             <BIOSSetting label="Boot Priority #3">
                                <Select defaultValue="network">
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        <SelectItem value="hd">Hard Drive</SelectItem>
                                        <SelectItem value="usb">USB Device</SelectItem>
                                        <SelectItem value="network">Network Boot</SelectItem>
                                         <SelectItem value="disabled">Disabled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </BIOSSetting>
                            <BIOSSetting label="Fast Boot">
                                <Select defaultValue="enabled">
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        <SelectItem value="enabled">Enabled</SelectItem>
                                        <SelectItem value="disabled">Disabled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </BIOSSetting>
                             <BIOSSetting label="Full Screen Logo">
                                <Select defaultValue="enabled">
                                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        <SelectItem value="enabled">Enabled</SelectItem>
                                        <SelectItem value="disabled">Disabled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </BIOSSetting>
                        </TabsContent>

                        <TabsContent value="exit" className="space-y-6">
                            <h3 className="text-lg font-semibold text-blue-400">Exit</h3>
                            <p className="text-gray-400">Save your changes or discard and exit setup.</p>
                            <div className="flex justify-start gap-4 pt-4">
                                <Button variant="outline" className="border-blue-400 text-blue-300 hover:bg-blue-900 hover:text-white" onClick={onRestart}>
                                    <Save className="mr-2 h-4 w-4"/>
                                    Save & Exit Setup
                                </Button>
                                <Button variant="destructive" onClick={onRestart}>
                                    <Power className="mr-2 h-4 w-4"/>
                                    Discard Changes & Exit
                                </Button>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
                 ) : currentView === 'chipset' ? (
                    <ChipsetConfiguration onBack={() => setCurrentView('main')} />
                ) : null}
            </CardContent>
        </Card>
    </motion.div>
  );
}
