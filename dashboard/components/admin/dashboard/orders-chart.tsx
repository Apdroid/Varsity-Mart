'use client';

import { useOrdersChart } from '@/lib/hooks';
import { Card } from '@/components/ui/card';
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

export function OrdersChart() {
  const { data: chartData, isLoading } = useOrdersChart();

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Weekly Activity</h3>
      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value) => value}
            />
            <Legend />
            <Bar dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
