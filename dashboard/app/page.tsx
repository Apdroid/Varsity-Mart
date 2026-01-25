'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        router.push('/admin');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">VarsityMart Admin Dashboard</h1>
                <p className="text-slate-400">Redirecting to dashboard...</p>
            </div>
        </div>
    );
}
