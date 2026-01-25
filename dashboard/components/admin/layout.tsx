'use client';

import React from "react"

import {AppSidebar} from './app-sidebar';
import {AdminHeader} from './header';
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({children}: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <AdminHeader/>
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-6">{children}</div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
