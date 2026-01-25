'use client';

import {useNotifications} from '@/lib/hooks';
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
import {SidebarTrigger} from '@/components/ui/sidebar';
import {Separator} from '@/components/ui/separator';

export function AdminHeader() {
    const {data: notifications} = useNotifications();
    const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

    return (
        <header
            className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
        >
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
            </div>

            {/* Search Bar */}
            <div className="flex-1 hidden md:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground"/>
                <Input
                    placeholder="Search..."
                    className="bg-transparent border-0 focus-visible:ring-0 text-sm h-8"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 ml-auto">
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
                    <DropdownMenuContent align="end" className="w-80">
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
                            className="rounded-full h-10 w-10 p-0 border"
                        >
                            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex-col items-start">
                            <div className="font-semibold">Admin User</div>
                            <div className="text-xs text-muted-foreground">admin@varsitymart.com</div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4"/>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4"/>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
