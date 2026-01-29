'use client';

import {useMemo} from 'react';
import Link from 'next/link';
import {AdminLayout} from '@/components/admin/layout';
import {useProducts, useUpdateProductStatus} from '@/lib/hooks';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {DataTable, DataTableColumnHeader} from '@/components/ui/data-table';
import {ColumnDef} from '@tanstack/react-table';
import {MoreHorizontal, Package, PackageCheck, PackageX, Plus} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Product {
    id: number;
    name: string;
    seller: string;
    category: string;
    price: number;
    stock: number;
    sales: number;
    status: string;
    addedDate: string;
}

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
};

export default function ProductsPage() {
    const {data: products, isLoading} = useProducts(1, 100);
    const updateProductStatus = useUpdateProductStatus();

    const handleStatusChange = async (productId: number, newStatus: string) => {
        await updateProductStatus.mutateAsync({id: productId, status: newStatus});
    };

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Product Name"/>
                ),
                cell: ({row}) => (
                    <div className="font-medium max-w-[200px] truncate">{row.getValue('name')}</div>
                ),
            },
            {
                accessorKey: 'seller',
                header: 'Seller',
                cell: ({row}) => <div className="text-sm">{row.getValue('seller')}</div>,
            },
            {
                accessorKey: 'category',
                header: 'Category',
                cell: ({row}) => (
                    <Badge variant="outline" className="whitespace-nowrap">
                        {row.getValue('category')}
                    </Badge>
                ),
            },
            {
                accessorKey: 'price',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Price"/>
                ),
                cell: ({row}) => (
                    <div className="font-medium">${row.getValue('price')}</div>
                ),
            },
            {
                accessorKey: 'stock',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Stock"/>
                ),
                cell: ({row}) => {
                    const stock = row.getValue('stock') as number;
                    return (
                        <Badge
                            variant={stock > 0 ? 'default' : 'secondary'}
                            className={stock > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                        >
                            {stock}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'sales',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Sales"/>
                ),
                cell: ({row}) => (
                    <div>{(row.getValue('sales') as number).toLocaleString()}</div>
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
                accessorKey: 'addedDate',
                header: ({column}) => (
                    <DataTableColumnHeader column={column} title="Added Date"/>
                ),
                cell: ({row}) => (
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {row.getValue('addedDate')}
                    </div>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({row}) => {
                    const product = row.original;
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
                                    <Link href={`/admin/products/${product.id}`}>View Details</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/products/${product.id}`}>Edit Product</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'active')}>
                                    Set Active
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'inactive')}>
                                    Set Inactive
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [handleStatusChange]
    );

    const tableData = products?.data || [];
    const totalProducts = tableData.length;
    const activeProducts = tableData.filter((p) => p.status === 'active').length;
    const outOfStock = tableData.filter((p) => p.stock === 0).length;

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Products Management</h1>
                        <p className="text-muted-foreground mt-1.5">Manage all marketplace products</p>
                    </div>
                    <Link href="/admin/products/new">
                        <Button className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20">
                            <Plus className="h-4 w-4"/>
                            Add Product
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground/80">Total Products</CardTitle>
                            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                                <Package className="h-4 w-4 text-primary"/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight">{totalProducts}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground/80">Active Products</CardTitle>
                            <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
                                <PackageCheck className="h-4 w-4 text-green-400"/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-green-400">{activeProducts}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground/80">Out of Stock</CardTitle>
                            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                                <PackageX className="h-4 w-4 text-red-400"/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-red-400">{outOfStock}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Products Table */}
                <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">All Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={tableData}
                            isLoading={isLoading}
                            searchKey="name"
                            searchPlaceholder="Search products..."
                            pageSize={10}
                            emptyMessage="No products found."
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
