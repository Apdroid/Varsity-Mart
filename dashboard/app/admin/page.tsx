'use client';

import { AdminLayout } from '@/components/admin/layout';
import { useDashboardStats } from '@/lib/hooks';
import { StatsCard } from '@/components/admin/dashboard/stats-card';
import { RevenueChart } from '@/components/admin/dashboard/revenue-chart';
import { OrdersChart } from '@/components/admin/dashboard/orders-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to your admin dashboard</p>
          </div>
          <DashboardSkeleton />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers.toLocaleString() || 0}
            change={12}
            icon={<Users className="h-6 w-6" />}
            color="blue"
          />
          <StatsCard
            title="Total Orders"
            value={stats?.totalOrders.toLocaleString() || 0}
            change={8}
            icon={<ShoppingCart className="h-6 w-6" />}
            color="green"
          />
          <StatsCard
            title="Total Revenue"
            value={`$${(stats?.totalRevenue || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
            change={15}
            icon={<DollarSign className="h-6 w-6" />}
            color="purple"
          />
          <StatsCard
            title="Active Restaurants"
            value={stats?.activeRestaurants || 0}
            change={3}
            icon={<TrendingUp className="h-6 w-6" />}
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <OrdersChart />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-muted-foreground">New Users This Month</p>
            <p className="text-2xl font-bold mt-2">{stats?.newUsersThisMonth}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-muted-foreground">Orders This Month</p>
            <p className="text-2xl font-bold mt-2">{stats?.ordersThisMonth}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-muted-foreground">Revenue This Month</p>
            <p className="text-2xl font-bold mt-2">
              ${(stats?.revenueThisMonth || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
