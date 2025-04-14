
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
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
import InvoicesPage from "./pages/invoices/InvoicesPage";
import CategoriesPage from "./pages/finances/CategoriesPage";
import SchedulingPage from "./pages/scheduling/SchedulingPage";

function App() {
  return (
    <QueryProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/finances" element={<ProtectedRoute requiredModule="finances"><FinancesPage /></ProtectedRoute>} />
        <Route path="/finances/categories" element={<ProtectedRoute requiredModule="finances"><CategoriesPage /></ProtectedRoute>} />
        <Route path="/estimates" element={<ProtectedRoute requiredModule="crm"><EstimatesPage /></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute requiredModule="accounts"><InvoicesPage /></ProtectedRoute>} />
        
        {/* Add Scheduling route */}
        <Route path="/scheduling" element={<ProtectedRoute requiredModule="crm"><SchedulingPage /></ProtectedRoute>} />
        
        {/* Workflow routes */}
        <Route path="/workflow/pre-production" element={<ProtectedRoute requiredModule="crm"><PreProductionPage /></ProtectedRoute>} />
        <Route path="/workflow/production" element={<ProtectedRoute requiredModule="production"><ProductionPage /></ProtectedRoute>} />
        <Route path="/workflow/post-production" element={<ProtectedRoute requiredModule="post-production"><PostProductionPage /></ProtectedRoute>} />
        
        {/* Add direct routes without "/workflow/" prefix to match navigation links */}
        <Route path="/pre-production" element={<ProtectedRoute requiredModule="crm"><PreProductionPage /></ProtectedRoute>} />
        <Route path="/production" element={<ProtectedRoute requiredModule="production"><ProductionPage /></ProtectedRoute>} />
        <Route path="/post-production" element={<ProtectedRoute requiredModule="post-production"><PostProductionPage /></ProtectedRoute>} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryProvider>
  );
}

export default App;
