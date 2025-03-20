
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import FinancesPage from "./pages/finances/FinancesPage";
import { QueryProvider } from "./QueryProvider";

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FinancesPage />} />
          <Route path="/finances" element={<FinancesPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
