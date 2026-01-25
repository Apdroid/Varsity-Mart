'use client';

import * as React from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {BarChart3, FileText, Package, Settings, ShoppingCart, Users, UtensilsCrossed,} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';

const navigation = [
    {name: 'Dashboard', href: '/admin', icon: BarChart3},
    {name: 'Users', href: '/admin/users', icon: Users},
    {name: 'Orders', href: '/admin/orders', icon: ShoppingCart},
    {name: 'Products', href: '/admin/products', icon: Package},
    {name: 'Restaurants', href: '/admin/restaurants', icon: UtensilsCrossed},
    {name: 'KYC Verification', href: '/admin/kyc', icon: FileText},
    {name: 'Reports', href: '/admin/reports', icon: BarChart3},
    {name: 'Settings', href: '/admin/settings', icon: Settings},
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin">
                                <div
                                    className="flex aspect-square size-8 items-center justify-center rounded-lg text-primary-foreground">
                                    <Package className="size-4"/>
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">VarsityMart</span>
                                    <span className="text-xs text-muted-foreground">Admin Dashboard</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="px-2 py-4 gap-1.5">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <SidebarMenuItem key={item.name}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={item.name}
                                >
                                    <Link href={item.href}>
                                        <Icon/>
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="hover:bg-transparent cursor-default">
                            <div
                                className="flex aspect-square size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600"/>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-semibold">Admin User</span>
                                <span className="text-xs text-muted-foreground">admin@varsitymart.com</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}
