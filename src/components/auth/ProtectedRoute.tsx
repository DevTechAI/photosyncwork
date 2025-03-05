
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

export default function ProtectedRoute() {
  const { currentUser, loading } = useUser();
  const location = useLocation();
  
  // Show loading state if auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the nested routes
  return <Outlet />;
}
