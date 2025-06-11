import React from 'react';
import { GripVertical, Clock, Mic, Monitor, Camera, Upload, Edit3, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isSelected,
  onClick,
  onDelete,
  isDragging
}) => {
  const getAIBehaviorLabel = (behavior: string) => {
    const labels = {
      passive: 'Passive',
      neutral: 'Neutral',
      active: 'Active',
      very_active: 'Very Active'
    };
    return labels[behavior as keyof typeof labels] || behavior;
  };

  const getAIBehaviorVariant = (behavior: string) => {
    const variants = {
      passive: 'default',
      neutral: 'info',
      active: 'warning',
      very_active: 'error'
    };
    return variants[behavior as keyof typeof variants] || 'default';
  };

  const requirementsMap: { key: keyof Task, icon: React.ElementType, title: string }[] = [
    { key: 'req_audio', icon: Mic, title: 'Audio' },
    { key: 'req_screen_share', icon: Monitor, title: 'Screen Share' },
    { key: 'req_webcam', icon: Camera, title: 'Webcam' },
    { key: 'req_file_upload', icon: Upload, title: 'File Upload' },
  ];

  const activeRequirements = requirementsMap.filter(r => task[r.key]);

  return (
    <Card
      className={`p-4 transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50' 
          : 'hover:border-gray-300'
      } ${isDragging ? 'opacity-50 transform rotate-2' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 cursor-grab active:cursor-grabbing mt-1">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 truncate pr-2">
              {task.title}
            </h3>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="p-1 text-gray-400 hover:text-blue-600 rounded"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 text-gray-400 hover:text-red-600 rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <Badge 
              variant={getAIBehaviorVariant(task.ai_behavior) as any}
              size="sm"
            >
              {getAIBehaviorLabel(task.ai_behavior)}
            </Badge>
            
            {task.duration_minutes && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock size={12} className="mr-1" />
                {task.duration_minutes}m
              </div>
            )}
          </div>

          {activeRequirements.length > 0 && (
            <div className="flex items-center space-x-2">
              {activeRequirements.map(({ key, icon: Icon, title }) => (
                <div key={key} className="text-gray-400" title={title}>
                    <Icon size={14} />
                  </div>
              ))}
            </div>
          )}

          {task.criteria.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {task.criteria.length} evaluation criteria
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};