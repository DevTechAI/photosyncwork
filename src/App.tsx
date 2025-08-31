import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as RadixToaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { AuthGuard } from "./components/auth/AuthGuard";
import { Header } from "./components/layout/Header";
import { BypassAuthToggle } from "./components/ui/bypass-auth-toggle";
import { PermissionGuard } from "./components/rbac/PermissionGuard";
import { LoadingSpinner } from "./components/ui/loading-spinner";

// Lazy load all page components
const Home = React.lazy(() => import("./pages/Home"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Portfolio = React.lazy(() => import("./pages/Portfolio"));
const PhotographersPortal = React.lazy(() => import("./pages/PhotographersPortal"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Index = React.lazy(() => import("./pages/Index"));
const EstimatesPage = React.lazy(() => import("./pages/estimates/EstimatesPage"));
const FinancesPage = React.lazy(() => import("./pages/finances/FinancesPage"));
const InvoicesPage = React.lazy(() => import("./pages/invoices/InvoicesPage"));
const Hire = React.lazy(() => import("./pages/Hire"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ClientPortal = React.lazy(() => import("./pages/ClientPortal"));
const UnifiedWorkflowPage = React.lazy(() => import("./pages/UnifiedWorkflowPage"));
const RoleManager = React.lazy(() => import("./components/rbac/RoleManager").then(mod => ({ default: mod.RoleManager })));

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
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
              <PermissionGuard permission="workflow.view">
                <UnifiedWorkflowPage />
              </PermissionGuard>
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
      </Suspense>
      {/* Bypass Auth Toggle */}
      <BypassAuthToggle />
      
      <Toaster />
      <RadixToaster />
    </div>
  );
}

export default App;