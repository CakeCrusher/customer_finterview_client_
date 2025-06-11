import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { InterviewEditor } from './components/interview/InterviewEditor';
import { ResultsView } from './components/results/ResultsView';
import { Interview } from './types';
import { supabase } from './lib/supabase';

type AppView = 'dashboard' | 'editor' | 'results';

interface AppState {
  view: AppView;
  editingInterview: Interview | null;
  viewingResults: Interview | null;
}

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [appState, setAppState] = useState<AppState>({
    view: 'dashboard',
    editingInterview: null,
    viewingResults: null
  });
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user) return;
      setIsFetching(true);
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('owner_email', user.email);

      if (error) {
        console.error('Error fetching interviews:', error);
      } else {
        const completeInterviews = data.map(i => ({...i, tasks: i.tasks ?? [], generalCriteria: i.generalCriteria ?? []}))
        setInterviews(completeInterviews as Interview[]);
      }
      setIsFetching(false);
    };

    fetchInterviews();
  }, [user]);

  const handleCreateInterview = async () => {
    if (!user?.email) return;

    const newInterviewPartial = {
      title: 'New Untitled Interview',
      owner_email: user.email,
    };

    const { data, error } = await supabase
      .from('interviews')
      .insert(newInterviewPartial)
      .select()
      .single();

    if (error) {
      console.error('Error creating interview:', error);
      return;
    }

    setInterviews([...interviews, {
      ...data,
      tasks: [],
      generalCriteria: [],
    }]);
    setAppState({
      view: 'editor',
      editingInterview: {
        ...data,
        tasks: [],
        generalCriteria: [],
      },
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

  const handleSaveInterview = async (updatedInterview: Interview) => {
    const { tasks, generalCriteria, stats, ...interviewData } = updatedInterview;

    const { data, error } = await supabase
      .from('interviews')
      .update({
        ...interviewData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', updatedInterview.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating interview:', error);
      return;
    }

    const newInterview = { ...data, tasks, generalCriteria, stats };

    setInterviews(prev => 
      prev.map(interview => 
        interview.id === newInterview.id ? newInterview : interview
      )
    );
    
    setAppState(prev => ({
      ...prev,
      editingInterview: newInterview,
    }));
  };

  const handleBackToDashboard = () => {
    setAppState({
      view: 'dashboard',
      editingInterview: null,
      viewingResults: null
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

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
      interviews={interviews}
      isFetching={isFetching}
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