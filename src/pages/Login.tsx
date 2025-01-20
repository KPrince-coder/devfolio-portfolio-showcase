import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const passwordRef = useRef(null);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) navigate("/admin");
    };
    checkSession();
  }, [navigate]);

  // Check for timeout message
  useEffect(() => {
    const timeoutReason = localStorage.getItem('sessionTimeoutReason');
    if (timeoutReason) {
      toast({
        title: "Session Ended",
        description: timeoutReason,
        variant: "destructive",
        duration: 4000,
      });
      // Clear the message
      localStorage.removeItem('sessionTimeoutReason');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Show success toast
      toast({
        title: "Welcome back! 👋",
        description: "Successfully logged in to your dashboard",
        duration: 2000,
        variant: "default",
        className: "bg-green-500 text-white border-none",
      });

      // Slight delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      navigate("/admin");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (field === "email") {
        passwordRef.current?.focus();
      } else if (field === "password") {
        handleLogin(e);
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated geometric background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/5 rounded-full"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] to-transparent opacity-50" />

          <div className="relative space-y-6">
            <motion.div
              className="space-y-2 text-center"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
                Welcome, Admin
              </h1>
              <p className="text-sm text-gray-300 font-medium">
                Sign in to manage your portfolio
              </p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div
                className="space-y-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, "email")}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Enter your email"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="password" className="text-gray-200">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, "password")}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  aria-label={loading ? "Signing in..." : "Sign in"}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="text-center">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle password reset
                }}
              >
                Forgot your password?
              </a>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
