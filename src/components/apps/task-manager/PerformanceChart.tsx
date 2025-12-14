
'use client';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const MAX_DATA_POINTS = 30;

type PerformanceData = {
  time: number;
  value: number;
};

interface PerformanceChartProps {
    yLabel: string;
    maxValue?: number;
    color: string;
}

export default function PerformanceChart({ yLabel, maxValue = 100, color }: PerformanceChartProps) {
  const [data, setData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newValue = Math.random() * maxValue;
        const newDataPoint = { time: Date.now(), value: newValue };

        const updatedData = [...prevData, newDataPoint];
        if (updatedData.length > MAX_DATA_POINTS) {
          return updatedData.slice(updatedData.length - MAX_DATA_POINTS);
        }
        return updatedData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [maxValue]);

  const chartConfig = {
    performance: {
      label: 'Usage',
      color: color,
    },
  };

  const domain = [0, maxValue];

  return (
    <div className="h-48 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <defs>
                <linearGradient id={`colorGradient-${yLabel}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
                dataKey="time"
                tickFormatter={(time) => new Date(time).toLocaleTimeString([], { second: '2-digit' })}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={60}
            />
            <YAxis 
                domain={domain} 
                unit={yLabel} 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
            />
            <ChartTooltip
                cursor={false}
                content={
                    <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value, payload) => {
                        return payload[0] ? new Date(payload[0].payload.time).toLocaleTimeString() : '';
                    }}
                    formatter={(value) => [`${(value as number).toFixed(yLabel === '%' ? 0 : 2)} ${yLabel}`, 'Usage']}
                    />
                }
            />
            <Area
                dataKey="value"
                type="monotone"
                fill={`url(#colorGradient-${yLabel})`}
                stroke={color}
                strokeWidth={2}
                dot={false}
            />
        </AreaChart>
        </ChartContainer>
    </div>
  );
}
