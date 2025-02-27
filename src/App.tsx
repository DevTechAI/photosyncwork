
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
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
import "./App.css";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute component={Index} />} />
          <Route path="/estimates" element={<ProtectedRoute component={EstimatesPage} />} />
          <Route path="/invoices" element={<ProtectedRoute component={InvoicesPage} />} />
          <Route path="/pre-production" element={<ProtectedRoute component={PreProductionPage} />} />
          <Route path="/production" element={<ProtectedRoute component={ProductionPage} />} />
          <Route path="/post-production" element={<ProtectedRoute component={PostProductionPage} />} />
          <Route path="/finances" element={<ProtectedRoute component={FinancesPage} />} />
          <Route path="/scheduling" element={<ProtectedRoute component={SchedulingPage} />} />
          <Route path="/realtime-test" element={<ProtectedRoute component={RealtimeTestPage} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </UserProvider>
  );
}

export default App;
