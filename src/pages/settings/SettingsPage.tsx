
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSettingsData } from "@/pages/settings/hooks/useSettingsData";
import { UserRole } from "@/types";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import UserProfile from "@/components/settings/UserProfile";
import CompanySettings from "@/components/settings/CompanySettings";
import FreelancerManagement from "@/components/settings/FreelancerManagement";
import UsersManagement from "@/components/settings/UsersManagement";
import DatabaseTab from "@/components/settings/DatabaseTab";
import ScheduleSettings from "@/components/settings/ScheduleSettings";
import ServicesSettings from "@/components/settings/ServicesSettings";
import CommissionSettingsTab from "@/pages/settings/components/CommissionSettingsTab";
import ApiKeysTab from "@/components/settings/api-keys/ApiKeysTab";
import SettingsError from "@/pages/settings/components/SettingsError";
import { Skeleton } from "@/components/ui/skeleton";

export const SettingsPage: React.FC = () => {
  const { tab = "profile" } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { 
    currentUser, 
    users, 
    isAdmin, 
    isSuperAdmin,
    loadingUser,
    error 
  } = useSettingsData();

  // Réinitialiser l'utilisateur sélectionné lors du changement d'onglet
  useEffect(() => {
    setSelectedUserId(null);
  }, [tab]);

  // Afficher un écran de chargement
  if (loadingUser) {
    return (
      <div className="py-10 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="flex gap-6">
          <Skeleton className="h-[500px] w-64" />
          <div className="flex-1 space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Gérer les erreurs
  if (error) {
    return (
      <SettingsError 
        error={error} 
        onRetry={() => navigate(0)} 
      />
    );
  }

  // Vérifier que l'utilisateur est bien chargé
  if (!currentUser) {
    return (
      <div className="py-10 text-center text-red-500">
        Erreur de chargement du profil utilisateur. Veuillez vous reconnecter.
      </div>
    );
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
