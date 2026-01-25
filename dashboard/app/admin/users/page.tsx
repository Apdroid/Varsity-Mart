'use client';

import {useState} from 'react';
import {AdminLayout} from '@/components/admin/layout';
import {useUpdateUserStatus, useUsers} from '@/lib/hooks';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Skeleton} from '@/components/ui/skeleton';
import {Input} from '@/components/ui/input';
import {ChevronLeft, ChevronRight, Search} from 'lucide-react';

const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
};

const userTypeColors = {
    seller: 'bg-blue-100 text-blue-800',
    buyer: 'bg-purple-100 text-purple-800',
    restaurant: 'bg-orange-100 text-orange-800',
};

export default function UsersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const {data: users, isLoading} = useUsers(page, 10);
    const updateUserStatus = useUpdateUserStatus();

    const handleStatusChange = async (userId: number, newStatus: string) => {
        await updateUserStatus.mutateAsync({id: userId, status: newStatus});
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Users Management</h1>
                    <p className="text-muted-foreground mt-1">Manage all platform users</p>
                </div>

                {/* Search and Filters */}
                <div className="flex gap-4 flex-col md:flex-row">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                        <Input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select>
                        <SelectTrigger className="w-full md:w-40">
                            <SelectValue placeholder="Filter by type"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="seller">Sellers</SelectItem>
                            <SelectItem value="buyer">Buyers</SelectItem>
                            <SelectItem value="restaurant">Restaurants</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full md:w-40">
                            <SelectValue placeholder="Filter by status"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Users Table */}
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead>Join Date</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(8)].map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton className="h-4"/>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : users?.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users?.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                                        <TableCell>
                                            <Badge className={userTypeColors[user.type as keyof typeof userTypeColors]}>
                                                {user.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[user.status as keyof typeof statusColors]}>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.orders}</TableCell>
                                        <TableCell>${user.revenue.toLocaleString()}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{user.joinDate}</TableCell>
                                        <TableCell>
                                            <Select
                                                defaultValue={user.status}
                                                onValueChange={(value) => handleStatusChange(user.id, value)}
                                            >
                                                <SelectTrigger className="w-32 text-xs">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                    <SelectItem value="suspended">Suspend</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing page {page} of {users?.pages || 1}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1"/>
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(Math.min(users?.pages || 1, page + 1))}
                            disabled={page === users?.pages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1"/>
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
