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

export default function NewAmbassadorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        campus: '',
        territory: '',
        studentId: '',
        rank: 'Scout',
        status: 'active',
        bio: '',
    });

    const handleAvatarUpload = () => {
        const newAvatar = `https://picsum.photos/seed/${Date.now()}/200/200`;
        setAvatar(newAvatar);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Ambassador created successfully!');
            router.push('/admin/ambassadors');
        } catch (error) {
            toast.error('Failed to create ambassador');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/ambassadors">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5"/>
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Add New Ambassador</h1>
                        <p className="text-muted-foreground mt-1">Register a new campus ambassador</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Ambassador's personal details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            {avatar ? (
                                                <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                                                    <img src={avatar} alt="Avatar"
                                                         className="object-cover w-full h-full"/>
                                                    <button
                                                        type="button"
                                                        onClick={() => setAvatar(null)}
                                                        className="absolute top-0 right-0 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                                                    >
                                                        <X className="h-3 w-3"/>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleAvatarUpload}
                                                    className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-1 hover:border-muted-foreground/50 transition-colors"
                                                >
                                                    <ImagePlus className="h-6 w-6 text-muted-foreground"/>
                                                    <span className="text-xs text-muted-foreground">Photo</span>
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Enter full name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="studentId">Student ID</Label>
                                                <Input
                                                    id="studentId"
                                                    placeholder="Enter student ID"
                                                    value={formData.studentId}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        studentId: e.target.value
                                                    })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="ambassador@university.edu"
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
                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Brief bio about the ambassador"
                                            rows={3}
                                            value={formData.bio}
                                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Campus Assignment</CardTitle>
                                    <CardDescription>Assign campus and territory</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="campus">Campus</Label>
                                            <Select
                                                value={formData.campus}
                                                onValueChange={(value) => setFormData({...formData, campus: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select campus"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="uog">University of Ghana</SelectItem>
                                                    <SelectItem value="knust">KNUST</SelectItem>
                                                    <SelectItem value="ucc">University of Cape Coast</SelectItem>
                                                    <SelectItem value="legon">Legon</SelectItem>
                                                    <SelectItem value="ashesi">Ashesi University</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="territory">Territory</Label>
                                            <Input
                                                id="territory"
                                                placeholder="e.g., North Campus, Hostel Area"
                                                value={formData.territory}
                                                onChange={(e) => setFormData({...formData, territory: e.target.value})}
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
                                    <CardTitle>Ambassador Settings</CardTitle>
                                    <CardDescription>Rank and status</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rank">Starting Rank</Label>
                                        <Select
                                            value={formData.rank}
                                            onValueChange={(value) => setFormData({...formData, rank: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select rank"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Scout">Scout</SelectItem>
                                                <SelectItem value="Bronze">Bronze</SelectItem>
                                                <SelectItem value="Silver">Silver</SelectItem>
                                                <SelectItem value="Gold">Gold</SelectItem>
                                                <SelectItem value="Platinum">Platinum</SelectItem>
                                            </SelectContent>
                                        </Select>
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

                            <Card>
                                <CardHeader>
                                    <CardTitle>Onboarding</CardTitle>
                                    <CardDescription>Send welcome email</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="sendEmail"
                                            className="h-4 w-4 rounded border-gray-300"
                                            defaultChecked
                                        />
                                        <Label htmlFor="sendEmail" className="text-sm font-normal">
                                            Send welcome email with login credentials
                                        </Label>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 mt-6">
                        <Link href="/admin/ambassadors">
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
                                    Create Ambassador
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
