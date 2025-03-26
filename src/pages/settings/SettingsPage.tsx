
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import SettingsContent from "@/pages/settings/components/SettingsContent";
import SettingsHeader from "@/pages/settings/components/SettingsHeader";
import SettingsLoading from "@/pages/settings/components/SettingsLoading";
import SettingsError from "@/pages/settings/components/SettingsError";
import { User } from "@/types";
import useSettingsData from "./hooks/useSettingsData";

const SettingsPage: React.FC = () => {
  const location = useLocation();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { currentUser, users, isAdmin, isSuperAdmin, loadingUser, error, dbStatus } = useSettingsData();

  useEffect(() => {
    // Réinitialiser l'utilisateur sélectionné quand la section change
    setSelectedUser(null);
  }, [location.pathname]);

  const handleSelectUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  if (loadingUser) {
    return <SettingsLoading />;
  }

  if (error) {
    return <SettingsError error={error} />;
  }

  return (
    <div className="container py-6 space-y-6">
      <SettingsHeader 
        title="Paramètres" 
        description="Gérez vos préférences et configurations."
        currentUser={selectedUser || currentUser}
        isAdmin={isAdmin}
        isSuperAdmin={isSuperAdmin}
      />
      
      <div className="flex flex-col md:flex-row gap-6">
        <SettingsSidebar 
          currentUser={selectedUser || currentUser} 
          isAdmin={isAdmin} 
          isSuperAdmin={isSuperAdmin} 
        />
        
        <SettingsContent 
          onSelectUser={handleSelectUser} 
          currentUser={selectedUser || currentUser} 
        />
      </div>
    </div>
  );
};

export default SettingsPage;
