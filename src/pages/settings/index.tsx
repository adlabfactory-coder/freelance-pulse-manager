
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SettingsPage from "./SettingsPage";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const SettingsRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const isLoading = !user && !isAuthenticated;
  
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Routes>
      {/* Route principale qui affiche la page Settings avec tous ses enfants */}
      <Route index element={<SettingsPage />} />
      <Route path="profile" element={<SettingsPage />} />
      <Route path="notifications" element={<SettingsPage />} />
      <Route path="security" element={<SettingsPage />} />
      <Route path="api-keys" element={<SettingsPage />} />
      <Route path="users" element={<SettingsPage />} />
      <Route path="services" element={<SettingsPage />} />
      <Route path="commissions" element={<SettingsPage />} />
      <Route path="database" element={<SettingsPage />} />
      <Route path="agency" element={<SettingsPage />} />
      <Route path="freelancers" element={<SettingsPage />} />
      <Route path="account-managers" element={<SettingsPage />} />
      <Route path="admin" element={<SettingsPage />} />
      <Route path="audit" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/settings/profile" replace />} />
    </Routes>
  );
};

export default SettingsRoutes;
