'use client';

import { useRevenueChart } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';

export function RevenueChart() {
  const { data: chartData, isLoading } = useRevenueChart();

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Revenue Analytics</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Monthly revenue performance</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <TrendingUp className="h-4 w-4"/>
          <span className="text-sm font-semibold">+15.3%</span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                }}
                labelStyle={{
                  color: 'hsl(var(--foreground))',
                  fontWeight: 600,
                }}
                itemStyle={{
                  color: 'hsl(var(--primary))',
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                dot={{ 
                  fill: 'hsl(var(--primary))', 
                  r: 4, 
                  strokeWidth: 2,
                  stroke: 'hsl(var(--card))'
                }}
                activeDot={{ 
                  r: 6,
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--card))',
                  strokeWidth: 3
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
