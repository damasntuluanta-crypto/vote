'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/vote');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-12 max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Vote</h1>
            <p className="text-gray-600 mb-8">Secondary School Vote Management System</p>
            <div className="space-y-4">
              <Link
                href="/login"
                className="block w-full btn-primary text-center"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block w-full btn-outline text-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
