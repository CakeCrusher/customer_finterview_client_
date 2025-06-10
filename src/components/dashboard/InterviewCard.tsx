import React from 'react';
import { Calendar, Users, CheckCircle, Clock, MoreVertical } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Interview } from '../../types';

interface InterviewCardProps {
  interview: Interview;
  onClick: () => void;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({ interview, onClick }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'live': return 'success';
      case 'draft': return 'warning';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const completionRate = interview.stats 
    ? Math.round((interview.stats.completed / Math.max(interview.stats.invited, 1)) * 100)
    : 0;

  return (
    <Card hover onClick={onClick} className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {interview.title}
          </h3>
          <Badge variant={getStatusVariant(interview.status)} className="capitalize">
            {interview.status}
          </Badge>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className="mr-2" />
          Updated {formatDate(interview.updatedAt)}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={14} className="mr-2" />
          {interview.tasks.length} task{interview.tasks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {interview.stats && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center text-blue-600 mb-1">
                <Users size={16} className="mr-1" />
              </div>
              <div className="text-sm font-medium text-gray-900">{interview.stats.invited}</div>
              <div className="text-xs text-gray-500">Invited</div>
            </div>
            <div>
              <div className="flex items-center justify-center text-teal-600 mb-1">
                <CheckCircle size={16} className="mr-1" />
              </div>
              <div className="text-sm font-medium text-gray-900">{interview.stats.completed}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{completionRate}%</div>
              <div className="text-xs text-gray-500">Completion</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};