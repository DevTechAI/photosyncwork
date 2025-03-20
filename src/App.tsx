
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import FinancesPage from "./pages/finances/FinancesPage";
import { QueryProvider } from "./QueryProvider";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <QueryProvider>
      <Routes>
        <Route path="/" element={<FinancesPage />} />
        <Route path="/finances" element={<FinancesPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryProvider>
  );
}

export default App;
