'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/common/Header';
import { supabase } from '@/lib/supabase';
import { Election, Position, Candidate } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AddPositionForm } from '@/components/admin/AddPositionForm';
import { AddCandidateForm } from '@/components/admin/AddCandidateForm';
import { ElectionStatus } from '@/components/admin/ElectionStatus';
import toast from 'react-hot-toast';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ElectionDetailPage({ params }: PageProps) {
  const [election, setElection] = useState<Election | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidates, setCandidates] = useState<Record<string, Candidate[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch election
        const { data: electionData, error: electionError } = await supabase
          .from('elections')
          .select('*')
          .eq('id', params.id)
          .single();

        if (electionError) throw electionError;
        setElection(electionData as Election);

        // Fetch positions
        const { data: positionsData, error: positionsError } = await supabase
          .from('positions')
          .select('*')
          .eq('election_id', params.id);

        if (positionsError) throw positionsError;
        setPositions(positionsData as Position[]);

        // Fetch candidates
        const { data: candidatesData, error: candidatesError } = await supabase
          .from('candidates')
          .select('*, position_id');

        if (candidatesError) throw candidatesError;

        const grouped: Record<string, Candidate[]> = {};
        (candidatesData as any[]).forEach((candidate) => {
          if (!grouped[candidate.position_id]) {
            grouped[candidate.position_id] = [];
          }
          grouped[candidate.position_id].push(candidate);
        });
        setCandidates(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        toast.error('Failed to load election data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handlePositionAdded = async () => {
    try {
      const { data, error: err } = await supabase
        .from('positions')
        .select('*')
        .eq('election_id', params.id);

      if (err) throw err;
      setPositions(data as Position[]);
    } catch (err) {
      toast.error('Failed to refresh positions');
    }
  };

  const handleCandidateAdded = async () => {
    try {
      const { data, error: err } = await supabase
        .from('candidates')
        .select('*');

      if (err) throw err;

      const grouped: Record<string, Candidate[]> = {};
      (data as any[]).forEach((candidate) => {
        if (!grouped[candidate.position_id]) {
          grouped[candidate.position_id] = [];
        }
        grouped[candidate.position_id].push(candidate);
      });
      setCandidates(grouped);
    } catch (err) {
      toast.error('Failed to refresh candidates');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!election) return <ErrorMessage message="Election not found" />;

  return (
    <ProtectedRoute requiredRole="admin">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.name}</h1>
        {election.description && (
          <p className="text-gray-600 mb-6">{election.description}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <AddPositionForm
              electionId={params.id}
              onPositionAdded={handlePositionAdded}
            />

            {positions.map((position) => (
              <div key={position.id} className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {position.name}
                </h3>
                {position.description && (
                  <p className="text-gray-600 mb-4">{position.description}</p>
                )}

                <AddCandidateForm
                  positionId={position.id}
                  onCandidateAdded={handleCandidateAdded}
                />

                {candidates[position.id]?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-bold text-gray-900 mb-4">Candidates</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {candidates[position.id].map((candidate) => (
                        <div
                          key={candidate.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          {candidate.photo_url && (
                            <img
                              src={candidate.photo_url}
                              alt={candidate.name}
                              className="w-full h-40 object-cover rounded mb-3"
                            />
                          )}
                          <h5 className="font-bold text-gray-900">
                            {candidate.name}
                          </h5>
                          {candidate.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {candidate.description}
                            </p>
                          )}
                          {candidate.qualifications && (
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>Qualifications:</strong>{' '}
                              {candidate.qualifications}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <ElectionStatus electionId={params.id} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
