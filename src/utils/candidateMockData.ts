import { CandidateResult, CandidatePerformanceData } from '../types/candidate';

export const mockCandidateResults: CandidateResult[] = [
  {
    id: 'candidate-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    completedAt: '2024-01-22T14:30:00Z',
    overallScore: 4.2,
    scores: [
      { criterionId: 'comm-general', criterionName: 'Communication.general', score: 4 },
      { criterionId: 'prof-general', criterionName: 'Professionalism.general', score: 5 },
      { criterionId: 'depth-task1', criterionName: 'Depth of Answer.task1', score: 4 },
      { criterionId: 'clarity-task1', criterionName: 'Clarity.task1', score: 4 },
      { criterionId: 'excel-task2', criterionName: 'Excel Cleanliness.task2', score: 3 },
      { criterionId: 'calc-task2', criterionName: 'Calculation Accuracy.task2', score: 5 }
    ],
    notes: [
      {
        author: 'AI Interviewer',
        column: 'Communication.general',
        content: 'Clear articulation and confident tone throughout the interview.',
        createdAt: '2024-01-22T14:35:00Z'
      },
      {
        author: 'John Smith',
        column: 'Excel Cleanliness.task2',
        content: 'Model structure could be improved, but calculations were correct.',
        createdAt: '2024-01-22T15:00:00Z'
      }
    ]
  },
  {
    id: 'candidate-2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    completedAt: '2024-01-22T16:15:00Z',
    overallScore: 3.8,
    scores: [
      { criterionId: 'comm-general', criterionName: 'Communication.general', score: 3 },
      { criterionId: 'prof-general', criterionName: 'Professionalism.general', score: 4 },
      { criterionId: 'depth-task1', criterionName: 'Depth of Answer.task1', score: 4 },
      { criterionId: 'clarity-task1', criterionName: 'Clarity.task1', score: 3 },
      { criterionId: 'excel-task2', criterionName: 'Excel Cleanliness.task2', score: 5 },
      { criterionId: 'calc-task2', criterionName: 'Calculation Accuracy.task2', score: 4 }
    ],
    notes: [
      {
        author: 'AI Interviewer',
        column: 'Communication.general',
        content: 'Occasionally hesitant in responses, but improved throughout the interview.',
        createdAt: '2024-01-22T16:20:00Z'
      }
    ]
  },
  {
    id: 'candidate-3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    completedAt: '2024-01-23T10:45:00Z',
    overallScore: 4.5,
    scores: [
      { criterionId: 'comm-general', criterionName: 'Communication.general', score: 5 },
      { criterionId: 'prof-general', criterionName: 'Professionalism.general', score: 5 },
      { criterionId: 'depth-task1', criterionName: 'Depth of Answer.task1', score: 5 },
      { criterionId: 'clarity-task1', criterionName: 'Clarity.task1', score: 5 },
      { criterionId: 'excel-task2', criterionName: 'Excel Cleanliness.task2', score: 4 },
      { criterionId: 'calc-task2', criterionName: 'Calculation Accuracy.task2', score: 3 }
    ],
    notes: [
      {
        author: 'AI Interviewer',
        column: 'Communication.general',
        content: 'Exceptional communication skills with structured responses.',
        createdAt: '2024-01-23T10:50:00Z'
      },
      {
        author: 'John Smith',
        column: 'Calculation Accuracy.task2',
        content: 'Minor calculation error but showed good problem-solving approach.',
        createdAt: '2024-01-23T11:15:00Z'
      }
    ]
  },
  {
    id: 'candidate-4',
    name: 'David Park',
    email: 'david.park@email.com',
    completedAt: '2024-01-23T14:20:00Z',
    overallScore: 3.5,
    scores: [
      { criterionId: 'comm-general', criterionName: 'Communication.general', score: 3 },
      { criterionId: 'prof-general', criterionName: 'Professionalism.general', score: 4 },
      { criterionId: 'depth-task1', criterionName: 'Depth of Answer.task1', score: 3 },
      { criterionId: 'clarity-task1', criterionName: 'Clarity.task1', score: 4 },
      { criterionId: 'excel-task2', criterionName: 'Excel Cleanliness.task2', score: 3 },
      { criterionId: 'calc-task2', criterionName: 'Calculation Accuracy.task2', score: 4 }
    ],
    notes: []
  },
  {
    id: 'candidate-5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    completedAt: '2024-01-24T09:30:00Z',
    overallScore: 4.0,
    scores: [
      { criterionId: 'comm-general', criterionName: 'Communication.general', score: 4 },
      { criterionId: 'prof-general', criterionName: 'Professionalism.general', score: 4 },
      { criterionId: 'depth-task1', criterionName: 'Depth of Answer.task1', score: 4 },
      { criterionId: 'clarity-task1', criterionName: 'Clarity.task1', score: 4 },
      { criterionId: 'excel-task2', criterionName: 'Excel Cleanliness.task2', score: 4 },
      { criterionId: 'calc-task2', criterionName: 'Calculation Accuracy.task2', score: 4 }
    ],
    notes: [
      {
        author: 'AI Interviewer',
        column: 'Communication.general',
        content: 'Consistent performance across all areas with room for growth.',
        createdAt: '2024-01-24T09:35:00Z'
      }
    ]
  }
];

export const mockPerformanceData: CandidatePerformanceData = {
  candidates: mockCandidateResults,
  criteriaColumns: [
    { id: 'comm-general', name: 'Communication.general', type: 'rating', scope: 'general' },
    { id: 'prof-general', name: 'Professionalism.general', type: 'rating', scope: 'general' },
    { id: 'depth-task1', name: 'Depth of Answer.task1', type: 'rating', scope: 'task', taskName: 'Behavioral Questions' },
    { id: 'clarity-task1', name: 'Clarity.task1', type: 'rating', scope: 'task', taskName: 'Behavioral Questions' },
    { id: 'excel-task2', name: 'Excel Cleanliness.task2', type: 'rating', scope: 'task', taskName: 'Merger Math' },
    { id: 'calc-task2', name: 'Calculation Accuracy.task2', type: 'rating', scope: 'task', taskName: 'Merger Math' }
  ]
};