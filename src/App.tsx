
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useUserContext } from "./contexts/UserContext";
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
  const { user, loading } = useUserContext();
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
            <ProtectedRoute user={user}>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scheduling"
          element={
            <ProtectedRoute user={user}>
              <SchedulingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflow/pre-production"
          element={
            <ProtectedRoute user={user}>
              <PreProductionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflow/production"
          element={
            <ProtectedRoute user={user}>
              <ProductionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflow/post-production"
          element={
            <ProtectedRoute user={user}>
              <PostProductionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estimates"
          element={
            <ProtectedRoute user={user}>
              <EstimatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute user={user}>
              <InvoicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finances"
          element={
            <ProtectedRoute user={user}>
              <FinancesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finances/categories"
          element={
            <ProtectedRoute user={user}>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/realtime-test"
          element={
            <ProtectedRoute user={user}>
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
