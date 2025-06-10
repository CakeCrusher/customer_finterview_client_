import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CandidatePerformanceData, CandidateResult } from '../../types/candidate';

interface CandidateTableProps {
  data: CandidatePerformanceData;
  onViewCandidate: (candidate: CandidateResult) => void;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: string;
  direction: SortDirection;
}

export const CandidateTable: React.FC<CandidateTableProps> = ({ data, onViewCandidate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });

  const { candidates, criteriaColumns } = data;

  // Filter candidates based on search term
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [candidates, searchTerm]);

  // Sort candidates
  const sortedCandidates = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return filteredCandidates;
    }

    return [...filteredCandidates].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else if (sortConfig.key === 'email') {
        aValue = a.email;
        bValue = b.email;
      } else if (sortConfig.key === 'completedAt') {
        aValue = new Date(a.completedAt);
        bValue = new Date(b.completedAt);
      } else if (sortConfig.key === 'overallScore') {
        aValue = a.overallScore || 0;
        bValue = b.overallScore || 0;
      } else {
        // Criterion score
        const aScore = a.scores.find(s => s.criterionId === sortConfig.key);
        const bScore = b.scores.find(s => s.criterionId === sortConfig.key);
        aValue = typeof aScore?.score === 'number' ? aScore.score : 0;
        bValue = typeof bScore?.score === 'number' ? bScore.score : 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredCandidates, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          return { key: '', direction: null };
        }
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp size={16} className="ml-1" /> : 
      <ChevronDown size={16} className="ml-1" />;
  };

  const getScoreColor = (score: number | string | boolean) => {
    if (typeof score !== 'number') return 'text-gray-900';
    
    if (score >= 4.5) return 'text-green-700 bg-green-50';
    if (score >= 4) return 'text-green-600 bg-green-50';
    if (score >= 3.5) return 'text-yellow-600 bg-yellow-50';
    if (score >= 3) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
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

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 max-w-lg">
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            className="flex-1"
          />
          <Button variant="outline" icon={Filter}>
            Filter
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon={Download}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Candidate
                    {getSortIcon('name')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('completedAt')}
                >
                  <div className="flex items-center">
                    Completed
                    {getSortIcon('completedAt')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('overallScore')}
                >
                  <div className="flex items-center">
                    Overall
                    {getSortIcon('overallScore')}
                  </div>
                </th>
                {criteriaColumns.map((criterion) => (
                  <th
                    key={criterion.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(criterion.id)}
                  >
                    <div className="flex items-center">
                      <div className="truncate max-w-32" title={criterion.name}>
                        {criterion.name}
                      </div>
                      {getSortIcon(criterion.id)}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {candidate.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {candidate.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(candidate.completedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(candidate.overallScore || 0)}`}>
                      {candidate.overallScore?.toFixed(1) || 'N/A'}
                    </span>
                  </td>
                  {criteriaColumns.map((criterion) => {
                    const score = candidate.scores.find(s => s.criterionId === criterion.id);
                    const scoreValue = score?.score ?? 'N/A';
                    
                    return (
                      <td key={criterion.id} className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          typeof scoreValue === 'number' ? getScoreColor(scoreValue) : 'text-gray-500'
                        }`}>
                          {formatScore(scoreValue)}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => onViewCandidate(candidate)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {sortedCandidates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No candidates found</div>
          <div className="text-sm text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'No candidates have completed this interview yet'}
          </div>
        </div>
      )}
    </div>
  );
};