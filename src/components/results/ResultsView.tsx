import React, { useState } from 'react';
import { ArrowLeft, BarChart3, Table, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PerformanceOverview } from './PerformanceOverview';
import { CandidateTable } from './CandidateTable';
import { CandidateDetailModal } from './CandidateDetailModal';
import { Interview } from '../../types';
import { CandidateResult, CandidatePerformanceData } from '../../types/candidate';
import { mockPerformanceData } from '../../utils/candidateMockData';

interface ResultsViewProps {
  interview: Interview;
  onBack: () => void;
}

type ViewMode = 'overview' | 'table';

export const ResultsView: React.FC<ResultsViewProps> = ({ interview, onBack }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResult | null>(null);
  const [performanceData, setPerformanceData] = useState<CandidatePerformanceData>(mockPerformanceData);

  const handleUpdateCandidate = (updatedCandidate: CandidateResult) => {
    setPerformanceData(prev => ({
      ...prev,
      candidates: prev.candidates.map(candidate =>
        candidate.id === updatedCandidate.id ? updatedCandidate : candidate
      )
    }));
    setSelectedCandidate(updatedCandidate);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'live': return 'success';
      case 'draft': return 'warning';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

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
                    {interview.title} - Results
                  </h1>
                  <Badge variant={getStatusVariant(interview.status)} className="capitalize">
                    {interview.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {performanceData.candidates.length} candidate{performanceData.candidates.length !== 1 ? 's' : ''} completed
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'overview' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={BarChart3}
                  onClick={() => setViewMode('overview')}
                  className={viewMode === 'overview' ? '' : 'text-gray-600'}
                >
                  Overview
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={Table}
                  onClick={() => setViewMode('table')}
                  className={viewMode === 'table' ? '' : 'text-gray-600'}
                >
                  Table
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'overview' ? (
          <PerformanceOverview data={performanceData} />
        ) : (
          <CandidateTable 
            data={performanceData} 
            onViewCandidate={setSelectedCandidate}
          />
        )}
      </main>

      {/* Candidate Detail Modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onUpdateCandidate={handleUpdateCandidate}
      />
    </div>
  );
};