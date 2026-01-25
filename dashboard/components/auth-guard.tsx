'use client';

import {useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useAuthStore} from '@/lib/auth';
import {Loader2} from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({children}: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const {isAuthenticated} = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Small delay to allow hydration
        const timer = setTimeout(() => {
            setIsChecking(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isChecking && !isAuthenticated) {
            // Store the intended destination for redirect after login
            const redirectUrl = encodeURIComponent(pathname);
            router.push(`/auth/login?redirect=${redirectUrl}`);
        }
    }, [isAuthenticated, isChecking, pathname, router]);

    // Show loading spinner while checking authentication
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, show nothing (redirect will happen)
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                    <p className="text-sm text-muted-foreground">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

// HOC for protecting pages
export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function AuthenticatedComponent(props: P) {
        return (
            <AuthGuard>
                <WrappedComponent {...props} />
            </AuthGuard>
        );
    };
}
