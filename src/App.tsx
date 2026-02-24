import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Confetti from "./components/Confetti";
import Index from "./pages/Index";
import Sets from "./pages/Sets";
import SetDetail from "./pages/SetDetail";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import SettingsPage from "./pages/SettingsPage";
import Products from "./pages/Products";
import Wholesale from "./pages/Wholesale";
import DealerFinder from "./pages/DealerFinder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Confetti />
          <Routes>
            {/* Öğrenci Sayfaları */}
            <Route path="/" element={<Index />} />
            <Route path="/sets" element={<Sets />} />
            <Route path="/set/:id" element={<SetDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* B2B / Ürün Sayfaları */}
            <Route path="/urunler" element={<Products />} />
            <Route path="/toptan-teklif" element={<Wholesale />} />
            <Route path="/bayi-bul" element={<DealerFinder />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
