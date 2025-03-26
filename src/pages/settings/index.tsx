
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SettingsPage from "./SettingsPage";
import NotificationSettings from "./components/NotificationSettings";
import { useAuth } from "@/hooks/use-auth";

const SettingsRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const isLoading = !user && !isAuthenticated; // Simuler isLoading en vérifiant si user est null et non authentifié

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<SettingsPage />}>
        <Route path="" element={<Navigate to="/settings" replace />} />
        <Route path="security" element={null} />
        <Route path="api-keys" element={null} />
        <Route path="users" element={null} />
        <Route path="services" element={null} />
        <Route path="commissions" element={null} />
        <Route path="database" element={null} />
        <Route path="notifications" element={<NotificationSettings />} />
      </Route>
    </Routes>
  );
};

export default SettingsRoutes;
