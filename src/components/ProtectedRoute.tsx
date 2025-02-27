
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: string;
}

export function ProtectedRoute({ children, requiredModule }: ProtectedRouteProps) {
  const { currentUser, hasAccess } = useUser();
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If requiredModule is specified, check permission
  if (requiredModule && !hasAccess(requiredModule)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}
