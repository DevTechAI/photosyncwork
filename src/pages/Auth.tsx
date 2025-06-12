import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const { user, loading, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const hasRedirectedRef = useRef(false);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    console.log('Auth page: user state changed', user?.email, 'loading:', loading, 'hasRedirected:', hasRedirectedRef.current);
    
    // Only redirect if user is authenticated, not loading, and we haven't redirected yet
    if (user && !loading && !hasRedirectedRef.current) {
      console.log('Redirecting authenticated user to:', from);
      hasRedirectedRef.current = true;
      navigate(from, { replace: true });
    }
  }, [user, loading]); // Removed navigate and from from dependencies to prevent re-runs

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render auth form if user is already authenticated
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        console.log('Attempting sign up for:', email);
        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          console.error('Sign up error:', error);
          toast({
            title: "Sign up failed",
            description: error.message || "Failed to create account. Please try again.",
            variant: "destructive"
          });
        } else {
          console.log('Sign up successful');
          toast({
            title: "Account created!",
            description: "Welcome to StudioSync!",
          });
        }
      } else {
        console.log('Attempting sign in for:', email);
        const { error } = await signInWithEmail(email, password);
        if (error) {
          console.error('Sign in error:', error);
          toast({
            title: "Sign in failed",
            description: error.message || "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        } else {
          console.log('Sign in successful');
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Join StudioSync to manage your photography business" 
              : "Sign in to your StudioSync account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>
            
            <Button 
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full"
              size="lg"
            >
              {isSubmitting 
                ? (isSignUp ? "Creating Account..." : "Signing In...") 
                : (isSignUp ? "Create Account" : "Sign In")
              }
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setEmail("");
                setPassword("");
                setFullName("");
              }}
              className="text-sm"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Sign up"
              }
            </Button>
          </div>
          
          {!isSignUp && (
            <div className="text-xs text-muted-foreground space-y-1 mt-4 p-3 bg-muted rounded-md">
              <p>✓ 5GB free storage included</p>
              <p>✓ Portfolio creation tools</p>
              <p>✓ CRM and project management</p>
              <p>✓ Team collaboration features</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
