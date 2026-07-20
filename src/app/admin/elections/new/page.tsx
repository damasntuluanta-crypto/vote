'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/common/Header';
import { CreateElectionForm } from '@/components/admin/CreateElectionForm';

export default function CreateElectionPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Election</h1>
        <div className="card max-w-2xl">
          <CreateElectionForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}
