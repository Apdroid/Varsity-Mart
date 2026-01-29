'use client';

import {useMemo} from 'react';
import Link from 'next/link';
import {AdminLayout} from '@/components/admin/layout';
import {useOrders, useUpdateOrderStatus} from '@/lib/hooks';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {DataTable, DataTableColumnHeader} from '@/components/ui/data-table';
import {ColumnDef} from '@tanstack/react-table';
import {CheckCircle, Clock, MoreHorizontal, ShoppingCart, Truck} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Order {
    id: string;
    customer: string;
    seller: string;
    items: number;
    total: number;
    status: string;
    date: string;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function OrdersPage() {
    const {data: orders, isLoading} = useOrders(1, 100);
    const updateOrderStatus = useUpdateOrderStatus();

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        await updateOrderStatus.mutateAsync({id: orderId, status: newStatus});
    };

    const columns: ColumnDef<Order>[] = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Order ID"/>
                ),
                cell: ({row}) => (
                    <div className="font-medium text-primary">{row.getValue('id')}</div>
                ),
            },
            {
                accessorKey: 'customer',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Customer"/>
                ),
                cell: ({row}) => (
                    <div className="font-medium">{row.getValue('customer')}</div>
                ),
            },
            {
                accessorKey: 'seller',
                header: 'Seller',
                cell: ({row}) => <div className="text-sm">{row.getValue('seller')}</div>,
            },
            {
                accessorKey: 'items',
                header: 'Items',
                cell: ({row}) => <div>{row.getValue('items')}</div>,
            },
            {
                accessorKey: 'total',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Total"/>
                ),
                cell: ({row}) => (
                    <div className="font-medium">
                        ${(row.getValue('total') as number).toFixed(2)}
                    </div>
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
                filterFn: (row, id, value) => {
                    return value === 'all' || row.getValue(id) === value;
                },
            },
            {
                accessorKey: 'date',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Date"/>
                ),
                cell: ({row}) => (
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {row.getValue('date')}
                    </div>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({row}) => {
                    const order = row.original;
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
                                    <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'pending')}>
                                    Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'processing')}>
                                    Processing
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'shipped')}>
                                    Shipped
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'delivered')}>
                                    Delivered
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    onClick={() => handleStatusChange(order.id, 'cancelled')}
                                    className="text-destructive"
                                >
                                    Cancel Order
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [handleStatusChange]
    );

    const tableData = orders?.data || [];
    const totalOrders = tableData.length;
    const pendingOrders = tableData.filter((o) => o.status === 'pending').length;
    const processingOrders = tableData.filter((o) => o.status === 'processing').length;
    const deliveredOrders = tableData.filter((o) => o.status === 'delivered').length;

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Orders Management</h1>
                        <p className="text-muted-foreground mt-1.5">Manage all platform orders</p>
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto border-border/50">
                        Export Orders
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground/80">Total Orders</CardTitle>
                            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                                <ShoppingCart className="h-4 w-4 text-primary"/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight">{totalOrders}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground/80">Pending</CardTitle>
                            <div className="p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <Clock className="h-4 w-4 text-yellow-400"/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-yellow-400">{pendingOrders}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground/80">Processing</CardTitle>
                            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <Truck className="h-4 w-4 text-blue-400"/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-blue-400">{processingOrders}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground/80">Delivered</CardTitle>
                            <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
                                <CheckCircle className="h-4 w-4 text-green-400"/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-green-400">{deliveredOrders}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders Table */}
                <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">All Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={tableData}
                            isLoading={isLoading}
                            searchKey="customer"
                            searchPlaceholder="Search orders by customer..."
                            pageSize={10}
                            emptyMessage="No orders found."
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
