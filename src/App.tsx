
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as RadixToaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Portfolio from "./pages/Portfolio";
import PhotographersPortal from "./pages/PhotographersPortal";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { AuthGuard } from "./components/auth/AuthGuard";
import { Header } from "./components/layout/Header";
import { useAuth } from "./contexts/AuthContext";

// Import other pages
import Index from "./pages/Index";
import EstimatesPage from "./pages/estimates/EstimatesPage";
import SchedulingPage from "./pages/scheduling/SchedulingPage";
import FinancesPage from "./pages/finances/FinancesPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import Hire from "./pages/Hire";
import NotFound from "./pages/NotFound";

function App() {
  const { user } = useAuth();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/hire" element={<Hire />} />
          <Route path="/photographers" element={<PhotographersPortal />} />
          
          {/* Portfolio can be accessed without login for creation */}
          <Route path="/portfolio" element={<Portfolio />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
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
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Toaster />
      <RadixToaster />
    </TooltipProvider>
  );
}

export default App;
