'use client';

import {useNotifications} from '@/lib/hooks';
import {useAuth} from '@/lib/auth';
import {useRouter} from 'next/navigation';
import {Bell, LogOut, Search, Settings} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Badge} from '@/components/ui/badge';
import {DarkModeToggle} from './dark-mode-toggle';
import {SidebarTrigger} from "@/components/ui/sidebar";
import {toast} from 'sonner';
import Link from 'next/link';

export function AdminHeader() {
    const {data: notifications} = useNotifications();
    const {user, logout} = useAuth();
    const router = useRouter();
    // All notifications are considered unread initially
    const unreadCount = notifications?.length ?? 0;

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/auth/login');
    };

    return (
        <header
            className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 gap-2 sm:gap-4"
        >
            <SidebarTrigger className="-ml-1"/>

            <div className="flex flex-1 items-center gap-4 md:gap-8">
                {/* Search Bar - Hidden on mobile */}
                <div
                    className="flex-1 hidden md:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-ring/20 transition-colors max-w-md">
                    <Search className="h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder="Search..."
                        className="bg-transparent border-0 focus-visible:ring-0 text-sm h-7"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                {/* Mobile Search Button */}
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Search className="h-5 w-5"/>
                </Button>

                {/* Dark Mode Toggle */}
                <DarkModeToggle/>

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5"/>
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72 sm:w-80">
                        <div className="px-4 py-2">
                            <h3 className="font-semibold">Notifications</h3>
                        </div>
                        <DropdownMenuSeparator/>
                        {notifications && notifications.length > 0 ? (
                            notifications.slice(0, 5).map((notification) => (
                                <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2">
                                    <div className="text-sm font-medium">{notification.message}</div>
                                    <div className="text-xs text-muted-foreground">{notification.timestamp}</div>
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-muted-foreground">No notifications</div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="rounded-full h-8 w-8 sm:h-10 sm:w-10 p-0 border border-border"
                        >
                            <div
                                className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem className="flex-col items-start cursor-default">
                            <div className="font-semibold">{user?.name || 'Admin User'}</div>
                            <div
                                className="text-xs text-muted-foreground">{user?.email || 'admin@varsitymart.com'}</div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
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
            </div>
        </header>
    );
}
