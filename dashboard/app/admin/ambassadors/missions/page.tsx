'use client';

import { useState } from 'react';
import { useMissions } from '@/lib/hooks';
import { AdminLayout } from '@/components/admin/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Clock, Target, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const categoryIcons: Record<string, any> = {
  marketing: <TrendingUp className="h-5 w-5" />,
  sales: <Target className="h-5 w-5" />,
  growth: <TrendingUp className="h-5 w-5" />,
};

export default function MissionsPage() {
  const { data: missions, isLoading } = useMissions();
  const [missionType, setMissionType] = useState('all');
  const [newMissionOpen, setNewMissionOpen] = useState(false);

  const categoryColors: Record<string, string> = {
    marketing: 'bg-blue-100 text-blue-800',
    sales: 'bg-green-100 text-green-800',
    growth: 'bg-purple-100 text-purple-800',
  };

  const filteredMissions = missions?.filter((mission: any) => 
    missionType === 'all' || mission.category === missionType
  ) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Missions & Challenges</h1>
            <p className="text-muted-foreground mt-1">Daily, weekly, and flash missions to boost engagement</p>
          </div>
          <Dialog open={newMissionOpen} onOpenChange={setNewMissionOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Mission
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Mission</DialogTitle>
                <DialogDescription>
                  Add a new mission to challenge ambassadors
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Mission Name</Label>
                  <Input placeholder="e.g., Post 3 Flyers" className="mt-1" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="What does the ambassador need to do?" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Points Reward</Label>
                    <Input type="number" placeholder="100" className="mt-1" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily (24 hours)</SelectItem>
                      <SelectItem value="weekly">Weekly (7 days)</SelectItem>
                      <SelectItem value="flash">Flash (3 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setNewMissionOpen(false)} className="w-full">
                  Create Mission
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Missions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : missions?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Running right now</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">73%</div>
              <p className="text-xs text-muted-foreground mt-1">Ambassadors completing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Points Distributed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,450</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Missions List */}
        <Card>
          <CardHeader>
            <CardTitle>All Missions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={missionType === 'all' ? 'default' : 'outline'}
                onClick={() => setMissionType('all')}
              >
                All
              </Button>
              <Button
                variant={missionType === 'marketing' ? 'default' : 'outline'}
                onClick={() => setMissionType('marketing')}
              >
                Marketing
              </Button>
              <Button
                variant={missionType === 'sales' ? 'default' : 'outline'}
                onClick={() => setMissionType('sales')}
              >
                Sales
              </Button>
              <Button
                variant={missionType === 'growth' ? 'default' : 'outline'}
                onClick={() => setMissionType('growth')}
              >
                Growth
              </Button>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))
              ) : filteredMissions.length > 0 ? (
                filteredMissions.map((mission: any) => (
                  <div key={mission.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-lg">{mission.name}</p>
                          <Badge className={categoryColors[mission.category]}>
                            {mission.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{mission.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-blue-600">{mission.points}</div>
                        <p className="text-xs text-muted-foreground">Points</p>
                        {mission.expiresIn && (
                          <div className="flex items-center gap-1 text-orange-600 text-xs font-semibold mt-2">
                            <Clock className="h-3 w-3" />
                            {mission.expiresIn}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No missions found in this category
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mission Types */}
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily Missions</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Challenges</TabsTrigger>
            <TabsTrigger value="flash">Flash Missions</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Missions (Reset at Midnight)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Daily missions refresh every 24 hours. Ambassadors can complete these for consistent points and maintain streaks.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Challenges (7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Weekly challenges provide bigger point rewards and require more effort. Perfect for major milestones.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flash" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Flash Missions (3 Hours)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Time-limited flash missions create urgency and excitement. Use these during peak hours to drive engagement spikes.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
