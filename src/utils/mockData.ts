import { Interview, Task, Criterion } from '../types';

export const mockCriteria: Criterion[] = [
  {
    id: '1',
    name: 'Communication',
    description: 'Clarity and effectiveness of verbal communication',
    type: 'rating',
    scope: 'general'
  },
  {
    id: '2',
    name: 'Professionalism',
    description: 'Professional demeanor and presentation',
    type: 'rating',
    scope: 'general'
  },
  {
    id: '3',
    name: 'Financial Analysis',
    description: 'Accuracy and depth of financial calculations',
    type: 'rating',
    scope: 'task'
  },
  {
    id: '4',
    name: 'Excel Proficiency',
    description: 'Technical skill in spreadsheet modeling',
    type: 'rating',
    scope: 'task'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Behavioral Questions',
    prompt: 'Start with "Tell me about yourself" and follow up with behavioral questions about teamwork, leadership, and handling challenges.',
    aiBehavior: 'neutral',
    durationMinutes: 10,
    requirements: {
      audio: true,
      screenShare: false,
      webcam: true,
      fileUpload: false
    },
    supportingFiles: [],
    criteria: [
      {
        id: '5',
        name: 'Depth of Answer',
        description: 'How detailed and thoughtful the responses are',
        type: 'rating',
        scope: 'task'
      }
    ],
    order: 0
  },
  {
    id: '2',
    title: 'Merger Math',
    prompt: 'Present a merger scenario with Company A acquiring Company B. Provide financial data and ask the candidate to calculate the deal value, synergies, and accretion/dilution analysis.',
    aiBehavior: 'active',
    durationMinutes: 25,
    requirements: {
      audio: true,
      screenShare: true,
      webcam: false,
      fileUpload: true
    },
    supportingFiles: [
      {
        name: 'Financial Statements.xlsx',
        url: 'https://example.com/financials.xlsx'
      }
    ],
    criteria: [
      {
        id: '6',
        name: 'Calculation Accuracy',
        description: 'Correctness of financial calculations',
        type: 'rating',
        scope: 'task'
      }
    ],
    order: 1
  }
];

export const mockInterviews: Interview[] = [
  {
    id: '1',
    title: 'Summer 2025 Junior Interns',
    status: 'live',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    generalCriteria: [mockCriteria[0], mockCriteria[1]],
    tasks: mockTasks,
    stats: {
      invited: 45,
      completed: 32,
      graded: 28
    }
  },
  {
    id: '2',
    title: 'Full-Time August 2025',
    status: 'draft',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-22T11:45:00Z',
    generalCriteria: [],
    tasks: [mockTasks[0]],
    stats: {
      invited: 0,
      completed: 0,
      graded: 0
    }
  },
  {
    id: '3',
    title: 'Fall Co-Op Program',
    status: 'closed',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-25T16:20:00Z',
    generalCriteria: [mockCriteria[0]],
    tasks: mockTasks,
    stats: {
      invited: 78,
      completed: 65,
      graded: 65
    }
  }
];

export const taskTemplates = [
  {
    id: 'behavioral',
    name: 'Behavioral Questions',
    description: 'Standard behavioral interview questions',
    defaultPrompt: 'Start with "Tell me about yourself" and follow up with behavioral questions about teamwork, leadership, and handling challenges.',
    defaultBehavior: 'neutral' as const,
    defaultDuration: 10,
    defaultRequirements: {
      audio: true,
      screenShare: false,
      webcam: true,
      fileUpload: false
    },
    suggestedCriteria: [
      {
        name: 'Depth of Answer',
        description: 'How detailed and thoughtful the responses are',
        type: 'rating' as const
      },
      {
        name: 'Clarity',
        description: 'How clearly the candidate communicates',
        type: 'rating' as const
      }
    ]
  },
  {
    id: 'merger-math',
    name: 'Merger Math',
    description: 'M&A financial modeling exercise',
    defaultPrompt: 'Present a merger scenario with Company A acquiring Company B. Provide financial data and ask the candidate to calculate the deal value, synergies, and accretion/dilution analysis.',
    defaultBehavior: 'active' as const,
    defaultDuration: 25,
    defaultRequirements: {
      audio: true,
      screenShare: true,
      webcam: false,
      fileUpload: true
    },
    suggestedCriteria: [
      {
        name: 'Calculation Accuracy',
        description: 'Correctness of financial calculations',
        type: 'rating' as const
      },
      {
        name: 'Excel Proficiency',
        description: 'Technical skill in spreadsheet modeling',
        type: 'rating' as const
      }
    ]
  },
  {
    id: 'accounting',
    name: 'Accounting Problem',
    description: 'Accounting principles and problem solving',
    defaultPrompt: 'Present an accounting scenario involving journal entries, financial statement preparation, or ratio analysis.',
    defaultBehavior: 'neutral' as const,
    defaultDuration: 15,
    defaultRequirements: {
      audio: true,
      screenShare: true,
      webcam: false,
      fileUpload: false
    },
    suggestedCriteria: [
      {
        name: 'Technical Accuracy',
        description: 'Correctness of accounting principles application',
        type: 'rating' as const
      }
    ]
  },
  {
    id: 'custom',
    name: 'Custom Task',
    description: 'Create a custom interview task',
    defaultPrompt: '',
    defaultBehavior: 'neutral' as const,
    defaultDuration: 10,
    defaultRequirements: {
      audio: true,
      screenShare: false,
      webcam: false,
      fileUpload: false
    },
    suggestedCriteria: []
  }
];