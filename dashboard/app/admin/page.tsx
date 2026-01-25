'use client';

import {AdminLayout} from '@/components/admin/layout';
import {useDashboardStats} from '@/lib/hooks';
import {StatsCard} from '@/components/admin/dashboard/stats-card';
import {RevenueChart} from '@/components/admin/dashboard/revenue-chart';
import {OrdersChart} from '@/components/admin/dashboard/orders-chart';
import {Skeleton} from '@/components/ui/skeleton';
import {DollarSign, ShoppingCart, TrendingUp, Users} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32"/>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-80"/>
                <Skeleton className="h-80"/>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const {data: stats, isLoading} = useDashboardStats();

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Welcome to your admin dashboard</p>
                    </div>
                    <DashboardSkeleton/>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Welcome to your admin dashboard</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Users"
                        value={stats?.totalUsers.toLocaleString() || 0}
                        change={12}
                        icon={<Users className="h-5 w-5 sm:h-6 sm:w-6"/>}
                        color="blue"
                    />
                    <StatsCard
                        title="Total Orders"
                        value={stats?.totalOrders.toLocaleString() || 0}
                        change={8}
                        icon={<ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6"/>}
                        color="green"
                    />
                    <StatsCard
                        title="Total Revenue"
                        value={`$${(stats?.totalRevenue || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}`}
                        change={15}
                        icon={<DollarSign className="h-5 w-5 sm:h-6 sm:w-6"/>}
                        color="purple"
                    />
                    <StatsCard
                        title="Active Restaurants"
                        value={stats?.activeRestaurants || 0}
                        change={3}
                        icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6"/>}
                        color="orange"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RevenueChart/>
                    <OrdersChart/>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">New Users This
                                Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{stats?.newUsersThisMonth}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Orders This
                                Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{stats?.ordersThisMonth}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue This
                                Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                ${(stats?.revenueThisMonth || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
