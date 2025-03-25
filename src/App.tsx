
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Contacts from "@/pages/Contacts";
import Appointments from "@/pages/Appointments";
import Quotes from "@/pages/Quotes";
import Subscriptions from "@/pages/Subscriptions";
import Commissions from "@/pages/Commissions";
import Reports from "@/pages/Reports";
import Settings from "@/pages/settings";
import NotFound from "@/pages/NotFound";
import { createContext } from "react";
import { supabase } from "@/lib/supabase";

export const SupabaseContext = createContext(supabase);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseContext.Provider value={supabase}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/quotes" element={<Quotes />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/commissions" element={<Commissions />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseContext.Provider>
  </QueryClientProvider>
);

export default App;
