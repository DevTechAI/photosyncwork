
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRef } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const redirectedRef = useRef(false);
  
  console.log('AuthGuard: user=', user?.email, 'loading=', loading, 'pathname=', location.pathname, 'redirected=', redirectedRef.current);
  
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
  
  if (!user && !redirectedRef.current) {
    console.log('AuthGuard: No user, redirecting to /auth');
    redirectedRef.current = true;
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  if (user) {
    console.log('AuthGuard: User authenticated, rendering children');
    return <>{children}</>;
  }
  
  // Fallback loading state to prevent flash
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
