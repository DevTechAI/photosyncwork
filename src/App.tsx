
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import FinancesPage from "./pages/finances/FinancesPage";
import { QueryProvider } from "./QueryProvider";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import EstimatesPage from "./pages/estimates/EstimatesPage";

function App() {
  return (
    <QueryProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/finances" element={<ProtectedRoute requiredModule="finances"><FinancesPage /></ProtectedRoute>} />
        <Route path="/estimates" element={<ProtectedRoute requiredModule="crm"><EstimatesPage /></ProtectedRoute>} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryProvider>
  );
}

export default App;
