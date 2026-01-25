'use client';

import {ReactNode} from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from '@/lib/query-client';
import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from 'sonner';

export function Providers({children}: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster
                    position="bottom-right"
                    richColors
                    closeButton
                    theme="system"
                />
            </QueryClientProvider>
        </ThemeProvider>
    );
}
