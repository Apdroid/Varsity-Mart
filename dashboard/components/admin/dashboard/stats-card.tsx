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
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        green: 'bg-green-500/10 text-green-600 dark:text-green-400',
        purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-2">{value}</h3>
                    {change !== undefined && (
                        <div className="flex items-center gap-1 mt-2">
                            {isPositive ? (
                                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400"/>
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400"/>
                            )}
                            <span
                                className={cn(
                                    'text-sm font-medium',
                                    isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                )}
                            >
                {isPositive ? '+' : ''}{change}%
              </span>
                        </div>
                    )}
                </div>
                {icon && <div className={cn('p-3 rounded-lg', colorVariants[color])}>{icon}</div>}
            </div>
        </Card>
    );
}
