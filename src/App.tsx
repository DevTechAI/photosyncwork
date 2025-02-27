
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import EstimatesPage from "./pages/estimates/EstimatesPage";
import FinancesPage from "./pages/finances/FinancesPage";
import PreProductionPage from "./pages/workflow/PreProductionPage";
import ProductionPage from "./pages/workflow/ProductionPage";
import PostProductionPage from "./pages/workflow/PostProductionPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/estimates" element={
                <ProtectedRoute requiredModule="estimates">
                  <EstimatesPage />
                </ProtectedRoute>
              } />
              <Route path="/invoices" element={
                <ProtectedRoute requiredModule="invoices">
                  <InvoicesPage />
                </ProtectedRoute>
              } />
              <Route path="/finances" element={
                <ProtectedRoute requiredModule="finances">
                  <FinancesPage />
                </ProtectedRoute>
              } />
              <Route path="/pre-production" element={
                <ProtectedRoute requiredModule="pre-production">
                  <PreProductionPage />
                </ProtectedRoute>
              } />
              <Route path="/production" element={
                <ProtectedRoute requiredModule="production">
                  <ProductionPage />
                </ProtectedRoute>
              } />
              <Route path="/post-production" element={
                <ProtectedRoute requiredModule="post-production">
                  <PostProductionPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
