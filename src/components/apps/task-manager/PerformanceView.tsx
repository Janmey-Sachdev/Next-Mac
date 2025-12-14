
'use client';
import { Cpu, MemoryStick, HardDrive, Server } from 'lucide-react';
import PerformanceChart from './PerformanceChart';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PerformanceView() {

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <section>
          <div className="flex items-baseline gap-2 mb-2">
            <Cpu className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">CPU</h2>
            <p className="text-sm text-muted-foreground">Snapdragon 8 Elite Gen 9</p>
          </div>
          <PerformanceChart yLabel="%" color="hsl(var(--primary))" />
        </section>
        <section>
           <div className="flex items-baseline gap-2 mb-2">
            <MemoryStick className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Memory</h2>
            <p className="text-sm text-muted-foreground">2 Crucial Pro DDR5 UDIMM Desktop RAM Memory 48 GB</p>
          </div>
          <PerformanceChart yLabel="GB" maxValue={48} color="hsl(210 100% 56%)" />
        </section>
         <section>
          <div className="flex items-baseline gap-2 mb-2">
            <Server className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">GPU</h2>
            <p className="text-sm text-muted-foreground">NVIDIA RTX 5900 TI</p>
          </div>
          <PerformanceChart yLabel="%" color="hsl(262.1 83.3% 57.8%)" />
        </section>
        <section>
           <div className="flex items-baseline gap-2 mb-2">
            <HardDrive className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Disk (C:)</h2>
            <p className="text-sm text-muted-foreground">Nimbus Data's ExaDrive DC100 100 GB</p>
          </div>
          <PerformanceChart yLabel="%" color="hsl(142.1 76.2% 36.3%)" />
        </section>
      </div>
    </ScrollArea>
  );
}
