
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSettingsData } from "@/pages/settings/hooks/useSettingsData";
import { UserRole } from "@/types";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import UserProfile from "@/components/settings/UserProfile";
import CompanySettings from "@/components/settings/CompanySettings";
import FreelancerManagement from "@/components/settings/FreelancerManagement";
import UsersManagement from "@/components/settings/UsersManagement";
import DatabaseTab from "@/components/settings/DatabaseTab";
import ScheduleSettings from "@/components/settings/ScheduleSettings";
import ServicesSettings from "@/components/settings/ServicesSettings";
import CommissionSettingsTab from "@/components/settings/components/CommissionSettingsTab";
import ApiKeysTab from "@/components/settings/api-keys/ApiKeysTab";

export const SettingsPage: React.FC = () => {
  const { tab = "profile" } = useParams<{ tab: string }>();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { 
    currentUser, 
    users, 
    isAdmin, 
    isSuperAdmin,
    loadingUser 
  } = useSettingsData();

  if (loadingUser || !currentUser) {
    return <div className="py-10 text-center">Chargement des paramètres...</div>;
  }

  // Rendre le contenu en fonction de l'onglet sélectionné
  const renderTabContent = () => {
    switch (tab) {
      case "profile":
        return <UserProfile userId={selectedUserId || currentUser.id} currentUser={currentUser} />;
      case "company":
        return <CompanySettings />;
      case "users":
        return isAdmin ? (
          <UsersManagement users={users} onSelectUser={setSelectedUserId} />
        ) : (
          <div className="text-red-500">Accès restreint aux administrateurs.</div>
        );
      case "freelancers":
        return isAdmin ? (
          <FreelancerManagement />
        ) : (
          <div className="text-red-500">Accès restreint aux administrateurs.</div>
        );
      case "database":
        return isSuperAdmin ? (
          <DatabaseTab />
        ) : (
          <div className="text-red-500">Accès restreint aux super administrateurs.</div>
        );
      case "schedule":
        return <ScheduleSettings />;
      case "services":
        return <ServicesSettings />;
      case "commissions":
        return <CommissionSettingsTab />;
      case "api-keys":
        return isAdmin ? (
          <ApiKeysTab />
        ) : (
          <div className="text-red-500">Accès restreint aux administrateurs.</div>
        );
      default:
        return <div>Sélectionnez un onglet de paramètres</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-64 flex-shrink-0">
        <SettingsSidebar
          currentUser={currentUser}
          isAdmin={currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN}
          isSuperAdmin={currentUser.role === UserRole.SUPER_ADMIN}
        />
      </div>
      <div className="flex-1">{renderTabContent()}</div>
    </div>
  );
};

export default SettingsPage;
