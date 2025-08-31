import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as RadixToaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Portfolio from "./pages/Portfolio";
import PhotographersPortal from "./pages/PhotographersPortal";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import { AuthGuard } from "./components/auth/AuthGuard";
import { Header } from "./components/layout/Header";
import { BypassAuthToggle } from "./components/ui/bypass-auth-toggle";
import { PermissionGuard } from "./components/rbac/PermissionGuard";
import { RoleManager } from "./components/rbac/RoleManager";

// Import other pages
import Index from "./pages/Index";
import EstimatesPage from "./pages/estimates/EstimatesPage";
import FinancesPage from "./pages/finances/FinancesPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import Hire from "./pages/Hire";
import NotFound from "./pages/NotFound";
import ClientPortal from "./pages/ClientPortal";

// Import unified workflow page
import UnifiedWorkflowPage from "./pages/UnifiedWorkflowPage";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        {/* Public routes - these should be accessible without authentication */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/hire" element={<Hire />} />
        <Route path="/photographers" element={<PhotographersPortal />} />
        
        {/* Client Portal - Public access with its own authentication */}
        <Route path="/client-portal" element={<ClientPortal />} />
        
        {/* Portfolio can be accessed without login for creation */}
        <Route path="/portfolio" element={<Portfolio />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/dashboard" element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        } />
        <Route path="/index" element={
          <AuthGuard>
            <Index />
          </AuthGuard>
        } />
        <Route path="/profile" element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        } />
        <Route path="/settings" element={
          <AuthGuard>
            <Settings />
          </AuthGuard>
        } />
        <Route path="/estimates" element={
          <AuthGuard>
            <EstimatesPage />
          </AuthGuard>
        } />
        
        {/* Unified Workflow Management - replaces old scheduling and workflow routes */}
        <Route path="/workflow" element={
          <AuthGuard>
            <UnifiedWorkflowPage />
          </AuthGuard>
        } />
        
        {/* Legacy routes - redirect to unified workflow */}
        <Route path="/scheduling/*" element={
          <AuthGuard>
            <Navigate to="/workflow" replace />
          </AuthGuard>
        } />
        <Route path="/workflow/pre-production" element={
          <AuthGuard>
            <Navigate to="/workflow" replace />
          </AuthGuard>
        } />
        <Route path="/workflow/production" element={
          <AuthGuard>
            <Navigate to="/workflow" replace />
          </AuthGuard>
        } />
        <Route path="/workflow/post-production" element={
          <AuthGuard>
            <Navigate to="/workflow" replace />
          </AuthGuard>
        } />
        <Route path="/pre-production" element={
          <AuthGuard>
            <Navigate to="/workflow" replace />
          </AuthGuard>
        } />
        <Route path="/production" element={
          <AuthGuard>
            <Navigate to="/workflow" replace />
          </AuthGuard>
        } />
        <Route path="/post-production" element={
          <AuthGuard>
            <Navigate to="/workflow" replace />
          </AuthGuard>
        } />
        
        <Route path="/finances/*" element={
          <AuthGuard>
            <PermissionGuard permission="finances.view">
              <FinancesPage />
            </PermissionGuard>
          </AuthGuard>
        } />
        
        {/* Admin routes - Role management */}
        <Route path="/admin/roles" element={
          <AuthGuard>
            <PermissionGuard role="manager">
              <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold">Role Management</h1>
                    <p className="text-muted-foreground mt-2">
                      Manage team member roles and permissions
                    </p>
                  </div>
                  <RoleManager />
                </div>
              </div>
            </PermissionGuard>
          </AuthGuard>
        } />
        <Route path="/invoices" element={
          <AuthGuard>
            <PermissionGuard permission="invoices.view">
              <InvoicesPage />
            </PermissionGuard>
          </AuthGuard>
        } />
        
        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
            <PermissionGuard permission="workflow.view">
              <UnifiedWorkflowPage />
            </PermissionGuard>
      {/* Bypass Auth Toggle */}
      <BypassAuthToggle />
      
      <Toaster />
      <RadixToaster />
    </div>
  );
}

export default App;