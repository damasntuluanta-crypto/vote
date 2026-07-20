'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Election, Position, Candidate } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import toast from 'react-hot-toast';

interface VotingCardProps {
  position: Position;
  candidates: Candidate[];
  electionId: string;
  onVote: () => void;
  disabled: boolean;
}

export function VotingCard({
  position,
  candidates,
  electionId,
  onVote,
  disabled,
}: VotingCardProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleCandidate = (candidateId: string) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates((prev) => prev.filter((id) => id !== candidateId));
    } else {
      if (selectedCandidates.length < position.max_votes) {
        setSelectedCandidates((prev) => [...prev, candidateId]);
      }
    }
  };

  const submitVotes = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) throw new Error('Not authenticated');

      // Insert votes
      const votes = selectedCandidates.map((candidateId) => ({
        election_id: electionId,
        position_id: position.id,
        candidate_id: candidateId,
        voter_id: sessionData.session.user.id,
      }));

      const { error } = await supabase.from('votes').insert(votes);
      if (error) throw error;

      toast.success('Your vote has been recorded!');
      setSelectedCandidates([]);
      onVote();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit vote'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{position.name}</h3>
      {position.description && (
        <p className="text-gray-600 text-sm mb-4">{position.description}</p>
      )}

      <p className="text-sm text-primary font-medium mb-4">
        Select up to {position.max_votes} candidate{position.max_votes > 1 ? 's' : ''}
      </p>

      <div className="space-y-3 mb-6">
        {candidates.map((candidate) => (
          <label
            key={candidate.id}
            className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedCandidates.includes(candidate.id)}
              onChange={() => toggleCandidate(candidate.id)}
              disabled={
                disabled ||
                (!selectedCandidates.includes(candidate.id) &&
                  selectedCandidates.length >= position.max_votes)
              }
              className="mt-1 mr-3 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{candidate.name}</p>
              {candidate.description && (
                <p className="text-sm text-gray-600 mt-1">{candidate.description}</p>
              )}
              {candidate.qualifications && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Qualifications:</strong> {candidate.qualifications}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={submitVotes}
        disabled={disabled || selectedCandidates.length === 0 || loading}
        className="btn-primary w-full"
      >
        {loading ? 'Submitting...' : `Vote for ${selectedCandidates.length} candidate(s)`}
      </button>
    </div>
  );
}
