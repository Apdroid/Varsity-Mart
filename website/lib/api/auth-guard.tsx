"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/queries/useAuth";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/account",
  "/orders", 
  "/sell",
  "/seller",
  "/chat",
  "/wishlist",
  "/kyc"
];

// Routes that should redirect authenticated users (e.g., auth pages)
const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register", 
  "/auth/forgot-password",
  "/auth/reset-password"
];

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // AUTH GUARD DISABLED FOR TESTING PURPOSES
  const DISABLE_AUTH_GUARD = true;

  useEffect(() => {
    if (DISABLE_AUTH_GUARD || isLoading) return; // Wait for auth check to complete

    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname.startsWith(route)
    );
    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    // Redirect unauthenticated users from protected routes
    if (!isAuthenticated && isProtectedRoute) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Redirect authenticated users from auth pages  
    if (isAuthenticated && user && isAuthRoute) {
      const redirectTo = new URLSearchParams(window.location.search).get('redirect');
      router.replace(redirectTo || '/');
      return;
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

  // Show loading while checking auth status
  if (!DISABLE_AUTH_GUARD && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}