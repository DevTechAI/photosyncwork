
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  console.log('AuthGuard: user=', user?.email, 'loading=', loading, 'pathname=', location.pathname);
  
  // Show loading state while checking authentication
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
  
  // If not authenticated, redirect to auth page
  if (!user) {
    console.log('AuthGuard: No user, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // User is authenticated, render children
  console.log('AuthGuard: User authenticated, rendering children');
  return <>{children}</>;
}
