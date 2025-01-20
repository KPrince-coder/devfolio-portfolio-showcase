import React, { useState, useEffect, createContext, useContext, FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSessionTimeout } from './use-session-timeout';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  handleLogout: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      
      // Show success toast with animation
      toast.success("Successfully logged out", {
        duration: 2000,
        position: "top-right",
        icon: "👋",
        style: {
          background: "#22c55e",
          color: "white",
        },
      });

      // Navigate to login page after a slight delay
      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch (error: any) {
      toast.error("Error logging out: " + (error.message || "Unknown error"), {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  // Use session timeout hook
  useSessionTimeout(handleLogout);

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      handleLogout
    }),
    [user, loading, handleLogout]
  );

  return React.createElement(AuthContext.Provider, { value: contextValue }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };