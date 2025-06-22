
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

// Import other pages
import Index from "./pages/Index";
import EstimatesPage from "./pages/estimates/EstimatesPage";
import SchedulingPage from "./pages/scheduling/SchedulingPage";
import FinancesPage from "./pages/finances/FinancesPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import Hire from "./pages/Hire";
import NotFound from "./pages/NotFound";

// Import workflow pages - fix the imports to match actual file structure
import PreProductionLayout from "./pages/workflow/pre-production/PreProductionLayout";
import ProductionPage from "./pages/workflow/ProductionPage";
import PostProductionPage from "./pages/workflow/PostProductionPage";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              <Route path="/hire" element={<Hire />} />
              <Route path="/photographers" element={<PhotographersPortal />} />
              
              {/* Portfolio can be accessed without login for creation */}
              <Route path="/portfolio" element={<Portfolio />} />
              
              {/* Protected routes */}
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
              <Route path="/scheduling/*" element={
                <AuthGuard>
                  <SchedulingPage />
                </AuthGuard>
              } />
              <Route path="/finances/*" element={
                <AuthGuard>
                  <FinancesPage />
                </AuthGuard>
              } />
              <Route path="/invoices" element={
                <AuthGuard>
                  <InvoicesPage />
                </AuthGuard>
              } />
              
              {/* Workflow routes - updated to use correct component imports */}
              <Route path="/workflow/pre-production" element={
                <AuthGuard>
                  <PreProductionLayout />
                </AuthGuard>
              } />
              <Route path="/workflow/production" element={
                <AuthGuard>
                  <ProductionPage />
                </AuthGuard>
              } />
              <Route path="/workflow/post-production" element={
                <AuthGuard>
                  <PostProductionPage />
                </AuthGuard>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
          <RadixToaster />
        </TooltipProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
