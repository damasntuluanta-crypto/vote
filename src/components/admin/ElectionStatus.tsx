'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Election } from '@/types';
import toast from 'react-hot-toast';

interface ElectionStatusProps {
  electionId: string;
}

export function ElectionStatus({ electionId }: ElectionStatusProps) {
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const { data, error } = await supabase
          .from('elections')
          .select('*')
          .eq('id', electionId)
          .single();

        if (error) throw error;
        setElection(data as Election);
      } catch (error) {
        toast.error('Failed to fetch election');
      }
    };

    fetchElection();
  }, [electionId]);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('elections')
        .update({ status: newStatus })
        .eq('id', electionId);

      if (error) throw error;

      setElection((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      toast.success(`Election status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update election status');
    } finally {
      setLoading(false);
    }
  };

  if (!election) return null;

  return (
    <div className="card space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Election Status</h3>
        <p className="text-2xl font-bold text-primary capitalize">{election.status}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {election.status === 'draft' && (
          <button
            onClick={() => updateStatus('published')}
            disabled={loading}
            className="btn-primary text-sm py-2"
          >
            Publish
          </button>
        )}
        {election.status === 'published' && (
          <button
            onClick={() => updateStatus('ongoing')}
            disabled={loading}
            className="btn-success text-sm py-2 bg-success hover:bg-success/90"
          >
            Start Voting
          </button>
        )}
        {election.status === 'ongoing' && (
          <button
            onClick={() => updateStatus('closed')}
            disabled={loading}
            className="btn-danger text-sm py-2"
          >
            Close Voting
          </button>
        )}
      </div>
    </div>
  );
}
