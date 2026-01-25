'use client';

import React, {Suspense, useEffect, useState} from "react"
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Checkbox} from '@/components/ui/checkbox';
import {Loader2, Lock, Mail} from 'lucide-react';
import {toast} from 'sonner';
import {useAuth} from '@/lib/auth';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {login, isAuthenticated, isLoading: authLoading} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get redirect URL from query params
    const redirectUrl = searchParams.get('redirect') || '/admin';

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push(decodeURIComponent(redirectUrl));
        }
    }, [isAuthenticated, router, redirectUrl]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!email || !password) {
                setError('Please fill in all fields');
                return;
            }

            if (!email.includes('@')) {
                setError('Please enter a valid email');
                return;
            }

            const success = await login(email, password);

            if (success) {
                toast.success('Login successful!');
                router.push(decodeURIComponent(redirectUrl));
            } else {
                setError('Invalid email or password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4 text-primary-foreground">
                        <Lock className="h-6 w-6"/>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">VarsityMart</h1>
                    <p className="text-muted-foreground">Admin Dashboard</p>
                </div>

                {/* Login Card */}
                <Card>
                    <CardHeader className="pb-4 text-center">
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in to your admin account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@varsitymart.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">
                                        Password
                                    </Label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    disabled={loading}
                                />
                                <Label htmlFor="remember"
                                       className="text-sm text-muted-foreground font-normal cursor-pointer">
                                    Remember me
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-6 p-3 rounded-lg bg-muted border border-border">
                            <p className="text-xs text-muted-foreground mb-2 font-medium">Demo Credentials:</p>
                            <p className="text-xs text-muted-foreground">Email: admin@varsitymart.com</p>
                            <p className="text-xs text-muted-foreground">Password: password123</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-muted-foreground text-sm mt-6">
                    Protected by enterprise-grade security
                </p>
            </div>
        </div>
    );
}

function LoginLoading() {
    return (
        <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading/>}>
            <LoginForm/>
        </Suspense>
    );
}

