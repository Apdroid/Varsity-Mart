'use client';

import { useState } from 'react';
import { useAmbassador, useUpdateAmbassadorStatus, useProcessPayout } from '@/lib/hooks';
import { AdminLayout } from '@/components/admin/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, DollarSign, TrendingUp, Users, Target } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function AmbassadorDetailPage({ params }: { params: { id: string } }) {
  const { data: ambassador, isLoading } = useAmbassador(parseInt(params.id));
  const updateStatus = useUpdateAmbassadorStatus();
  const processPayout = useProcessPayout();
  const [payoutMethod, setPayoutMethod] = useState('mtn');
  const [payoutOpen, setPayoutOpen] = useState(false);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!ambassador) return <AdminLayout><div>Ambassador not found</div></AdminLayout>;

  const rankColors: Record<string, string> = {
    Scout: 'bg-gray-100 text-gray-800',
    Bronze: 'bg-orange-100 text-orange-800',
    Silver: 'bg-slate-100 text-slate-800',
    Gold: 'bg-yellow-100 text-yellow-800',
    Platinum: 'bg-blue-100 text-blue-800',
    'Campus King': 'bg-purple-100 text-purple-800',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/ambassadors">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{ambassador.name}</h1>
            <p className="text-muted-foreground">{ambassador.territory} • {ambassador.campus}</p>
          </div>
          <Badge className={rankColors[ambassador.rank]}>
            {ambassador.rank}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ambassador.points.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users Recruited
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ambassador.usersRecruited}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Monthly Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GHS {ambassador.monthlySales.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                This Month Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GHS {ambassador.monthlyEarnings}</div>
              <Dialog open={payoutOpen} onOpenChange={setPayoutOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="mt-2 w-full">Process Payout</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Process Payout</DialogTitle>
                    <DialogDescription>
                      Send earnings to {ambassador.name}'s mobile money account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Payout Amount</Label>
                      <Input 
                        type="number" 
                        value={ambassador.monthlyEarnings} 
                        disabled
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Payment Method</Label>
                      <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                          <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                          <SelectItem value="airteltigo">AirtelTigo Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input 
                        placeholder="0501234567" 
                        value={ambassador.phone}
                        disabled
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        processPayout.mutate({
                          id: ambassador.id,
                          amount: ambassador.monthlyEarnings,
                          method: payoutMethod,
                        });
                        setPayoutOpen(false);
                      }}
                      disabled={processPayout.isPending}
                      className="w-full"
                    >
                      {processPayout.isPending ? 'Processing...' : 'Confirm Payout'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="missions">Active Missions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{ambassador.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{ambassador.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="font-medium">{ambassador.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-medium">{ambassador.rating} / 5.0</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">This Week Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <p className="font-medium">{ambassador.performanceMetrics?.ordersThisWeek || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">New Users</p>
                    <p className="font-medium">{ambassador.performanceMetrics?.newUsersThisWeek || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sales</p>
                    <p className="font-medium">GHS {ambassador.performanceMetrics?.salesThisWeek || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Points Earned</p>
                    <p className="font-medium">+{ambassador.performanceMetrics?.pointsThisWeek || 0}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="missions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Missions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ambassador.recentMissions?.map((mission: any) => (
                    <div key={mission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{mission.name}</p>
                        <p className="text-sm text-muted-foreground">{mission.points} points</p>
                      </div>
                      <div className="text-right">
                        {mission.completed ? (
                          <Badge>Completed</Badge>
                        ) : (
                          <p className="text-sm font-medium text-orange-600">{mission.expiresIn}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Account Status</Label>
                  <Select 
                    defaultValue={ambassador.status}
                    onValueChange={(value) => {
                      updateStatus.mutate({ id: ambassador.id, status: value });
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
