import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Archive from "./pages/Archive";
import { useParams } from "react-router-dom";
import BlogPage from "./pages/BlogPage";
import { HelmetProvider } from 'react-helmet-async';

const BlogPageWrapper = () => {
  const { postId } = useParams();
  return <BlogPage postId={postId} />;
};

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please try logging in again.",
          });
          setSession(false);
        } else {
          console.log("Session check:", currentSession ? "Authenticated" : "Not authenticated");
          setSession(!!currentSession);
        }
      } catch (err) {
        console.error("Unexpected error during session check:", err);
        setSession(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", session ? "Authenticated" : "Not authenticated");
      
      if (_event === 'TOKEN_REFRESHED') {
        console.log('Token successfully refreshed');
      }
      
      if (_event === 'SIGNED_OUT') {
        // Clear any cached data
        queryClient.clear();
      }

      setSession(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/blog/:postId" element={<BlogPageWrapper />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);

export default App;