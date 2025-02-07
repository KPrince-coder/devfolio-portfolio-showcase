
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
    let mounted = true;

    // Check active session and set up auth listener
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        // Only update state if component is still mounted
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (mounted) {
            setUser(session?.user ?? null);
            setLoading(false);

            // If session is null and we're not on the login page, redirect
            if (!session?.user && window.location.pathname !== '/login') {
              navigate('/login');
            }
          }
        });

        return () => {
          subscription.unsubscribe();
        };

      } catch (error) {
        console.error('Error checking auth status:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      handleLogout
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
