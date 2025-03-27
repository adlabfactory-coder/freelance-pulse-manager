
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SettingsPage from "./SettingsPage";
import NotificationSettings from "./components/NotificationSettings";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const SettingsRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const isLoading = !user && !isAuthenticated; // Simuler isLoading en vérifiant si user est null et non authentifié
  
  // Fonction factice pour gérer l'enregistrement des paramètres de notification
  const handleSaveNotificationSettings = async (settings: any) => {
    // Dans une véritable implémentation, vous enverriez ces paramètres à votre API
    console.log("Saving notification settings:", settings);
    toast.success("Paramètres de notification enregistrés avec succès");
    return Promise.resolve();
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<SettingsPage />}>
        <Route index element={<Navigate to="/settings/profile" replace />} />
        <Route path="profile" element={null} />
        <Route path="security" element={null} />
        <Route path="api-keys" element={null} />
        <Route path="users" element={null} />
        <Route path="services" element={null} />
        <Route path="commissions" element={null} />
        <Route path="database" element={null} />
        <Route path="notifications" element={<NotificationSettings onSave={handleSaveNotificationSettings} />} />
      </Route>
    </Routes>
  );
};

export default SettingsRoutes;
