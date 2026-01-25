'use client';

import React from "react"
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';
import {AppSidebar} from './app-sidebar';
import {AdminHeader} from './header';
import {AuthGuard} from '@/components/auth-guard';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({children}: AdminLayoutProps) {
    return (
        <AuthGuard>
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset>
                    <AdminHeader/>
                    <main className="flex-1 overflow-auto">
                        <div className="p-4 md:p-6 lg:p-8">{children}</div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </AuthGuard>
    );
}
