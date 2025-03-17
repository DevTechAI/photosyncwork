
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import EstimatesPage from "./pages/estimates/EstimatesPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import PreProductionPage from "./pages/workflow/PreProductionPage";
import ProductionPage from "./pages/workflow/ProductionPage";
import PostProductionPage from "./pages/workflow/PostProductionPage";
import FinancesPage from "./pages/finances/FinancesPage";
import SchedulingPage from "./pages/scheduling/SchedulingPage";
import { UserProvider } from "./contexts/UserContext";
import { Toaster } from "./components/ui/toaster";
import RealtimeTestPage from "./pages/RealtimeTestPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/estimates" element={<ProtectedRoute><EstimatesPage /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
            <Route path="/pre-production" element={<ProtectedRoute><PreProductionPage /></ProtectedRoute>} />
            <Route path="/production" element={<ProtectedRoute><ProductionPage /></ProtectedRoute>} />
            <Route path="/post-production" element={<ProtectedRoute><PostProductionPage /></ProtectedRoute>} />
            <Route path="/finances" element={<ProtectedRoute><FinancesPage /></ProtectedRoute>} />
            <Route path="/scheduling" element={<ProtectedRoute><SchedulingPage /></ProtectedRoute>} />
            <Route path="/realtime-test" element={<ProtectedRoute><RealtimeTestPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
