import React, { useState } from 'react';
import { X, MessageSquare, Edit3, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CandidateResult, CandidateNote } from '../../types/candidate';

interface CandidateDetailModalProps {
  candidate: CandidateResult | null;
  onClose: () => void;
  onUpdateCandidate: (candidate: CandidateResult) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
  onUpdateCandidate
}) => {
  const [editingScores, setEditingScores] = useState<Record<string, number | string | boolean>>({});
  const [newNote, setNewNote] = useState({ column: '', content: '' });
  const [showAddNote, setShowAddNote] = useState(false);

  if (!candidate) return null;

  const handleScoreEdit = (criterionId: string, value: number | string | boolean) => {
    setEditingScores(prev => ({ ...prev, [criterionId]: value }));
  };

  const handleSaveScores = () => {
    const updatedScores = candidate.scores.map(score => ({
      ...score,
      score: editingScores[score.criterionId] ?? score.score
    }));

    const updatedCandidate = {
      ...candidate,
      scores: updatedScores,
      overallScore: calculateOverallScore(updatedScores)
    };

    onUpdateCandidate(updatedCandidate);
    setEditingScores({});
  };

  const handleAddNote = () => {
    if (!newNote.column || !newNote.content) return;

    const note: CandidateNote = {
      author: 'John Smith', // In real app, this would be the current user
      column: newNote.column,
      content: newNote.content,
      createdAt: new Date().toISOString()
    };

    const updatedCandidate = {
      ...candidate,
      notes: [...candidate.notes, note]
    };

    onUpdateCandidate(updatedCandidate);
    setNewNote({ column: '', content: '' });
    setShowAddNote(false);
  };

  const calculateOverallScore = (scores: typeof candidate.scores) => {
    const numericScores = scores
      .map(s => typeof s.score === 'number' ? s.score : 0)
      .filter(s => s > 0);
    
    return numericScores.length > 0 
      ? numericScores.reduce((sum, score) => sum + score, 0) / numericScores.length
      : 0;
  };

  const getScoreColor = (score: number | string | boolean) => {
    if (typeof score !== 'number') return 'default';
    
    if (score >= 4.5) return 'success';
    if (score >= 4) return 'success';
    if (score >= 3.5) return 'warning';
    if (score >= 3) return 'warning';
    return 'error';
  };

  const formatScore = (score: number | string | boolean) => {
    if (typeof score === 'number') {
      return score.toFixed(1);
    }
    if (typeof score === 'boolean') {
      return score ? 'Yes' : 'No';
    }
    return String(score);
  };

  const hasUnsavedChanges = Object.keys(editingScores).length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-4xl">
          <div className="bg-white px-6 pt-6 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {candidate.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {candidate.email} • Completed {new Date(candidate.completedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {hasUnsavedChanges && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Save}
                    onClick={handleSaveScores}
                  >
                    Save Changes
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={X}
                  onClick={onClose}
                />
              </div>
            </div>

            {/* Overall Score */}
            <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Overall Performance</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Average score across all evaluation criteria
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {candidate.overallScore?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">out of 5.0</div>
                </div>
              </div>
            </Card>

            {/* AI Summary */}
            <Card className="p-6 mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                AI Interview Summary
              </h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  <strong>{candidate.name}</strong> demonstrated strong performance throughout the interview. 
                  Their communication skills were particularly noteworthy, showing clear articulation and 
                  confident presentation. In the behavioral section, they provided structured responses with 
                  good depth and relevant examples. During the technical portions, they showed solid analytical 
                  thinking and problem-solving abilities. Overall, they present as a well-rounded candidate 
                  with strong potential for the role.
                </p>
              </div>
            </Card>

            {/* Detailed Scores */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Evaluation Scores</h4>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit3}
                  onClick={() => setEditingScores({})}
                >
                  Edit Scores
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidate.scores.map((score) => {
                  const isEditing = score.criterionId in editingScores;
                  const currentValue = isEditing ? editingScores[score.criterionId] : score.score;
                  
                  return (
                    <div key={score.criterionId} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{score.criterionName}</h5>
                        {isEditing ? (
                          <input
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            value={currentValue as number}
                            onChange={(e) => handleScoreEdit(score.criterionId, parseFloat(e.target.value))}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        ) : (
                          <Badge variant={getScoreColor(score.score)} size="sm">
                            {formatScore(score.score)}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Show notes for this criterion */}
                      {candidate.notes
                        .filter(note => note.column === score.criterionName)
                        .map((note, index) => (
                          <div key={index} className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-700">{note.author}</span>
                              <span className="text-gray-500 text-xs">
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600">{note.content}</p>
                          </div>
                        ))}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Notes Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Notes & Comments</h4>
                <Button
                  variant="outline"
                  size="sm"
                  icon={MessageSquare}
                  onClick={() => setShowAddNote(true)}
                >
                  Add Note
                </Button>
              </div>

              {showAddNote && (
                <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="space-y-3">
                    <select
                      value={newNote.column}
                      onChange={(e) => setNewNote(prev => ({ ...prev, column: e.target.value }))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Select criterion...</option>
                      {candidate.scores.map(score => (
                        <option key={score.criterionId} value={score.criterionName}>
                          {score.criterionName}
                        </option>
                      ))}
                    </select>
                    
                    <textarea
                      value={newNote.content}
                      onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Add your note..."
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAddNote(false);
                          setNewNote({ column: '', content: '' });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAddNote}
                        disabled={!newNote.column || !newNote.content}
                      >
                        Add Note
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {candidate.notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No notes added yet</p>
                ) : (
                  candidate.notes.map((note, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{note.author}</span>
                          <span className="text-sm text-gray-500">on {note.column}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};