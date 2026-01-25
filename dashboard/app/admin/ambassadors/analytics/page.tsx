'use client';

import {useAmbassadors} from '@/lib/hooks';
import {AdminLayout} from '@/components/admin/layout';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
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
import {DollarSign, Target, TrendingUp, Users} from 'lucide-react';
import {Skeleton} from '@/components/ui/skeleton';

const rankDistributionData = [
    {name: 'Scout', value: 18},
    {name: 'Bronze', value: 32},
    {name: 'Silver', value: 28},
    {name: 'Gold', value: 27},
    {name: 'Platinum', value: 16},
    {name: 'Campus King/Queen', value: 6},
];

const performanceData = [
    {name: 'Week 1', points: 1200, sales: 4500, users: 12},
    {name: 'Week 2', points: 1450, sales: 5200, users: 15},
    {name: 'Week 3', points: 1650, sales: 6100, users: 18},
    {name: 'Week 4', points: 2100, sales: 7500, users: 22},
];

const campaignData = [
    {name: 'Flyer Campaign', completion: 85, revenue: 12500},
    {name: 'Social Media', completion: 72, revenue: 8900},
    {name: 'Event Activation', completion: 91, revenue: 18200},
    {name: 'Referral Program', completion: 68, revenue: 6700},
    {name: 'Group Orders', completion: 79, revenue: 14500},
];

const COLORS = ['#0ea5e9', '#f97316', '#eab308', '#ec4899', '#8b5cf6', '#14b8a6'];

export default function AmbassadorAnalyticsPage() {
    const {data: ambassadors, isLoading} = useAmbassadors(1, 100);

    const totalEarnings = ambassadors?.data?.reduce((sum: number, amb: any) => sum + amb.monthlyEarnings, 0) || 0;
    const totalSales = ambassadors?.data?.reduce((sum: number, amb: any) => sum + amb.monthlySales, 0) || 0;
    const dataLength = ambassadors?.data?.length || 1;
    const avgRating = (ambassadors?.data?.reduce((sum: number, amb: any) => sum + amb.rating, 0) || 0) / dataLength;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ambassador Analytics</h1>
                    <p className="text-muted-foreground mt-1">Performance metrics and program insights</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Users className="h-4 w-4"/>
                                Total Ambassadors
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? <Skeleton className="h-8 w-12"/> : ambassadors?.total || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Active and growing</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <DollarSign className="h-4 w-4"/>
                                Total Sales GMV
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">GHS {(totalSales / 1000).toFixed(1)}K</div>
                            <p className="text-xs text-muted-foreground mt-1">This month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="h-4 w-4"/>
                                Total Earnings Paid
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">GHS {totalEarnings.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">Commission distributed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Target className="h-4 w-4"/>
                                Avg Rating
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgRating.toFixed(1)}/5.0</div>
                            <p className="text-xs text-muted-foreground mt-1">Ambassador quality</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="performance" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="performance">Performance Trends</TabsTrigger>
                        <TabsTrigger value="distribution">Rank Distribution</TabsTrigger>
                        <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="performance" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Weekly Performance Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <Skeleton className="h-80"/>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={performanceData}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="name"/>
                                            <YAxis/>
                                            <Tooltip/>
                                            <Legend/>
                                            <Line
                                                type="monotone"
                                                dataKey="points"
                                                stroke="#0ea5e9"
                                                strokeWidth={2}
                                                name="Points Earned"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="sales"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                name="Sales (GHS)"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="users"
                                                stroke="#f59e0b"
                                                strokeWidth={2}
                                                name="New Users"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="distribution" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ambassador Rank Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Skeleton className="h-80"/>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={rankDistributionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({name, value}) => `${name} (${value})`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {rankDistributionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`}
                                                              fill={COLORS[index % COLORS.length]}/>
                                                    ))}
                                                </Pie>
                                                <Tooltip/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Rank Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {rankDistributionData.map((rank, index) => (
                                        <div key={rank.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{backgroundColor: COLORS[index % COLORS.length]}}
                                                />
                                                <span className="font-medium">{rank.name}</span>
                                            </div>
                                            <span className="text-sm font-semibold">{rank.value} ambassadors</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="campaigns" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Campaign Performance by Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <Skeleton className="h-80"/>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={campaignData}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="name"/>
                                            <YAxis yAxisId="left"/>
                                            <YAxis yAxisId="right" orientation="right"/>
                                            <Tooltip/>
                                            <Legend/>
                                            <Bar
                                                yAxisId="left"
                                                dataKey="revenue"
                                                fill="#0ea5e9"
                                                name="Revenue (GHS)"
                                            />
                                            <Bar
                                                yAxisId="right"
                                                dataKey="completion"
                                                fill="#10b981"
                                                name="Completion %"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle>Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2"/>
                            <div>
                                <p className="font-semibold">Strong Growth Trajectory</p>
                                <p className="text-sm text-muted-foreground">Weekly points and sales are trending
                                    upward. Your ambassador program is gaining momentum.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"/>
                            <div>
                                <p className="font-semibold">Event Activation Success</p>
                                <p className="text-sm text-muted-foreground">Hall event activations have the highest ROI
                                    at 91% completion and GHS 18,200 revenue.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-500 mt-2"/>
                            <div>
                                <p className="font-semibold">Mid-Tier Development Opportunity</p>
                                <p className="text-sm text-muted-foreground">Large group in Silver rank. Create targeted
                                    Gold-rank challenges to accelerate tier progression.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
