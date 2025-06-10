import React from 'react';
import { Modal } from '../ui/Modal';
import { CriterionForm } from './CriterionForm';
import { Button } from '../ui/Button';
import { Criterion } from '../../types';

interface GeneralRubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  criteria: Criterion[];
  onChange: (criteria: Criterion[]) => void;
}

export const GeneralRubricModal: React.FC<GeneralRubricModalProps> = ({
  isOpen,
  onClose,
  criteria,
  onChange
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="General Evaluation Criteria"
      size="xl"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Define criteria that will be evaluated across the entire interview, 
          in addition to task-specific criteria.
        </p>

        <CriterionForm
          criteria={criteria}
          onChange={onChange}
          scope="general"
        />

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};