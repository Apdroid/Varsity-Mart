'use client';

import * as React from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {
    BarChart3,
    FileText,
    LogOut,
    Package,
    Settings,
    ShoppingCart,
    Trophy,
    Users,
    UtensilsCrossed,
} from 'lucide-react';
import {useAuth} from '@/lib/auth';
import {toast} from 'sonner';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigation = [
    {name: 'Dashboard', href: '/admin', icon: BarChart3},
    {name: 'Users', href: '/admin/users', icon: Users},
    {name: 'Ambassadors', href: '/admin/ambassadors', icon: Trophy},
    {name: 'Orders', href: '/admin/orders', icon: ShoppingCart},
    {name: 'Products', href: '/admin/products', icon: Package},
    {name: 'Restaurants', href: '/admin/restaurants', icon: UtensilsCrossed},
    {name: 'KYC Verification', href: '/admin/kyc', icon: FileText},
    {name: 'Reports', href: '/admin/reports', icon: BarChart3},
    {name: 'Settings', href: '/admin/settings', icon: Settings},
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const {user, logout} = useAuth();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/auth/login');
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-sidebar-border p-3">
                <Link
                    href="/admin"
                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent group"
                >
                    <div
                        className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0 transition-transform group-hover:scale-105">
                        <Package className="size-4"/>
                    </div>
                    <div
                        className="flex flex-col gap-0.5 leading-none overflow-hidden group-data-[collapsible=icon]:hidden">
                        <span className="font-semibold truncate">VarsityMart</span>
                        <span className="text-xs text-muted-foreground truncate">Admin Dashboard</span>
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="px-2 py-4 gap-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                            <SidebarMenuItem key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                                        transition-all duration-200 ease-in-out group
                                        ${isActive
                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                                    }
                                    `}
                                >
                                    <Icon
                                        className={`size-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-sidebar-accent-foreground' : ''}`}/>
                                    <span className="truncate group-data-[collapsible=icon]:hidden">{item.name}</span>
                                    {isActive && (
                                        <span
                                            className="ml-auto h-1.5 w-1.5 rounded-full bg-primary group-data-[collapsible=icon]:hidden"/>
                                    )}
                                </Link>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border p-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-all duration-200 hover:bg-sidebar-accent group cursor-pointer"
                        >
                            <div
                                className="flex aspect-square size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shrink-0 transition-transform duration-200 group-hover:scale-105"/>
                            <div
                                className="flex flex-col gap-0.5 leading-none overflow-hidden group-data-[collapsible=icon]:hidden">
                                <span className="font-semibold truncate text-sm">{user?.name || 'Admin User'}</span>
                                <span
                                    className="text-xs text-muted-foreground truncate">{user?.email || 'admin@varsitymart.com'}</span>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start" className="w-56">
                        <DropdownMenuItem asChild>
                            <Link href="/admin/settings" className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4"/>
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            className="text-destructive cursor-pointer focus:text-destructive"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4"/>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}
