import React from 'react';
import { TrendingUp, Users, Award, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { CandidatePerformanceData } from '../../types/candidate';

interface PerformanceOverviewProps {
  data: CandidatePerformanceData;
}

export const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ data }) => {
  const { candidates, criteriaColumns } = data;

  // Calculate statistics
  const totalCandidates = candidates.length;
  const avgOverallScore = candidates.reduce((sum, c) => sum + (c.overallScore || 0), 0) / totalCandidates;
  const topPerformer = candidates.reduce((top, candidate) => 
    (candidate.overallScore || 0) > (top.overallScore || 0) ? candidate : top
  );

  // Calculate criterion averages
  const criterionAverages = criteriaColumns.map(criterion => {
    const scores = candidates.map(candidate => {
      const score = candidate.scores.find(s => s.criterionId === criterion.id);
      return typeof score?.score === 'number' ? score.score : 0;
    });
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    return {
      ...criterion,
      average: Math.round(average * 10) / 10,
      scores
    };
  });

  // Find strongest and weakest areas
  const sortedCriteria = [...criterionAverages].sort((a, b) => b.average - a.average);
  const strongestArea = sortedCriteria[0];
  const weakestArea = sortedCriteria[sortedCriteria.length - 1];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Candidates</p>
              <p className="text-2xl font-semibold text-gray-900">{totalCandidates}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {avgOverallScore.toFixed(1)}/5.0
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Top Performer</p>
              <p className="text-lg font-semibold text-gray-900">{topPerformer.name}</p>
              <p className="text-sm text-gray-600">{topPerformer.overallScore?.toFixed(1)}/5.0</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">100%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance by Criteria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Criteria</h3>
          <div className="space-y-4">
            {criterionAverages.map((criterion) => (
              <div key={criterion.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {criterion.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {criterion.average}/5.0
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(criterion.average / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start">
                <Award className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">Strongest Area</p>
                  <p className="text-sm text-green-700">
                    <strong>{strongestArea.name}</strong> - Average: {strongestArea.average}/5.0
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Area for Improvement</p>
                  <p className="text-sm text-yellow-700">
                    <strong>{weakestArea.name}</strong> - Average: {weakestArea.average}/5.0
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Candidate Pool Quality</p>
                  <p className="text-sm text-blue-700">
                    {candidates.filter(c => (c.overallScore || 0) >= 4).length} of {totalCandidates} candidates scored 4.0 or higher
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};