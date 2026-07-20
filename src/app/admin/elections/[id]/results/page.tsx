'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/common/Header';
import { supabase } from '@/lib/supabase';
import { Election, Position, Candidate, Vote } from '@/types';
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

export default function ResultsPage({ params }: PageProps) {
  const [election, setElection] = useState<Election | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [results, setResults] = useState<Record<string, ResultData[]>>({});
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
          .select('*, candidates(name)')
          .eq('election_id', params.id);

        if (votesError) throw votesError;

        const resultsObj: Record<string, Record<string, number>> = {};
        const candidateNames: Record<string, string> = {};

        // Fetch all candidates to map IDs to names
        const { data: candidatesData } = await supabase
          .from('candidates')
          .select('*');

        if (candidatesData) {
          candidatesData.forEach((candidate: any) => {
            candidateNames[candidate.id] = candidate.name;
          });
        }

        (votesData as any[]).forEach((vote) => {
          if (!resultsObj[vote.position_id]) {
            resultsObj[vote.position_id] = {};
          }
          const candidateName = candidateNames[vote.candidate_id] || 'Unknown';
          resultsObj[vote.position_id][candidateName] =
            (resultsObj[vote.position_id][candidateName] || 0) + 1;
        });

        const resultsFormatted: Record<string, ResultData[]> = {};
        Object.keys(resultsObj).forEach((positionId) => {
          resultsFormatted[positionId] = Object.entries(resultsObj[positionId]).map(
            ([name, votes]) => ({
              name,
              votes: votes as number,
            })
          );
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
    <ProtectedRoute requiredRole="admin">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Results: {election.name}</h1>
        <p className="text-gray-600 mb-8">Status: {election.status}</p>

        <div className="space-y-8">
          {positions.map((position) => (
            <div key={position.id} className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {position.name}
              </h2>

              {results[position.id]?.length > 0 ? (
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={results[position.id]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="votes" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results[position.id].map((result, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold text-gray-900">{result.name}</p>
                        <p className="text-2xl font-bold text-primary mt-1">
                          {result.votes} votes
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {
                            (
                              (result.votes /
                                results[position.id].reduce(
                                  (sum, r) => sum + r.votes,
                                  0
                                )) *
                              100
                            ).toFixed(1)
                          }
                          %
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No votes yet for this position.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
