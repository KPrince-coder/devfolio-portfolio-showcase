import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

export const useSessionTimeout = (onTimeout: () => void) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      // Show informative toast about session timeout
      toast({
        title: "Session Expired",
        description: "You have been logged out due to 10 minutes of inactivity. Please login again to continue.",
        variant: "destructive",
        duration: 5000,
      });

      // Add to localStorage to show message on login page
      localStorage.setItem('sessionTimeoutReason', 'Your previous session ended due to inactivity');

      // Call the timeout handler
      onTimeout();
      
      // Navigate after a short delay to ensure toast is visible
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }, TIMEOUT_DURATION);
  };

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'wheel'
    ];

    const handleActivity = () => {
      resetTimeout();
    };

    // Set up initial timeout
    resetTimeout();

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [navigate, onTimeout]);

  return resetTimeout;
};
