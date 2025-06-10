import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string, company: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs once on mount.
    // onAuthStateChange fires an initial event with the current session,
    // and then again whenever the auth state changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth event: ${event}`, { session });
      
      if (session?.user) {
        // Mock user data as requested
        setUser({
          id: session.user.id,
          email: 'asd@asd.asd',
          name: 'Test User',
          company: 'Test Company',
        });
        
        // Clean up URL from OAuth params to prevent issues
        if (
          window.location.hash.includes('access_token') ||
          window.location.search.includes('code=')
        ) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else {
        setUser(null);
      }
      // Set loading to false once we have the auth state.
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (isLoading) return; // Prevent multiple clicks
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      // Stop loading if the redirect fails for some reason
      setIsLoading(false);
      throw new Error(
        error instanceof Error ? error.message : 'Google sign in failed'
      );
    }
  };

  const login = async (email: string, password: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Get user profile from our users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          company: profile.company,
        });
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, company: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile in our users table
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          name,
          company,
        });

        if (profileError) throw profileError;

        setUser({
          id: data.user.id,
          email,
          name,
          company,
        });
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Registration failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    // Using { scope: 'global' } ensures the user is signed out of all tabs.
    // The onAuthStateChange listener will handle setting user to null and isLoading to false.
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      console.error('Logout error:', error);
      // If sign out fails, we must stop the loading indicator.
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signInWithGoogle, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};