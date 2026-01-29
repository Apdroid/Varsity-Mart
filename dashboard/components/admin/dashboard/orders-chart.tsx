'use client';

import { useOrdersChart } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity } from 'lucide-react';

export function OrdersChart() {
  const { data: chartData, isLoading } = useOrdersChart();

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Activity className="h-4 w-4 text-primary"/>
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Orders and revenue breakdown</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="revenueBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
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
                  marginBottom: '8px',
                }}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                }}
                iconType="circle"
              />
              <Bar 
                dataKey="orders" 
                fill="url(#ordersGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#revenueBarGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
