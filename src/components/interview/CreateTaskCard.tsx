import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../ui/Card';

interface CreateTaskCardProps {
  onClick: () => void;
}

export const CreateTaskCard: React.FC<CreateTaskCardProps> = ({ onClick }) => {
  return (
    <Card
      hover
      onClick={onClick}
      className="p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
    >
      <div className="flex items-center justify-center text-center py-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Add New Task</h3>
            <p className="text-sm text-gray-600">Create a new interview section</p>
          </div>
        </div>
      </div>
    </Card>
  );
};