'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 backdrop-blur-sm mb-4">
          <svg className="w-16 h-16 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
          VarsityMart Admin
        </h1>
        <p className="text-slate-400 text-lg">Loading dashboard...</p>
        <div className="flex gap-2 justify-center mt-6">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
