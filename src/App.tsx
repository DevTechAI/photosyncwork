
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/QueryProvider";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SchedulingPage from "./pages/scheduling/SchedulingPage";
import EstimatesPage from "./pages/estimates/EstimatesPage";
import FinancesPage from "./pages/finances/FinancesPage";
import CategoriesPage from "./pages/finances/CategoriesPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import PreProductionPage from "./pages/workflow/PreProductionPage";
import ProductionPage from "./pages/workflow/ProductionPage";
import PostProductionPage from "./pages/workflow/PostProductionPage";
import RealtimeTestPage from "./pages/RealtimeTestPage";
import ClientPortal from "./pages/ClientPortal";
import Gallery from "./pages/Gallery";
import VideoPlayer from "./pages/VideoPlayer";

function App() {
  return (
    <QueryProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/client-portal" element={<ClientPortal />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/video-player/:videoId" element={<VideoPlayer />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scheduling"
              element={
                <ProtectedRoute requiredModule="scheduling">
                  <SchedulingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/estimates"
              element={
                <ProtectedRoute requiredModule="estimates">
                  <EstimatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/finances"
              element={
                <ProtectedRoute requiredModule="finances">
                  <FinancesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/finances/categories"
              element={
                <ProtectedRoute requiredModule="finances">
                  <CategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute requiredModule="invoices">
                  <InvoicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workflow/pre-production"
              element={
                <ProtectedRoute requiredModule="workflow">
                  <PreProductionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workflow/production"
              element={
                <ProtectedRoute requiredModule="workflow">
                  <ProductionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workflow/post-production"
              element={
                <ProtectedRoute requiredModule="workflow">
                  <PostProductionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/realtime-test"
              element={
                <ProtectedRoute>
                  <RealtimeTestPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </UserProvider>
    </QueryProvider>
  );
}

export default App;
