import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Plus } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Criterion, CriterionType } from '../../types';

interface CriterionFormProps {
  criteria: Criterion[];
  onChange: (criteria: Criterion[]) => void;
  scope: 'general' | 'task';
}

export const CriterionForm: React.FC<CriterionFormProps> = ({
  criteria,
  onChange,
  scope
}) => {
  const criterionTypes = [
    { value: 'rating', label: 'Rating (1-5)' },
    { value: 'numeric', label: 'Numeric' },
    { value: 'boolean', label: 'Yes/No' },
    { value: 'text', label: 'Text' }
  ];

  const addCriterion = () => {
    const newCriterion: Criterion = {
      id: uuidv4(),
      name: '',
      description: '',
      type: 'rating',
      scope
    };
    onChange([...criteria, newCriterion]);
  };

  const updateCriterion = (index: number, field: keyof Criterion, value: any) => {
    const updatedCriteria = criteria.map((criterion, i) => {
      if (i === index) {
        return { ...criterion, [field]: value };
      }
      return criterion;
    });
    onChange(updatedCriteria);
  };

  const removeCriterion = (index: number) => {
    onChange(criteria.filter((_, i) => i !== index));
  };

  const handleNameChange = (index: number, name: string) => {
    updateCriterion(index, 'name', name);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">
          {scope === 'general' ? 'General' : 'Task-Specific'} Evaluation Criteria
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={Plus}
          onClick={addCriterion}
        >
          Add Criterion
        </Button>
      </div>

      {criteria.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="mb-2">No evaluation criteria defined</p>
          <p className="text-sm">Click "Add Criterion" to define how this will be evaluated</p>
        </div>
      ) : (
        <div className="space-y-4">
          {criteria.map((criterion, index) => (
            <div key={criterion.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Criterion Name"
                      value={criterion.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder="e.g., Communication Clarity"
                    />
                  </div>
                  
                  <Select
                    label="Type"
                    value={criterion.type}
                    onChange={(e) => updateCriterion(index, 'type', e.target.value as CriterionType)}
                    options={criterionTypes}
                  />
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => removeCriterion(index)}
                  className="text-red-600 hover:text-red-700 ml-2"
                />
              </div>
              
              <Input
                label="Description (Optional)"
                value={criterion.description || ''}
                onChange={(e) => updateCriterion(index, 'description', e.target.value)}
                placeholder="Additional context for evaluators"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};