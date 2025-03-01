
import { Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import EstimatesPage from "./pages/estimates/EstimatesPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import FinancesPage from "./pages/finances/FinancesPage";
import SchedulingPage from "./pages/scheduling/SchedulingPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import RealtimeTestPage from "./pages/RealtimeTestPage";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<Layout><Outlet /></Layout>}>
        <Route 
          path="/" 
          element={<ProtectedRoute><Index /></ProtectedRoute>} 
        />
        <Route 
          path="/estimates" 
          element={<ProtectedRoute><EstimatesPage /></ProtectedRoute>} 
        />
        <Route 
          path="/invoices" 
          element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} 
        />
        <Route 
          path="/finances" 
          element={<ProtectedRoute><FinancesPage /></ProtectedRoute>} 
        />
        <Route 
          path="/scheduling/*" 
          element={<ProtectedRoute><SchedulingPage /></ProtectedRoute>} 
        />
        <Route 
          path="/realtime-test" 
          element={<ProtectedRoute><RealtimeTestPage /></ProtectedRoute>} 
        />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
