'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {AdminLayout} from '@/components/admin/layout';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {Separator} from '@/components/ui/separator';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {ArrowLeft, Loader2, Mail, MapPin, Package, Phone, Save, User} from 'lucide-react';
import Link from 'next/link';
import {toast} from 'sonner';
import {useOrder} from '@/lib/hooks';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;
    const {data: order, isLoading} = useOrder(orderId);

    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (order) {
            setStatus(order.status || 'pending');
        }
    }, [order]);

    const handleStatusUpdate = async () => {
        setSaving(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Order status updated successfully!');
        } catch (error) {
            toast.error('Failed to update order status');
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-md"/>
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48"/>
                            <Skeleton className="h-4 w-32"/>
                        </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-64"/>
                            <Skeleton className="h-48"/>
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-48"/>
                            <Skeleton className="h-48"/>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // Mock order items for display
    const orderItems = [
        {id: 1, name: 'Wireless Headphones', quantity: 1, price: 49.99},
        {id: 2, name: 'USB-C Cable', quantity: 2, price: 9.99},
        {id: 3, name: 'Phone Case', quantity: 1, price: 19.99},
    ];

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/orders">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5"/>
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl sm:text-3xl font-bold">Order {orderId}</h1>
                                <Badge className={statusColors[status] || ''}>
                                    {status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">
                                Placed on {order?.date || 'January 25, 2026'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5"/>
                                    Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orderItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Separator className="my-4"/>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <Separator/>
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500"/>
                                        <div>
                                            <p className="font-medium">Order Placed</p>
                                            <p className="text-sm text-muted-foreground">January 25, 2026 at 10:30
                                                AM</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500"/>
                                        <div>
                                            <p className="font-medium">Payment Confirmed</p>
                                            <p className="text-sm text-muted-foreground">January 25, 2026 at 10:32
                                                AM</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-muted"/>
                                        <div>
                                            <p className="font-medium text-muted-foreground">Processing</p>
                                            <p className="text-sm text-muted-foreground">Waiting</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-muted"/>
                                        <div>
                                            <p className="font-medium text-muted-foreground">Shipped</p>
                                            <p className="text-sm text-muted-foreground">Waiting</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-muted"/>
                                        <div>
                                            <p className="font-medium text-muted-foreground">Delivered</p>
                                            <p className="text-sm text-muted-foreground">Waiting</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Update Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Update Status</CardTitle>
                                <CardDescription>Change the order status</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleStatusUpdate} disabled={saving} className="w-full">
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4"/>
                                            Update Status
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Customer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5"/>
                                    Customer
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="font-medium">{order?.customer || 'John Doe'}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4"/>
                                    <span>john@example.com</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4"/>
                                    <span>+1 (555) 123-4567</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5"/>
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">John Doe</p>
                                <p className="text-sm text-muted-foreground">123 Main Street</p>
                                <p className="text-sm text-muted-foreground">Apt 4B</p>
                                <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                                <p className="text-sm text-muted-foreground">United States</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
