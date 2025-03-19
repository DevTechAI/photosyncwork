
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Changed from default import
import { useUser } from "./contexts/UserContext"; // Changed from useUserContext to useUser
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Index from "./pages/Index";
import SchedulingPage from "./pages/scheduling/SchedulingPage";
import PreProductionPage from "./pages/workflow/PreProductionPage";
import ProductionPage from "./pages/workflow/ProductionPage";
import PostProductionPage from "./pages/workflow/PostProductionPage";
import NotFound from "./pages/NotFound";
import EstimatesPage from "./pages/estimates/EstimatesPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import FinancesPage from "./pages/finances/FinancesPage";
import CategoriesPage from "./pages/finances/CategoriesPage";
import { Toaster } from "./components/ui/sonner";
import RealtimeTestPage from "./pages/RealtimeTestPage";

function App() {
  const { currentUser, loading } = useUser(); // Changed from user to currentUser
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) return null;

  return (
    <>
      <Toaster richColors/>
      <Routes>
        <Route path="/login" element={<Login />} />
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
            <ProtectedRoute>
              <SchedulingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflow/pre-production"
          element={
            <ProtectedRoute>
              <PreProductionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflow/production"
          element={
            <ProtectedRoute>
              <ProductionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflow/post-production"
          element={
            <ProtectedRoute>
              <PostProductionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estimates"
          element={
            <ProtectedRoute>
              <EstimatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <InvoicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finances"
          element={
            <ProtectedRoute>
              <FinancesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finances/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
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
    </>
  );
}

export default App;
