'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/common/Header';
import { ElectionList } from '@/components/admin/ElectionList';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link href="/admin/elections/new" className="btn-primary">
            Create Election
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-gray-600 text-sm">Total Elections</p>
            <p className="text-4xl font-bold text-primary mt-2">-</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Ongoing Elections</p>
            <p className="text-4xl font-bold text-success mt-2">-</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Total Votes</p>
            <p className="text-4xl font-bold text-secondary mt-2">-</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Elections</h2>
        <ElectionList />
      </div>
    </ProtectedRoute>
  );
}
