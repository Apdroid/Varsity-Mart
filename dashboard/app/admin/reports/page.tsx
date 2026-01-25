'use client';

import {AdminLayout} from '@/components/admin/layout';
import {useDashboardStats, useOrdersChart, useRevenueChart} from '@/lib/hooks';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {Button} from '@/components/ui/button';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {Calendar, Download} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ReportsPage() {
    const {data: stats, isLoading: statsLoading} = useDashboardStats();
    const {data: revenueData, isLoading: revenueLoading} = useRevenueChart();
    const {data: ordersData, isLoading: ordersLoading} = useOrdersChart();

    const categoryData = [
        {name: 'Electronics', value: 456},
        {name: 'Accessories', value: 892},
        {name: 'Clothing', value: 234},
        {name: 'Books', value: 567},
        {name: 'Food', value: 345},
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Reports & Analytics</h1>
                        <p className="text-muted-foreground mt-1">Comprehensive platform analytics and insights</p>
                    </div>
                    <Button className="w-full sm:w-auto gap-2">
                        <Download className="h-4 w-4"/>
                        Export Report
                    </Button>
                </div>

                {/* Date Range Filter */}
                <Card className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Calendar className="h-5 w-5 text-muted-foreground hidden sm:block"/>
                        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                                Last 7 Days
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                                Last 30 Days
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                                Last Quarter
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                                Custom Range
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {statsLoading ? (
                        [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24"/>)
                    ) : (
                        <>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total
                                        Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl sm:text-3xl font-bold">
                                        ${(stats?.totalRevenue || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">+15% from last
                                        month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total
                                        Orders</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl sm:text-3xl font-bold">{stats?.totalOrders.toLocaleString()}</p>
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">+8% from last
                                        month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Average Order
                                        Value</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl sm:text-3xl font-bold">
                                        ${(
                                        (stats?.totalRevenue || 0) / (stats?.totalOrders || 1)
                                    ).toLocaleString('en-US', {maximumFractionDigits: 0})}
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">+3% from last
                                        month</p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {revenueLoading ? (
                                <Skeleton className="h-[300px]"/>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border"/>
                                        <XAxis dataKey="month" className="text-xs"/>
                                        <YAxis className="text-xs"/>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: 'var(--radius)'
                                            }}
                                        />
                                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))"
                                              strokeWidth={2}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Category Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Products by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({name, value}) => `${name} (${value})`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Weekly Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {ordersLoading ? (
                            <Skeleton className="h-[300px]"/>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ordersData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border"/>
                                    <XAxis dataKey="date" className="text-xs"/>
                                    <YAxis yAxisId="left" className="text-xs"/>
                                    <YAxis yAxisId="right" orientation="right" className="text-xs"/>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: 'var(--radius)'
                                        }}
                                    />
                                    <Legend/>
                                    <Bar yAxisId="left" dataKey="orders" fill="#10b981"/>
                                    <Bar yAxisId="right" dataKey="revenue" fill="#f59e0b"/>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                        <p className="text-xs text-muted-foreground uppercase">Conversion Rate</p>
                        <p className="text-xl sm:text-2xl font-bold mt-2">3.24%</p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-xs text-muted-foreground uppercase">Avg Order Value</p>
                        <p className="text-xl sm:text-2xl font-bold mt-2">$27.45</p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-xs text-muted-foreground uppercase">Customer Retention</p>
                        <p className="text-xl sm:text-2xl font-bold mt-2">67.8%</p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-xs text-muted-foreground uppercase">Platform Growth</p>
                        <p className="text-xl sm:text-2xl font-bold mt-2">+12.5%</p>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
