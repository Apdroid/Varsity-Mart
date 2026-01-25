'use client';

import {useMemo} from 'react';
import Link from 'next/link';
import {AdminLayout} from '@/components/admin/layout';
import {useUpdateUserStatus, useUsers} from '@/lib/hooks';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {DataTable, DataTableColumnHeader} from '@/components/ui/data-table';
import {ColumnDef} from '@tanstack/react-table';
import {MoreHorizontal, Plus, UserCheck, Users, UserX} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
    id: number;
    name: string;
    email: string;
    type: string;
    status: string;
    joinDate: string;
    orders: number;
    revenue: number;
}

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const userTypeColors: Record<string, string> = {
    seller: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    buyer: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    restaurant: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function UsersPage() {
    const {data: users, isLoading} = useUsers(1, 100); // Fetch more for client-side filtering
    const updateUserStatus = useUpdateUserStatus();

    const handleStatusChange = async (userId: number, newStatus: string) => {
        await updateUserStatus.mutateAsync({id: userId, status: newStatus});
    };

    const columns: ColumnDef<User>[] = useMemo(
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
                accessorKey: 'email',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Email"/>
                ),
                cell: ({row}) => (
                    <div className="text-sm text-muted-foreground">{row.getValue('email')}</div>
                ),
            },
            {
                accessorKey: 'type',
                header: 'Type',
                cell: ({row}) => (
                    <Badge className={userTypeColors[row.getValue('type') as string] || ''}>
                        {row.getValue('type')}
                    </Badge>
                ),
                filterFn: (row, id, value) => {
                    return value === 'all' || row.getValue(id) === value;
                },
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
                accessorKey: 'orders',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Orders"/>
                ),
                cell: ({row}) => <div>{row.getValue('orders')}</div>,
            },
            {
                accessorKey: 'revenue',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Revenue"/>
                ),
                cell: ({row}) => (
                    <div className="font-medium">
                        ${(row.getValue('revenue') as number).toLocaleString()}
                    </div>
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
                    const user = row.original;
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
                                    <Link href={`/admin/users/${user.id}`}>Edit User</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                                    Copy email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                                    Set Active
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'inactive')}>
                                    Set Inactive
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleStatusChange(user.id, 'suspended')}
                                    className="text-destructive"
                                >
                                    Suspend User
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        []
    );

    const tableData = users?.data || [];

    // Calculate stats
    const totalUsers = tableData.length;
    const activeUsers = tableData.filter((u) => u.status === 'active').length;
    const suspendedUsers = tableData.filter((u) => u.status === 'suspended').length;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Users Management</h1>
                        <p className="text-muted-foreground mt-1">Manage all platform users</p>
                    </div>
                    <Link href="/admin/users/new">
                        <Button className="w-full sm:w-auto gap-2">
                            <Plus className="h-4 w-4"/>
                            Add New User
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUsers}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <UserCheck className="h-4 w-4 text-green-500"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeUsers}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                            <UserX className="h-4 w-4 text-red-500"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{suspendedUsers}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table with TanStack */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={tableData}
                            isLoading={isLoading}
                            searchKey="name"
                            searchPlaceholder="Search users by name..."
                            pageSize={10}
                            emptyMessage="No users found."
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}



