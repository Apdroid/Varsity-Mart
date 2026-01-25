'use client';

import {useMemo} from 'react';
import {useAmbassadors} from '@/lib/hooks';
import {AdminLayout} from '@/components/admin/layout';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {DataTable, DataTableColumnHeader} from '@/components/ui/data-table';
import {ColumnDef} from '@tanstack/react-table';
import {Award, DollarSign, Eye, FileDown, Plus, Trophy, Users} from 'lucide-react';
import Link from 'next/link';
import {Skeleton} from '@/components/ui/skeleton';

interface Ambassador {
    id: number;
    name: string;
    email: string;
    campus: string;
    territory: string;
    rank: string;
    points: number;
    usersRecruited: number;
    monthlySales: number;
    status: string;
}

const rankColors: Record<string, string> = {
    Scout: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    Bronze: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    Silver: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
    Gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Platinum: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Campus King': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'Campus Queen': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
};

export default function AmbassadorsPage() {
    const {data, isLoading} = useAmbassadors(1, 100);

    const columns: ColumnDef<Ambassador>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Name"/>
                ),
                cell: ({row}) => (
                    <div className="font-medium">{row.getValue('name')}</div>
                ),
            },
            {
                accessorKey: 'campus',
                header: 'Campus',
                cell: ({row}) => <div>{row.getValue('campus')}</div>,
            },
            {
                accessorKey: 'territory',
                header: 'Territory',
                cell: ({row}) => (
                    <div className="text-sm text-muted-foreground">{row.getValue('territory')}</div>
                ),
            },
            {
                accessorKey: 'rank',
                header: 'Rank',
                cell: ({row}) => (
                    <Badge className={rankColors[row.getValue('rank') as string] || 'bg-gray-100'}>
                        {row.getValue('rank')}
                    </Badge>
                ),
            },
            {
                accessorKey: 'points',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Points"/>
                ),
                cell: ({row}) => (
                    <div className="font-semibold">{(row.getValue('points') as number).toLocaleString()}</div>
                ),
            },
            {
                accessorKey: 'usersRecruited',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Users"/>
                ),
                cell: ({row}) => <div>{row.getValue('usersRecruited')}</div>,
            },
            {
                accessorKey: 'monthlySales',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Sales"/>
                ),
                cell: ({row}) => (
                    <div>GHS {(row.getValue('monthlySales') as number).toLocaleString()}</div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({row}) => (
                    <Badge variant={row.getValue('status') === 'active' ? 'default' : 'secondary'}>
                        {row.getValue('status')}
                    </Badge>
                ),
            },
            {
                id: 'actions',
                header: 'Action',
                cell: ({row}) => {
                    const ambassador = row.original;
                    return (
                        <Link href={`/admin/ambassadors/${ambassador.id}`}>
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4"/>
                            </Button>
                        </Link>
                    );
                },
            },
        ],
        []
    );

    const tableData = data?.data || [];
    const totalAmbassadors = data?.total || 0;
    const activeAmbassadors = Math.ceil(totalAmbassadors * 0.85);

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Ambassadors</h1>
                        <p className="text-muted-foreground mt-1">Manage student ambassadors and track performance</p>
                    </div>
                    <Link href="/admin/ambassadors/new">
                        <Button className="w-full sm:w-auto gap-2">
                            <Plus className="h-4 w-4"/>
                            Add Ambassador
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Ambassadors</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{isLoading ?
                                <Skeleton className="h-8 w-12"/> : totalAmbassadors}</div>
                            <p className="text-xs text-muted-foreground mt-1">Across all campuses</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active This Month</CardTitle>
                            <Users className="h-4 w-4 text-green-500"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{isLoading ?
                                <Skeleton className="h-8 w-12"/> : activeAmbassadors}</div>
                            <p className="text-xs text-muted-foreground mt-1">85% participation rate</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Campus King/Queens</CardTitle>
                            <Award className="h-4 w-4 text-purple-500"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</div>
                            <p className="text-xs text-muted-foreground mt-1">Elite ambassadors</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
                            <DollarSign className="h-4 w-4 text-yellow-500"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">GHS 8,450</div>
                            <p className="text-xs text-muted-foreground mt-1">Commission paid</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Ambassadors Table */}
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <CardTitle>Manage Ambassadors</CardTitle>
                        <Button variant="outline" size="sm" className="gap-2">
                            <FileDown className="h-4 w-4"/>
                            Export
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={tableData}
                            isLoading={isLoading}
                            searchKey="name"
                            searchPlaceholder="Search by name..."
                            pageSize={10}
                            emptyMessage="No ambassadors found."
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
