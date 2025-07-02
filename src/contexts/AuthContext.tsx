import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signingOut: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: (onSuccess?: () => void) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session ? 'session exists' : 'no session');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'session exists' : 'no session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signOut = async (onSuccess?: () => void) => {
    try {
      setSigningOut(true);
      console.log('Attempting logout...');
      
      const { error } = await supabase.auth.signOut();
      
      // Clean local state regardless of server response
      // This handles cases where session is already invalid on server
      setSession(null);
      setUser(null);
      
      // Execute callback regardless of error status
      // Server errors (like "session not found") shouldn't prevent UI navigation
      if (onSuccess) {
        console.log('Executing logout success callback');
        onSuccess();
      }
      
      if (error) {
        console.log('Logout server error (continuing with local cleanup):', error);
        // For "session not found" errors, this is actually expected behavior
        // The user is already logged out on the server, so we just clean local state
        if (error.message?.includes('Session not found') || error.message?.includes('session_not_found')) {
          console.log('Session was already invalid on server - logout successful');
          return { error: null }; // Treat as success since user is effectively logged out
        }
      }
      
      console.log('Logout completed successfully');
      return { error };
    } catch (error) {
      console.error('Unexpected logout error:', error);
      
      // Force cleanup even on unexpected errors
      setSession(null);
      setUser(null);
      
      // Execute callback even on error to prevent UI from getting stuck
      if (onSuccess) {
        console.log('Executing logout callback after error');
        onSuccess();
      }
      
      return { error };
    } finally {
      setSigningOut(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signingOut,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};