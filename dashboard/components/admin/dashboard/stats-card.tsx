'use client';

import React from "react"

import {Card} from '@/components/ui/card';
import {TrendingDown, TrendingUp} from 'lucide-react';
import {cn} from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon?: React.ReactNode;
    color?: 'blue' | 'green' | 'purple' | 'orange';
}

export function StatsCard({
                              title,
                              value,
                              change,
                              icon,
                              color = 'blue',
                          }: StatsCardProps) {
    const isPositive = change ? change >= 0 : false;

    const colorVariants = {
        blue: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30',
        green: 'from-green-500/20 to-green-600/10 text-green-400 border-green-500/30',
        purple: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30',
        orange: 'from-orange-500/20 to-orange-600/10 text-orange-400 border-orange-500/30',
    };

    const iconBgVariants = {
        blue: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20',
        green: 'bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20',
        purple: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20',
        orange: 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20',
    };

    return (
        <Card className={cn(
            "relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30",
            "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 hover:before:opacity-100 before:transition-opacity",
            colorVariants[color]
        )}>
            <div className="relative p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground/80">{title}</p>
                        <h3 className="text-3xl font-bold tracking-tight mt-2">{value}</h3>
                        {change !== undefined && (
                            <div className="flex items-center gap-1.5 mt-3">
                                {isPositive ? (
                                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                                        <TrendingUp className="h-3.5 w-3.5"/>
                                        <span className="text-xs font-semibold">
                                            {isPositive ? '+' : ''}{change}%
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
                                        <TrendingDown className="h-3.5 w-3.5"/>
                                        <span className="text-xs font-semibold">
                                            {change}%
                                        </span>
                                    </div>
                                )}
                                <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                            </div>
                        )}
                    </div>
                    {icon && (
                        <div className={cn(
                            'p-3.5 rounded-xl backdrop-blur-sm shadow-lg',
                            iconBgVariants[color]
                        )}>
                            {icon}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
