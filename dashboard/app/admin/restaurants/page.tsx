'use client';

import {useMemo} from 'react';
import Link from 'next/link';
import {AdminLayout} from '@/components/admin/layout';
import {useRestaurants} from '@/lib/hooks';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {DataTable, DataTableColumnHeader} from '@/components/ui/data-table';
import {ColumnDef} from '@tanstack/react-table';
import {MoreHorizontal, Plus, Star, Store, UtensilsCrossed} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Restaurant {
    id: number;
    name: string;
    owner: string;
    cuisine: string;
    rating: number;
    orders: number;
    commission: string;
    status: string;
    joinDate: string;
}

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
};

export default function RestaurantsPage() {
    const {data: restaurants, isLoading} = useRestaurants(1, 100);

    const columns: ColumnDef<Restaurant>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Restaurant Name"/>
                ),
                cell: ({row}) => (
                    <div className="font-medium">{row.getValue('name')}</div>
                ),
            },
            {
                accessorKey: 'owner',
                header: 'Owner',
                cell: ({row}) => <div className="text-sm">{row.getValue('owner')}</div>,
            },
            {
                accessorKey: 'cuisine',
                header: 'Cuisine',
                cell: ({row}) => (
                    <Badge variant="outline">{row.getValue('cuisine')}</Badge>
                ),
            },
            {
                accessorKey: 'rating',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Rating"/>
                ),
                cell: ({row}) => (
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                        <span className="font-medium">{row.getValue('rating')}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'orders',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Orders"/>
                ),
                cell: ({row}) => (
                    <div>{(row.getValue('orders') as number).toLocaleString()}</div>
                ),
            },
            {
                accessorKey: 'commission',
                header: 'Commission',
                cell: ({row}) => (
                    <div className="font-medium">{row.getValue('commission')}</div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({row}) => (
                    <Badge className={statusColors[row.getValue('status') as string] || ''}>
                        {row.getValue('status')}
                    </Badge>
                ),
            },
            {
                accessorKey: 'joinDate',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Join Date"/>
                ),
                cell: ({row}) => (
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {row.getValue('joinDate')}
                    </div>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({row}) => {
                    const restaurant = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/restaurants/${restaurant.id}`}>View Details</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/restaurants/${restaurant.id}`}>Edit Restaurant</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>Set Active</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Suspend</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        []
    );

    const tableData = restaurants?.data || [];
    const totalRestaurants = tableData.length;
    const activeRestaurants = tableData.filter((r) => r.status === 'active').length;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Restaurants Management</h1>
                        <p className="text-muted-foreground mt-1">Manage all restaurant partners</p>
                    </div>
                    <Link href="/admin/restaurants/new">
                        <Button className="w-full sm:w-auto gap-2">
                            <Plus className="h-4 w-4"/>
                            Add Restaurant
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
                            <UtensilsCrossed className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalRestaurants}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
                            <Store className="h-4 w-4 text-green-500"/>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="text-2xl font-bold text-green-600 dark:text-green-400">{activeRestaurants}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Restaurants Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Restaurants</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={tableData}
                            isLoading={isLoading}
                            searchKey="name"
                            searchPlaceholder="Search restaurants..."
                            pageSize={10}
                            emptyMessage="No restaurants found."
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
