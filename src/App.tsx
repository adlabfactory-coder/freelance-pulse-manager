
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import ResetDemoPasswords from "./pages/auth/ResetDemoPasswords";
import SyncUsers from "./pages/auth/SyncUsers";
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
import AdminPage from "./pages/AdminPage";
import AuditPage from "./pages/AuditPage";
import { Toaster } from "./components/ui/toaster";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./hooks/use-auth";
import { Toaster as SonnerToaster } from "./components/ui/sonner";
import { SupabaseProvider } from "./hooks/use-supabase";
import UserManager from "@/pages/admin/UserManager";
import AccountManagersDistributionPage from "@/pages/admin/AccountManagersDistributionPage";
import ResetAllPasswords from "./pages/auth/ResetAllPasswords";
import UsersSyncStatus from "./pages/auth/UsersSyncStatus";

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <SupabaseProvider>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Index />} />
            <Route path="/auth/login" element={<Login />} />
            
            {/* Routes d'administration/utilitaires - accessibles uniquement via URL directe */}
            <Route path="/auth/reset-demo-passwords" element={<ResetDemoPasswords />} />
            <Route path="/auth/reset-all-passwords" element={<ResetAllPasswords />} />
            <Route path="/auth/sync-users" element={<SyncUsers />} />
            <Route path="/auth/users-sync-status" element={<UsersSyncStatus />} />
            
            {/* Routes protégées - nécessitent une authentification */}
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
                
                {/* Settings routes - accessible only to admins and super admins */}
                <Route path="/settings/*" element={<SettingsRoutes />} />
                
                {/* Admin routes - accessible to admins and super admins */}
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/users" element={<UserManager />} />
                <Route path="/admin/account-managers" element={<AccountManagersDistributionPage />} />
                
                {/* Audit route - accessible only to super admins */}
                <Route path="/audit" element={<AuditPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <SonnerToaster />
        </SupabaseProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
