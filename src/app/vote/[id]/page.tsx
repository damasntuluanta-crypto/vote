'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/common/Header';
import { supabase } from '@/lib/supabase';
import { Election, Position, Candidate } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { VotingCard } from '@/components/voter/VotingCard';
import toast from 'react-hot-toast';

interface PageProps {
  params: {
    id: string;
  };
}

export default function VoteElectionPage({ params }: PageProps) {
  const [election, setElection] = useState<Election | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidates, setCandidates] = useState<Record<string, Candidate[]>>({});
  const [votedPositions, setVotedPositions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session?.user) throw new Error('Not authenticated');

        // Check if user is eligible
        const { data: eligibleData, error: eligibleError } = await supabase
          .from('eligible_voters')
          .select('*')
          .eq('election_id', params.id)
          .eq('user_id', sessionData.session.user.id);

        if (eligibleError) throw eligibleError;
        setIsEligible((eligibleData && eligibleData.length > 0) || false);

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
          .select('*');

        if (candidatesError) throw candidatesError;

        const grouped: Record<string, Candidate[]> = {};
        (candidatesData as Candidate[]).forEach((candidate) => {
          if (!grouped[candidate.position_id]) {
            grouped[candidate.position_id] = [];
          }
          grouped[candidate.position_id].push(candidate);
        });
        setCandidates(grouped);

        // Fetch user's voted positions
        const { data: votesData, error: votesError } = await supabase
          .from('votes')
          .select('position_id')
          .eq('election_id', params.id)
          .eq('voter_id', sessionData.session.user.id);

        if (votesError) throw votesError;
        const voted = new Set((votesData as any[]).map((v) => v.position_id));
        setVotedPositions(voted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        toast.error('Failed to load election');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleVote = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) return;

      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('position_id')
        .eq('election_id', params.id)
        .eq('voter_id', sessionData.session.user.id);

      if (votesError) throw votesError;
      const voted = new Set((votesData as any[]).map((v) => v.position_id));
      setVotedPositions(voted);
    } catch (err) {
      toast.error('Failed to refresh vote status');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!election) return <ErrorMessage message="Election not found" />;

  const now = new Date();
  const electionClosed = now > new Date(election.end_time);
  const votingDisabled = electionClosed || election.status !== 'ongoing';

  if (!isEligible && election.status === 'ongoing') {
    return (
      <ProtectedRoute requiredRole="student">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12 max-w-md mx-auto">
            <p className="text-lg font-bold text-gray-900 mb-2">Not Eligible</p>
            <p className="text-gray-600">
              You are not eligible to vote in this election. Please contact the admin.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="student">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.name}</h1>
        {election.description && (
          <p className="text-gray-600 mb-6">{election.description}</p>
        )}

        {votingDisabled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-yellow-800">
            {electionClosed
              ? 'Voting for this election has ended.'
              : 'Voting is not currently open for this election.'}
          </div>
        )}

        <div className="space-y-6">
          {positions.map((position) => (
            <VotingCard
              key={position.id}
              position={position}
              candidates={candidates[position.id] || []}
              electionId={params.id}
              onVote={handleVote}
              disabled={votingDisabled || votedPositions.has(position.id)}
            />
          ))}
        </div>

        {votedPositions.size > 0 && (
          <div className="mt-8 p-6 bg-success/10 text-success rounded-lg text-center">
            <p className="font-bold text-lg">
              You have voted for {votedPositions.size} position{votedPositions.size > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
