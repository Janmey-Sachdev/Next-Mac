
'use client';
import { Cpu, MemoryStick, HardDrive } from 'lucide-react';
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
            <p className="text-sm text-muted-foreground">Intel(R) Core(TM) i9-9980HK CPU @ 2.40GHz</p>
          </div>
          <PerformanceChart yLabel="%" color="hsl(var(--primary))" />
        </section>
        <section>
           <div className="flex items-center gap-2 mb-2">
            <MemoryStick className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Memory</h2>
          </div>
          <PerformanceChart yLabel="GB" maxValue={16} color="hsl(210 100% 56%)" />
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
