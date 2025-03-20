
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';
import { Button } from '@/components/ui/button';

type UsageGraphProps = {
  data: Array<{ date: string; usage: number }>;
  className?: string;
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-gas-blue font-medium">
          {`${payload[0].value} cubic ft`}
        </p>
      </div>
    );
  }

  return null;
};

const UsageGraph: React.FC<UsageGraphProps> = ({ data, className }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  const getChartColor = () => {
    return '#007AFF'; // gas-blue
  };

  const filterDataByTimeRange = () => {
    // In a real application, you would filter data based on timeRange
    return data;
  };

  const displayData = filterDataByTimeRange();

  return (
    <div className={cn('p-6 dashboard-card', className)}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Usage History</h3>
        <div className="flex space-x-1">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('week')}
            className={timeRange === 'week' ? 'bg-gas-blue hover:bg-gas-blue/90' : ''}
          >
            Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('month')}
            className={timeRange === 'month' ? 'bg-gas-blue hover:bg-gas-blue/90' : ''}
          >
            Month
          </Button>
          <Button
            variant={timeRange === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('year')}
            className={timeRange === 'year' ? 'bg-gas-blue hover:bg-gas-blue/90' : ''}
          >
            Year
          </Button>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={displayData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.8} />
                <stop offset="95%" stopColor={getChartColor()} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#E5E5EA' }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={{ stroke: '#E5E5EA' }}
              tick={{ fontSize: 12 }}
              domain={[0, 'dataMax + 10'] as AxisDomain}
              unit=" cf"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="usage" 
              stroke={getChartColor()} 
              fillOpacity={1} 
              fill="url(#colorUsage)" 
              animationDuration={1500}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsageGraph;
