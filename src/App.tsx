
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnitProvider } from "@/contexts/UnitContext";
import { PeriodProvider } from "@/contexts/PeriodContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CostCenterCategoriesPage } from "./components/CostCenterCategoriesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UnitProvider>
        <PeriodProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cost-center-categories" element={<CostCenterCategoriesPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PeriodProvider>
      </UnitProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
