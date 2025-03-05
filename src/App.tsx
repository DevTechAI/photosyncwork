import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EstimatesPage from "./pages/EstimatesPage";
import InvoicesPage from "./pages/InvoicesPage";
import ClientsPage from "./pages/ClientsPage";
import SchedulingPage from "./pages/SchedulingPage";
import PreProductionPage from "./pages/workflow/PreProductionPage";
import ProductionPage from "./pages/workflow/ProductionPage";
import PostProductionPage from "./pages/workflow/PostProductionPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { UserProvider } from "./contexts/UserContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <UserProvider>
      <SettingsProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/estimates" element={<EstimatesPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/scheduling" element={<SchedulingPage />} />
            <Route path="/workflow/pre-production" element={<PreProductionPage />} />
            <Route path="/workflow/production" element={<ProductionPage />} />
            <Route path="/workflow/post-production" element={<PostProductionPage />} />
            
            {/* Add Settings route */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SettingsProvider>
      <Toaster />
    </UserProvider>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
