import React, { useState } from 'react';
import { FileText, Calculator, BookOpen, Edit3 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { taskTemplates } from '../../utils/mockData';

interface TaskTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export const TaskTemplateModal: React.FC<TaskTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templateIcons = {
    behavioral: FileText,
    'merger-math': Calculator,
    accounting: BookOpen,
    custom: Edit3
  };

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
      setSelectedTemplate(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Task Template"
      size="lg"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Select a template to get started quickly, or choose Custom to create from scratch.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {taskTemplates.map((template) => {
            const Icon = templateIcons[template.id as keyof typeof templateIcons];
            const isSelected = selectedTemplate === template.id;

            return (
              <Card
                key={template.id}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {template.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      {template.defaultDuration} min • {template.suggestedCriteria.length} criteria
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelectTemplate}
            disabled={!selectedTemplate}
          >
            Create Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};