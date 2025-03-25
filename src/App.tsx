// Import React and React Router dependencies
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Import components
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import ContactDetailPage from "./pages/contacts/ContactDetailPage";
import Appointments from "./pages/Appointments";
import Quotes from "./pages/Quotes";
import Subscriptions from "./pages/Subscriptions";
import Commissions from "./pages/Commissions";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/settings";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import TooltipProvider
import { TooltipProvider } from "@/components/ui/tooltip";

// Import styles
import "./App.css";

import CommissionDetailPage from "./pages/commissions/CommissionDetailPage";

function App() {
  return (
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/detail/:contactId" element={<ContactDetailPage />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/commissions" element={<Commissions />} />
            <Route path="/commissions/detail/:commissionId" element={<CommissionDetailPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings/*" element={<SettingsPage />} />
          </Route>
          {/* Catch-all route for 404 pages */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  );
}

export default App;
