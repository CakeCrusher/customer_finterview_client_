import React from 'react';
import { TaskCard } from './TaskCard';
import { CreateTaskCard } from './CreateTaskCard';
import { Task } from '../../types';

interface TaskPanelProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onCreateTask: () => void;
  onDeleteTask: (taskId: string) => void;
  onReorderTasks: (tasks: Task[]) => void;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  onCreateTask,
  onDeleteTask,
  onReorderTasks
}) => {
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    const draggedTaskIndex = tasks.findIndex(t => t.id === draggedTaskId);
    
    if (draggedTaskIndex === -1 || draggedTaskIndex === dropIndex) return;

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedTaskIndex, 1);
    newTasks.splice(dropIndex, 0, draggedTask);

    // Update order property
    const reorderedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index
    }));

    onReorderTasks(reorderedTasks);
  };

  return (
    <div className="w-80 flex-shrink-0 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Interview Tasks</h2>
          <span className="text-sm text-gray-500">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          <CreateTaskCard onClick={onCreateTask} />
          
          {tasks
            .sort((a, b) => a.order - b.order)
            .map((task, index) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <TaskCard
                  task={task}
                  isSelected={selectedTaskId === task.id}
                  onClick={() => onSelectTask(task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};