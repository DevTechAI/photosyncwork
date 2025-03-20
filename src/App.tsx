
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import FinancesPage from "./pages/finances/FinancesPage";
import { QueryProvider } from "./QueryProvider";

function App() {
  return (
    <QueryProvider>
      <Routes>
        <Route path="/" element={<FinancesPage />} />
        <Route path="/finances" element={<FinancesPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      <Toaster />
    </QueryProvider>
  );
}

export default App;
