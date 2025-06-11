export type CriterionScope = 'general' | 'task';
export type CriterionType = 'rating' | 'numeric' | 'boolean' | 'text';
export type AIBehavior = 'passive' | 'neutral' | 'active' | 'very_active';
export type InterviewStatus = 'draft' | 'live' | 'closed';

export interface Criterion {
  id: string;
  name: string;
  description?: string;
  type: CriterionType;
  scope: CriterionScope;
}

export interface SupportingFile {
  name: string;
  url: string;
}

export interface Task {
  id: string;
  interview_id: string;
  title: string;
  prompt: string;
  ai_behavior: AIBehavior;
  duration_minutes?: number;
  req_audio: boolean;
  req_screen_share: boolean;
  req_webcam: boolean;
  req_file_upload: boolean;
  task_order: number;

  // Relational data that's not a direct column
  supportingFiles: SupportingFile[];
  criteria: Criterion[];
}

export interface Stats {
  invited: number;
  completed: number;
  graded: number;
}

export interface Interview {
  id: string;
  title: string;
  status: InterviewStatus;
  created_at: string;
  updated_at: string;
  owner_email: string;
  generalCriteria: Criterion[];
  tasks: Task[];
  stats?: Stats;
}

export interface User {
  email: string;
  company: string;
}