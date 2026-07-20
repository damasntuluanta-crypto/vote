'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/common/Header';
import { supabase } from '@/lib/supabase';
import { Election, Position } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ResultsPage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const { data, error: err } = await supabase
          .from('elections')
          .select('*')
          .eq('status', 'closed')
          .order('end_time', { ascending: false });

        if (err) throw err;
        setElections(data as Election[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch results');
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <ProtectedRoute requiredRole="student">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Election Results</h1>

        {error && <ErrorMessage message={error} />}

        {elections.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No results available yet.</p>
            <p className="text-gray-500">
              Results will be published when elections are closed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {elections.map((election) => (
              <Link
                key={election.id}
                href={`/results/${election.id}`}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {election.name}
                </h2>
                {election.description && (
                  <p className="text-gray-600 mb-4">{election.description}</p>
                )}
                <div className="text-sm text-gray-600">
                  <p>
                    Closed:{' '}
                    <span className="font-medium">
                      {new Date(election.end_time).toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="mt-4 text-primary font-medium">View Results →</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
