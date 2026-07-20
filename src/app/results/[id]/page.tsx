'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/common/Header';
import { supabase } from '@/lib/supabase';
import { Election, Position, Candidate } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import toast from 'react-hot-toast';

interface PageProps {
  params: {
    id: string;
  };
}

interface ResultData {
  name: string;
  votes: number;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export default function ElectionResultsPage({ params }: PageProps) {
  const [election, setElection] = useState<Election | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [results, setResults] = useState<Record<string, ResultData[]>>({});
  const [totalVotes, setTotalVotes] = useState(0);
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

        // Fetch votes and calculate results
        const { data: votesData, error: votesError } = await supabase
          .from('votes')
          .select('*')
          .eq('election_id', params.id);

        if (votesError) throw votesError;

        const resultsObj: Record<string, Record<string, number>> = {};
        const candidateNames: Record<string, string> = {};

        // Fetch all candidates to map IDs to names
        const { data: candidatesData } = await supabase
          .from('candidates')
          .select('*');

        if (candidatesData) {
          (candidatesData as Candidate[]).forEach((candidate) => {
            candidateNames[candidate.id] = candidate.name;
          });
        }

        let total = 0;
        (votesData as any[]).forEach((vote) => {
          if (!resultsObj[vote.position_id]) {
            resultsObj[vote.position_id] = {};
          }
          const candidateName = candidateNames[vote.candidate_id] || 'Unknown';
          resultsObj[vote.position_id][candidateName] =
            (resultsObj[vote.position_id][candidateName] || 0) + 1;
          total++;
        });
        setTotalVotes(total);

        const resultsFormatted: Record<string, ResultData[]> = {};
        Object.keys(resultsObj).forEach((positionId) => {
          resultsFormatted[positionId] = Object.entries(resultsObj[positionId])
            .map(([name, votes]) => ({
              name,
              votes: votes as number,
            }))
            .sort((a, b) => b.votes - a.votes);
        });
        setResults(resultsFormatted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch results');
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!election) return <ErrorMessage message="Election not found" />;

  return (
    <ProtectedRoute requiredRole="student">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Results: {election.name}</h1>
        {election.description && (
          <p className="text-gray-600 mb-8">{election.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-gray-600 text-sm">Total Votes Cast</p>
            <p className="text-4xl font-bold text-primary mt-2">{totalVotes}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Positions</p>
            <p className="text-4xl font-bold text-secondary mt-2">{positions.length}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Status</p>
            <p className="text-xl font-bold text-success mt-2 capitalize">
              {election.status}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {positions.map((position, posIdx) => {
            const positionResults = results[position.id] || [];
            const positionTotalVotes = positionResults.reduce((sum, r) => sum + r.votes, 0);

            return (
              <div key={position.id} className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {position.name}
                </h2>

                {positionResults.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4">Vote Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={positionResults}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="votes" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-4">Results Summary</h3>
                      <div className="space-y-3">
                        {positionResults.map((result, idx) => {
                          const percentage = (result.votes / positionTotalVotes) * 100;
                          return (
                            <div key={idx} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold text-gray-900">
                                  {result.name}
                                </p>
                                <p className="text-sm font-bold text-primary">
                                  {percentage.toFixed(1)}%
                                </p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                {result.votes} vote{result.votes !== 1 ? 's' : ''}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No votes for this position.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}
