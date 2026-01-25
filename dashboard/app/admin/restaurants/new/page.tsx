'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {AdminLayout} from '@/components/admin/layout';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {ArrowLeft, ImagePlus, Loader2, Save, X} from 'lucide-react';
import Link from 'next/link';
import {toast} from 'sonner';

export default function NewRestaurantPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [logo, setLogo] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        cuisine: '',
        description: '',
        commission: '15',
        status: 'active',
    });

    const handleLogoUpload = () => {
        const newLogo = `https://picsum.photos/seed/${Date.now()}/200/200`;
        setLogo(newLogo);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Restaurant created successfully!');
            router.push('/admin/restaurants');
        } catch (error) {
            toast.error('Failed to create restaurant');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/restaurants">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5"/>
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Add New Restaurant</h1>
                        <p className="text-muted-foreground mt-1">Register a new restaurant partner</p>
                    </div>
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
                                                <SelectItem value="pending">Pending Approval</SelectItem>
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
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4"/>
                                    Create Restaurant
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
