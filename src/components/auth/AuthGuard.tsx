import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, bypassAuth } = useAuth();
  const location = useLocation();
  
  console.log('AuthGuard: user=', user?.email, 'loading=', loading, 'pathname=', location.pathname, 'bypassAuth=', bypassAuth);
  
  // If bypass is enabled, allow access
  if (bypassAuth) {
    console.log('AuthGuard: Bypass enabled, allowing access');
    return <>{children}</>;
  }
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth page
  if (!user) {
    console.log('AuthGuard: No user, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // User is authenticated, render children
  console.log('AuthGuard: User authenticated, rendering children');
  return <>{children}</>;
}