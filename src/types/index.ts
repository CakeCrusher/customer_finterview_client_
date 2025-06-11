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

export interface TaskRequirements {
  audio: boolean;
  screenShare: boolean;
  webcam: boolean;
  fileUpload: boolean;
}

export interface SupportingFile {
  name: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  prompt: string;
  aiBehavior: AIBehavior;
  durationMinutes?: number;
  requirements: TaskRequirements;
  supportingFiles: SupportingFile[];
  criteria: Criterion[];
  order: number;
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
  createdAt: string;
  updatedAt: string;
  ownerEmail: string;
  generalCriteria: Criterion[];
  tasks: Task[];
  stats?: Stats;
}

export interface User {
  email: string;
  company: string;
}