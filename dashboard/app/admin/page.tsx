'use client';

import {AdminLayout} from '@/components/admin/layout';
import {useDashboardStats} from '@/lib/hooks';
import {StatsCard} from '@/components/admin/dashboard/stats-card';
import {RevenueChart} from '@/components/admin/dashboard/revenue-chart';
import {OrdersChart} from '@/components/admin/dashboard/orders-chart';
import {Skeleton} from '@/components/ui/skeleton';
import {DollarSign, ShoppingCart, TrendingUp, Users, ArrowUpRight, Package, Store} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-36"/>
                ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-7 gap-6">
                <Skeleton className="h-96 xl:col-span-4"/>
                <Skeleton className="h-96 xl:col-span-3"/>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const {data: stats, isLoading} = useDashboardStats();

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Dashboard Overview</h1>
                            <p className="text-muted-foreground mt-1.5">Monitor your business metrics in real-time</p>
                        </div>
                    </div>
                    <DashboardSkeleton/>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Dashboard Overview</h1>
                        <p className="text-muted-foreground mt-1.5">Monitor your business metrics in real-time</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Users"
                        value={stats?.totalUsers.toLocaleString() || 0}
                        change={12}
                        icon={<Users className="h-6 w-6"/>}
                        color="blue"
                    />
                    <StatsCard
                        title="Total Orders"
                        value={stats?.totalOrders.toLocaleString() || 0}
                        change={8}
                        icon={<ShoppingCart className="h-6 w-6"/>}
                        color="green"
                    />
                    <StatsCard
                        title="Total Revenue"
                        value={`$${(stats?.totalRevenue || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}`}
                        change={15}
                        icon={<DollarSign className="h-6 w-6"/>}
                        color="purple"
                    />
                    <StatsCard
                        title="Active Restaurants"
                        value={stats?.activeRestaurants || 0}
                        change={3}
                        icon={<Store className="h-6 w-6"/>}
                        color="orange"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 xl:grid-cols-7 gap-6">
                    <div className="xl:col-span-4">
                        <RevenueChart/>
                    </div>
                    <div className="xl:col-span-3">
                        <OrdersChart/>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Package className="h-4 w-4"/>
                                New Users This Month
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between">
                                <p className="text-3xl font-bold tracking-tight">{stats?.newUsersThisMonth}</p>
                                <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                                    <ArrowUpRight className="h-4 w-4"/>
                                    <span>+12%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4"/>
                                Orders This Month
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between">
                                <p className="text-3xl font-bold tracking-tight">{stats?.ordersThisMonth}</p>
                                <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                                    <ArrowUpRight className="h-4 w-4"/>
                                    <span>+8%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="h-4 w-4"/>
                                Revenue This Month
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between">
                                <p className="text-3xl font-bold tracking-tight">
                                    ${(stats?.revenueThisMonth || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}
                                </p>
                                <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                                    <ArrowUpRight className="h-4 w-4"/>
                                    <span>+15%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
