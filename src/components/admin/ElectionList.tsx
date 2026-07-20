'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Election } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function ElectionList() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const { data, error: err } = await supabase
          .from('elections')
          .select('*')
          .order('created_at', { ascending: false });

        if (err) throw err;
        setElections(data as Election[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch elections');
        toast.error('Failed to fetch elections');
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'badge-warning',
      published: 'badge-primary',
      ongoing: 'badge-success',
      closed: 'badge-danger',
      archived: 'badge-secondary',
    };
    return colors[status] || 'badge-primary';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="grid gap-6">
      {elections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No elections found</p>
          <Link href="/admin/elections/new" className="btn-primary">
            Create Election
          </Link>
        </div>
      ) : (
        elections.map((election) => (
          <div key={election.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{election.name}</h3>
                {election.description && (
                  <p className="text-gray-600 text-sm mt-1">{election.description}</p>
                )}
              </div>
              <span className={`badge ${getStatusBadge(election.status)}`}>
                {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-500">Start</p>
                <p className="font-medium text-gray-900">
                  {new Date(election.start_time).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">End</p>
                <p className="font-medium text-gray-900">
                  {new Date(election.end_time).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/admin/elections/${election.id}`}
                className="btn-primary py-2 text-sm"
              >
                Manage
              </Link>
              <Link
                href={`/admin/elections/${election.id}/results`}
                className="btn-secondary py-2 text-sm"
              >
                Results
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
