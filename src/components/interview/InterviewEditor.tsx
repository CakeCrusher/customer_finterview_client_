import React, { useState, useCallback } from 'react';
import { Save, Users, Settings, ArrowLeft, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { TaskPanel } from './TaskPanel';
import { TaskConfigForm } from './TaskConfigForm';
import { TaskTemplateModal } from './TaskTemplateModal';
import { GeneralRubricModal } from './GeneralRubricModal';
import { InviteCandidatesModal } from './InviteCandidatesModal';
import { Interview, Task, Criterion } from '../../types';
import { taskTemplates } from '../../utils/mockData';

interface InterviewEditorProps {
  interview: Interview;
  onSave: (interview: Interview) => void;
  onBack: () => void;
}

export const InterviewEditor: React.FC<InterviewEditorProps> = ({
  interview: initialInterview,
  onSave,
  onBack
}) => {
  const [interview, setInterview] = useState<Interview>(initialInterview);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    interview.tasks.length > 0 ? interview.tasks[0].id : null
  );
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const selectedTask = selectedTaskId 
    ? interview.tasks.find(t => t.id === selectedTaskId) || null
    : null;

  const updateInterview = useCallback((updates: Partial<Interview>) => {
    setInterview(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  const handleTaskSelect = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
  }, []);

  const handleCreateTask = useCallback(() => {
    setIsTemplateModalOpen(true);
  }, []);

  const handleSelectTemplate = useCallback((templateId: string) => {
    const template = taskTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: template.name,
      prompt: template.defaultPrompt,
      aiBehavior: template.defaultBehavior,
      durationMinutes: template.defaultDuration,
      requirements: template.defaultRequirements,
      supportingFiles: [],
      criteria: template.suggestedCriteria.map(c => ({
        id: `criterion-${Date.now()}-${Math.random()}`,
        name: c.name,
        description: c.description,
        type: c.type,
        scope: 'task' as const
      })),
      order: interview.tasks.length
    };

    const updatedTasks = [...interview.tasks, newTask];
    updateInterview({ tasks: updatedTasks });
    setSelectedTaskId(newTask.id);
  }, [interview.tasks, updateInterview]);

  const handleDeleteTask = useCallback((taskId: string) => {
    const updatedTasks = interview.tasks
      .filter(t => t.id !== taskId)
      .map((task, index) => ({ ...task, order: index }));
    
    updateInterview({ tasks: updatedTasks });
    
    if (selectedTaskId === taskId) {
      setSelectedTaskId(updatedTasks.length > 0 ? updatedTasks[0].id : null);
    }
  }, [interview.tasks, selectedTaskId, updateInterview]);

  const handleReorderTasks = useCallback((reorderedTasks: Task[]) => {
    updateInterview({ tasks: reorderedTasks });
  }, [updateInterview]);

  const handleTaskChange = useCallback((updatedTask: Task) => {
    const updatedTasks = interview.tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    updateInterview({ tasks: updatedTasks });
  }, [interview.tasks, updateInterview]);

  const handleGeneralCriteriaChange = useCallback((criteria: Criterion[]) => {
    updateInterview({ generalCriteria: criteria });
  }, [updateInterview]);

  const handleSave = useCallback(() => {
    const updatedInterview = {
      ...interview,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedInterview);
    setHasUnsavedChanges(false);
  }, [interview, onSave]);

  const handlePublish = useCallback(() => {
    const publishedInterview = {
      ...interview,
      status: 'live' as const,
      updatedAt: new Date().toISOString()
    };
    onSave(publishedInterview);
    setHasUnsavedChanges(false);
    setIsInviteModalOpen(true);
  }, [interview, onSave]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'live': return 'success';
      case 'draft': return 'warning';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const totalCriteria = interview.generalCriteria.length + 
    interview.tasks.reduce((sum, task) => sum + task.criteria.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                icon={ArrowLeft}
                onClick={onBack}
                className="text-gray-600"
              >
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {interview.title}
                  </h1>
                  <Badge variant={getStatusVariant(interview.status)} className="capitalize">
                    {interview.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {interview.tasks.length} task{interview.tasks.length !== 1 ? 's' : ''} • {totalCriteria} evaluation criteria
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                icon={Settings}
                onClick={() => setIsRubricModalOpen(true)}
              >
                General Rubric ({interview.generalCriteria.length})
              </Button>

              {interview.status === 'draft' && (
                <>
                  <Button
                    variant="outline"
                    icon={Save}
                    onClick={handleSave}
                    disabled={!hasUnsavedChanges}
                  >
                    {hasUnsavedChanges ? 'Save Draft' : 'Saved'}
                  </Button>
                  <Button
                    variant="primary"
                    icon={Users}
                    onClick={handlePublish}
                    disabled={interview.tasks.length === 0}
                  >
                    Publish & Invite
                  </Button>
                </>
              )}

              {interview.status === 'live' && (
                <>
                  <Button
                    variant="outline"
                    icon={Save}
                    onClick={handleSave}
                    disabled={!hasUnsavedChanges}
                  >
                    {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
                  </Button>
                  <Button
                    variant="primary"
                    icon={Users}
                    onClick={() => setIsInviteModalOpen(true)}
                  >
                    Invite Candidates
                  </Button>
                </>
              )}

              {interview.status === 'closed' && (
                <Button
                  variant="outline"
                  icon={Eye}
                  onClick={() => {/* TODO: Navigate to results */}}
                >
                  View Results
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex">
        {/* Task Panel */}
        <TaskPanel
          tasks={interview.tasks}
          selectedTaskId={selectedTaskId}
          onSelectTask={handleTaskSelect}
          onCreateTask={handleCreateTask}
          onDeleteTask={handleDeleteTask}
          onReorderTasks={handleReorderTasks}
        />

        {/* Configuration Form */}
        <div className="flex-1 overflow-y-auto">
          {selectedTask ? (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Task Configuration
                </h2>
                <p className="text-gray-600">
                  Configure the selected task's behavior, requirements, and evaluation criteria.
                </p>
              </div>
              
              <TaskConfigForm
                task={selectedTask}
                onChange={handleTaskChange}
              />
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <Card className="p-8 max-w-md text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Configure Your Interview
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {interview.tasks.length === 0 
                      ? "Start by adding your first interview task. Each task represents a section or question in your interview."
                      : "Select a task from the left panel to configure its settings and evaluation criteria."
                    }
                  </p>
                  {interview.tasks.length === 0 && (
                    <Button onClick={handleCreateTask} icon={Users}>
                      Create First Task
                    </Button>
                  )}
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TaskTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <GeneralRubricModal
        isOpen={isRubricModalOpen}
        onClose={() => setIsRubricModalOpen(false)}
        criteria={interview.generalCriteria}
        onChange={handleGeneralCriteriaChange}
      />

      <InviteCandidatesModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        interviewTitle={interview.title}
      />
    </div>
  );
};