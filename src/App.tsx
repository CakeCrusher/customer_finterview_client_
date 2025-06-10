import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { InterviewEditor } from './components/interview/InterviewEditor';
import { ResultsView } from './components/results/ResultsView';
import { Interview } from './types';
import { mockInterviews } from './utils/mockData';

type AppView = 'dashboard' | 'editor' | 'results';

interface AppState {
  view: AppView;
  editingInterview: Interview | null;
  viewingResults: Interview | null;
}

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [appState, setAppState] = useState<AppState>({
    view: 'dashboard',
    editingInterview: null,
    viewingResults: null
  });
  const [interviews, setInterviews] = useState(mockInterviews);

  const handleCreateInterview = () => {
    const newInterview: Interview = {
      id: `interview-${Date.now()}`,
      title: 'New Interview',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      generalCriteria: [],
      tasks: []
    };

    setInterviews([...interviews, newInterview]);
    setAppState({
      view: 'editor',
      editingInterview: newInterview,
      viewingResults: null
    });
  };

  const handleEditInterview = (interview: Interview) => {
    // If interview has results (completed candidates), go to results view
    if (interview.stats && interview.stats.completed > 0) {
      setAppState({
        view: 'results',
        editingInterview: null,
        viewingResults: interview
      });
    } else {
      // Otherwise go to editor
      setAppState({
        view: 'editor',
        editingInterview: interview,
        viewingResults: null
      });
    }
  };

  const handleSaveInterview = (updatedInterview: Interview) => {
    setInterviews(prev => 
      prev.map(interview => 
        interview.id === updatedInterview.id ? updatedInterview : interview
      )
    );
    
    setAppState(prev => ({
      ...prev,
      editingInterview: updatedInterview
    }));
  };

  const handleBackToDashboard = () => {
    setAppState({
      view: 'dashboard',
      editingInterview: null,
      viewingResults: null
    });
  };

  if (!user) {
    return <LoginForm />;
  }

  if (appState.view === 'editor' && appState.editingInterview) {
    return (
      <InterviewEditor
        interview={appState.editingInterview}
        onSave={handleSaveInterview}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (appState.view === 'results' && appState.viewingResults) {
    return (
      <ResultsView
        interview={appState.viewingResults}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <Dashboard
      onCreateInterview={handleCreateInterview}
      onEditInterview={handleEditInterview}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;