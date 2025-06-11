import React from 'react';
import { Monitor, Camera, Mic, Upload } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { CriterionForm } from './CriterionForm';
import { Task, AIBehavior } from '../../types';

interface TaskConfigFormProps {
  task: Task;
  onChange: (task: Task) => void;
}

export const TaskConfigForm: React.FC<TaskConfigFormProps> = ({ task, onChange }) => {
  const updateTask = (field: keyof Task, value: any) => {
    onChange({ ...task, [field]: value });
  };

  const aiBehaviorOptions = [
    { value: 'passive', label: 'Passive - Mostly listens' },
    { value: 'neutral', label: 'Neutral - Balanced interaction' },
    { value: 'active', label: 'Active - Frequently engages' },
    { value: 'very_active', label: 'Very Active - Highly interactive' }
  ];

  const requirementsList = [
    {
      key: 'req_audio' as const,
      label: 'Audio',
      description: 'Candidate can speak with the AI',
      icon: Mic
    },
    {
      key: 'req_screen_share' as const,
      label: 'Screen Share',
      description: 'Candidate must share their screen',
      icon: Monitor
    },
    {
      key: 'req_webcam' as const,
      label: 'Webcam',
      description: 'Candidate camera must be on',
      icon: Camera
    },
    {
      key: 'req_file_upload' as const,
      label: 'File Upload',
      description: 'Candidate can upload files',
      icon: Upload
    }
  ];

  return (
    <div className="space-y-6">
      {/* Basic Task Info */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Task Details</h3>
        <div className="space-y-4">
          <Input
            label="Task Title"
            value={task.title}
            onChange={(e) => updateTask('title', e.target.value)}
            placeholder="e.g., Behavioral Questions"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interviewer Script / Prompt
            </label>
            <textarea
              value={task.prompt}
              onChange={(e) => updateTask('prompt', e.target.value)}
              rows={6}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter the question or scenario the AI will present to the candidate..."
            />
          </div>
        </div>
      </Card>

      {/* AI Behavior & Duration */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Interaction Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="AI Behavior"
            value={task.ai_behavior}
            onChange={(e) => updateTask('ai_behavior', e.target.value as AIBehavior)}
            options={aiBehaviorOptions}
            helpText="How interactive should the AI interviewer be?"
          />
          
          <Input
            label="Duration (minutes)"
            type="number"
            value={task.duration_minutes || ''}
            onChange={(e) => updateTask('duration_minutes', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="e.g., 10"
            helpText="Optional time limit for this task"
          />
        </div>
      </Card>

      {/* Media Requirements */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Media Requirements</h3>
        <div className="space-y-4">
          {requirementsList.map(({ key, label, description, icon: Icon }) => (
            <div key={key} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  id={`requirement-${key}`}
                  checked={task[key]}
                  onChange={(e) => updateTask(key, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={`requirement-${key}`}
                  className="flex items-center text-sm font-medium text-gray-900 cursor-pointer"
                >
                  <Icon size={16} className="mr-2 text-gray-500" />
                  {label}
                </label>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Task Criteria */}
      <Card className="p-6">
        <CriterionForm
          criteria={task.criteria}
          onChange={(criteria) => updateTask('criteria', criteria)}
          scope="task"
        />
      </Card>
    </div>
  );
};