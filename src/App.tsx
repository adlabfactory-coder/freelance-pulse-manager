
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import ResetDemoPasswords from "./pages/auth/ResetDemoPasswords";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Appointments from "./pages/Appointments";
import Quotes from "./pages/Quotes";
import QuoteDetailPage from "./pages/quotes/QuoteDetailPage";
import Subscriptions from "./pages/Subscriptions";
import Reports from "./pages/Reports";
import Commissions from "./pages/Commissions";
import SettingsPage from "./pages/settings/SettingsPage";
import ContactDetailPage from "./pages/contacts/ContactDetailPage";
import CommissionDetailPage from "./pages/commissions/CommissionDetailPage";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./hooks/use-theme";

function App() {
  return (
    <div className="app">
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/reset-demo-passwords" element={<ResetDemoPasswords />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/contacts/:contactId" element={<ContactDetailPage />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/quotes" element={<Quotes />} />
              <Route path="/quotes/:quoteId" element={<QuoteDetailPage />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/commissions" element={<Commissions />} />
              <Route path="/commissions/:commissionId" element={<CommissionDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/:tab" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;
