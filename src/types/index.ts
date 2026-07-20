export interface User {
  id: string;
  name: string;
  student_id: string;
  email: string;
  role: 'admin' | 'student';
  is_eligible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Election {
  id: string;
  name: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: 'draft' | 'published' | 'ongoing' | 'closed' | 'archived';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Position {
  id: string;
  election_id: string;
  name: string;
  description?: string;
  max_votes: number;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  position_id: string;
  name: string;
  description?: string;
  photo_url?: string;
  qualifications?: string;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  election_id: string;
  position_id: string;
  candidate_id: string;
  voter_id: string;
  created_at: string;
}

export interface EligibleVoter {
  id: string;
  election_id: string;
  user_id: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  election_id?: string;
  user_id?: string;
  action: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface VoteResult {
  candidate_id: string;
  candidate_name: string;
  votes: number;
  percentage: number;
}

export interface PositionResult {
  position_id: string;
  position_name: string;
  results: VoteResult[];
  total_votes: number;
}
