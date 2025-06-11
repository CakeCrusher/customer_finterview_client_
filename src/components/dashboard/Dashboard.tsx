import React, { useState } from 'react';
import { LogOut, User, Search, Filter } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { InterviewCard } from './InterviewCard';
import { CreateInterviewCard } from './CreateInterviewCard';
import { useAuth } from '../../contexts/AuthContext';
import { Interview } from '../../types';

interface DashboardProps {
  interviews: Interview[];
  isFetching: boolean;
  onCreateInterview: () => void;
  onEditInterview: (interview: Interview) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  interviews,
  isFetching,
  onCreateInterview,
  onEditInterview
}) => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInterviews = interviews.filter(interview =>
    interview.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="text-white font-bold text-sm">AI</div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Finance Interviewer</h1>
              <p className="text-sm text-gray-500">Interview Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User size={16} />
              <span>{user?.email}</span>
            </div>
            <Button variant="ghost" icon={LogOut} onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 flex-1 max-w-lg">
            <Input
              placeholder="Search interviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              className="flex-1"
            />
            <Button variant="outline" icon={Filter}>
              Filter
            </Button>
          </div>
        </div>

        {isFetching ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading interviews...</div>
          </div>
        ) : (
          <>
            {/* Interview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <CreateInterviewCard onClick={onCreateInterview} />
              {filteredInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onClick={() => onEditInterview(interview)}
                />
              ))}
            </div>

            {filteredInterviews.length === 0 && !searchTerm && (
              <div className="text-center py-12 col-span-full">
                <h3 className="text-lg font-medium text-gray-900">No interviews yet</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Click "Create Interview" to get started.
                </p>
              </div>
            )}

            {filteredInterviews.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-2">No interviews found</div>
                <div className="text-sm text-gray-400">
                  Try adjusting your search terms
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};