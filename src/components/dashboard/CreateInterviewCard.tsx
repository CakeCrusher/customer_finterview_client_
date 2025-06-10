import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../ui/Card';

interface CreateInterviewCardProps {
  onClick: () => void;
}

export const CreateInterviewCard: React.FC<CreateInterviewCardProps> = ({ onClick }) => {
  return (
    <Card 
      hover 
      onClick={onClick}
      className="p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
    >
      <div className="flex flex-col items-center justify-center text-center h-full min-h-[200px]">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
          <Plus className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Create New Interview
        </h3>
        <p className="text-sm text-gray-600">
          Start building a new AI interview for your candidates
        </p>
      </div>
    </Card>
  );
};