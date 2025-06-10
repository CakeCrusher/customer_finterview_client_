export interface CandidateScore {
  criterionId: string;
  criterionName: string;
  score: number | string | boolean;
  maxScore?: number;
}

export interface CandidateNote {
  author: string;
  column: string;
  content: string;
  createdAt: string;
}

export interface CandidateResult {
  id: string;
  name: string;
  email: string;
  completedAt: string;
  scores: CandidateScore[];
  notes: CandidateNote[];
  overallScore?: number;
}

export interface CandidatePerformanceData {
  candidates: CandidateResult[];
  criteriaColumns: Array<{
    id: string;
    name: string;
    type: 'rating' | 'numeric' | 'boolean' | 'text';
    scope: 'general' | 'task';
    taskName?: string;
  }>;
}