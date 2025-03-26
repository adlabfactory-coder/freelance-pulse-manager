
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
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
import SettingsRoutes from "./pages/settings";
import ContactDetailPage from "./pages/contacts/ContactDetailPage";
import CommissionDetailPage from "./pages/commissions/CommissionDetailPage";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./hooks/use-theme";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./hooks/use-auth";
import { Toaster as SonnerToaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="app">
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/reset-demo-passwords" element={<ResetDemoPasswords />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
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
                  <Route path="/settings/*" element={<SettingsRoutes />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <SonnerToaster />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
