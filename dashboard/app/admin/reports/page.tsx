'use client';

import { AdminLayout } from '@/components/admin/layout';
import { useDashboardStats, useRevenueChart, useOrdersChart } from '@/lib/hooks';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, Database as DateRange } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ReportsPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueChart();
  const { data: ordersData, isLoading: ordersLoading } = useOrdersChart();

  const categoryData = [
    { name: 'Electronics', value: 456 },
    { name: 'Accessories', value: 892 },
    { name: 'Clothing', value: 234 },
    { name: 'Books', value: 567 },
    { name: 'Food', value: 345 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive platform analytics and insights</p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Date Range Filter */}
        <Card className="p-4 flex items-center gap-4">
          <DateRange className="h-5 w-5 text-gray-500" />
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm">
              Last 7 Days
            </Button>
            <Button variant="outline" size="sm">
              Last 30 Days
            </Button>
            <Button variant="outline" size="sm">
              Last Quarter
            </Button>
            <Button variant="outline" size="sm">
              Custom Range
            </Button>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsLoading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)
          ) : (
            <>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">
                  ${(stats?.totalRevenue || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-green-600 mt-2">+15% from last month</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalOrders.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-2">+8% from last month</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground">Average Order Value</p>
                <p className="text-3xl font-bold mt-2">
                  ${(
                    (stats?.totalRevenue || 0) / (stats?.totalOrders || 1)
                  ).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-green-600 mt-2">+3% from last month</p>
              </Card>
            </>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Revenue Trend</h3>
            {revenueLoading ? (
              <Skeleton className="h-80" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Category Distribution */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Products by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Weekly Activity</h3>
          {ordersLoading ? (
            <Skeleton className="h-80" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="orders" fill="#10b981" />
                <Bar yAxisId="right" dataKey="revenue" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Conversion Rate</p>
            <p className="text-2xl font-bold mt-2">3.24%</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Avg Order Value</p>
            <p className="text-2xl font-bold mt-2">$27.45</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Customer Retention</p>
            <p className="text-2xl font-bold mt-2">67.8%</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Platform Growth</p>
            <p className="text-2xl font-bold mt-2">+12.5%</p>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
