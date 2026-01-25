'use client';

import { useAmbassadorLeaderboard, useRewards } from '@/lib/hooks';
import { AdminLayout } from '@/components/admin/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Medal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useAmbassadorLeaderboard();
  const { data: rewards } = useRewards();

  const medalIcons = [
    <Crown key="1" className="h-5 w-5 text-yellow-500" />,
    <Medal key="2" className="h-5 w-5 text-slate-400" />,
    <Medal key="3" className="h-5 w-5 text-orange-400" />,
  ];

  const rankColors: Record<string, string> = {
    Scout: 'bg-gray-100 text-gray-800',
    Bronze: 'bg-orange-100 text-orange-800',
    Silver: 'bg-slate-100 text-slate-800',
    Gold: 'bg-yellow-100 text-yellow-800',
    Platinum: 'bg-blue-100 text-blue-800',
    'Campus King': 'bg-purple-100 text-purple-800',
    'Campus Queen': 'bg-pink-100 text-pink-800',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ambassador Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Top performers and their achievements</p>
        </div>

        <Tabs defaultValue="rankings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="rewards">Reward Structure</TabsTrigger>
          </TabsList>

          <TabsContent value="rankings" className="space-y-4">
            {/* Top 3 Spotlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))
              ) : (
                leaderboard?.slice(0, 3).map((ambassador: any, index: number) => (
                  <Card key={ambassador.rank} className="border-2 border-primary/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{ambassador.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{ambassador.campus}</p>
                        </div>
                        {medalIcons[index]}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold">{ambassador.points.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Points</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">GHS {ambassador.monthlyEarnings}</p>
                          <p className="text-xs text-muted-foreground">Earnings</p>
                        </div>
                        <Badge className="h-fit">Rank #{ambassador.rank}</Badge>
                      </div>
                      {index < 3 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-semibold text-green-600">
                            +GHS {150 - index * 70} bonus
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Full Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Full Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-12" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leaderboard?.map((ambassador: any, index: number) => (
                      <div key={ambassador.rank} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="text-center min-w-[3rem]">
                          <div className="text-lg font-bold">{ambassador.rank}</div>
                          {index === 0 && <Crown className="h-4 w-4 mx-auto text-yellow-500 mt-1" />}
                          {index === 1 && <Medal className="h-4 w-4 mx-auto text-slate-400 mt-1" />}
                          {index === 2 && <Medal className="h-4 w-4 mx-auto text-orange-400 mt-1" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{ambassador.name}</p>
                          <p className="text-sm text-muted-foreground">{ambassador.campus}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{ambassador.points.toLocaleString()} pts</p>
                          <p className="text-sm text-muted-foreground">GHS {ambassador.monthlyEarnings}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards?.map((reward: any, index: number) => (
                <Card key={reward.rank}>
                  <CardHeader>
                    <CardTitle className="text-lg">{reward.rank}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Cash Payout:</span>
                        <span className="font-bold">GHS {reward.cash}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Data Bundle:</span>
                        <span className="font-bold">{reward.data}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Monthly Bonus:</span>
                        <span className="font-bold">+GHS {reward.monthlyBonus}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Items:</p>
                      <div className="flex flex-wrap gap-2">
                        {reward.items.map((item: string) => (
                          <Badge key={item} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Total Value: ~GHS {
                          reward.cash + 
                          parseInt(reward.data) / 100 * 10 + 
                          (reward.items.length * 15)
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
