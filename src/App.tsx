
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import FinancesPage from "./pages/finances/FinancesPage";
import { QueryProvider } from "./QueryProvider";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import EstimatesPage from "./pages/estimates/EstimatesPage";
import PreProductionPage from "./pages/workflow/PreProductionPage";
import ProductionPage from "./pages/workflow/ProductionPage";
import PostProductionPage from "./pages/workflow/PostProductionPage";

function App() {
  return (
    <QueryProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/finances" element={<ProtectedRoute requiredModule="finances"><FinancesPage /></ProtectedRoute>} />
        <Route path="/estimates" element={<ProtectedRoute requiredModule="crm"><EstimatesPage /></ProtectedRoute>} />
        
        {/* Workflow routes */}
        <Route path="/workflow/pre-production" element={<ProtectedRoute requiredModule="crm"><PreProductionPage /></ProtectedRoute>} />
        <Route path="/workflow/production" element={<ProtectedRoute requiredModule="production"><ProductionPage /></ProtectedRoute>} />
        <Route path="/workflow/post-production" element={<ProtectedRoute requiredModule="post-production"><PostProductionPage /></ProtectedRoute>} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryProvider>
  );
}

export default App;
