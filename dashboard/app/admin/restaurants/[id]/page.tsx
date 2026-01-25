'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {AdminLayout} from '@/components/admin/layout';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {ArrowLeft, ImagePlus, Loader2, Save, Trash2, X} from 'lucide-react';
import Link from 'next/link';
import {toast} from 'sonner';
import {useRestaurant} from '@/lib/hooks';

export default function EditRestaurantPage() {
    const router = useRouter();
    const params = useParams();
    const restaurantId = Number(params.id);
    const {data: restaurant, isLoading} = useRestaurant(restaurantId);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [logo, setLogo] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        cuisine: '',
        description: '',
        commission: '',
        status: '',
    });

    useEffect(() => {
        if (restaurant) {
            setFormData({
                name: restaurant.name || '',
                ownerName: restaurant.owner || '',
                email: restaurant.email || '',
                phone: restaurant.phone || '',
                address: restaurant.address || '',
                cuisine: restaurant.cuisine || '',
                description: restaurant.description || '',
                commission: restaurant.commission?.replace('%', '') || '15',
                status: restaurant.status || '',
            });
            setLogo(restaurant.logo || null);
        }
    }, [restaurant]);

    const handleLogoUpload = () => {
        const newLogo = `https://picsum.photos/seed/${Date.now()}/200/200`;
        setLogo(newLogo);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Restaurant updated successfully!');
            router.push('/admin/restaurants');
        } catch (error) {
            toast.error('Failed to update restaurant');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Restaurant deleted successfully!');
            router.push('/admin/restaurants');
        } catch (error) {
            toast.error('Failed to delete restaurant');
        } finally {
            setDeleting(false);
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
                        <Skeleton className="h-48"/>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/restaurants">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5"/>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">Edit Restaurant</h1>
                            <p className="text-muted-foreground mt-1">Update restaurant information</p>
                        </div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4"/>
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently remove the restaurant
                                    from the platform.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Restaurant Information</CardTitle>
                                    <CardDescription>Basic restaurant details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            {logo ? (
                                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                                                    <img src={logo} alt="Logo" className="object-cover w-full h-full"/>
                                                    <button
                                                        type="button"
                                                        onClick={() => setLogo(null)}
                                                        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                                                    >
                                                        <X className="h-3 w-3"/>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleLogoUpload}
                                                    className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-1 hover:border-muted-foreground/50 transition-colors"
                                                >
                                                    <ImagePlus className="h-6 w-6 text-muted-foreground"/>
                                                    <span className="text-xs text-muted-foreground">Logo</span>
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Restaurant Name</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Enter restaurant name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cuisine">Cuisine Type</Label>
                                                <Select
                                                    value={formData.cuisine}
                                                    onValueChange={(value) => setFormData({
                                                        ...formData,
                                                        cuisine: value
                                                    })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select cuisine type"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="american">American</SelectItem>
                                                        <SelectItem value="italian">Italian</SelectItem>
                                                        <SelectItem value="chinese">Chinese</SelectItem>
                                                        <SelectItem value="indian">Indian</SelectItem>
                                                        <SelectItem value="mexican">Mexican</SelectItem>
                                                        <SelectItem value="japanese">Japanese</SelectItem>
                                                        <SelectItem value="thai">Thai</SelectItem>
                                                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Enter restaurant description"
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea
                                            id="address"
                                            placeholder="Enter full address"
                                            rows={2}
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Owner Information</CardTitle>
                                    <CardDescription>Restaurant owner contact details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerName">Owner Name</Label>
                                        <Input
                                            id="ownerName"
                                            placeholder="Enter owner name"
                                            value={formData.ownerName}
                                            onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="owner@restaurant.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+1 (555) 123-4567"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Partnership Settings</CardTitle>
                                    <CardDescription>Commission and status</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="commission">Commission Rate (%)</Label>
                                        <Input
                                            id="commission"
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="15"
                                            value={formData.commission}
                                            onChange={(e) => setFormData({...formData, commission: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value) => setFormData({...formData, status: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="suspended">Suspended</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 mt-6">
                        <Link href="/admin/restaurants">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4"/>
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
