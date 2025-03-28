
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CompanySettings from "@/components/settings/CompanySettings";
import UserProfileSettings from "@/components/settings/UserProfileSettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import FreelancerManagement from "@/components/settings/FreelancerManagement";
import AccountManagerManagement from "@/components/settings/AccountManagerManagement";
import UsersList from "@/components/settings/UsersList";
import { User } from "@/types";
import AgencySettings from "@/components/settings/AgencySettings";
import UserManagerSettings from "@/components/settings/UserManagerSettings";
import AuditSettings from "@/components/settings/AuditSettings";
import { useAuth } from "@/hooks/use-auth";

interface SettingsContentProps {
  onSelectUser: (userId: string) => void;
  currentUser: User | null;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ onSelectUser, currentUser }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const currentSection = pathSegments[pathSegments.length - 1] === "settings" 
    ? "profile"  // Default to profile if just /settings
    : pathSegments[pathSegments.length - 1];
    
  const { isAdminOrSuperAdmin, isSuperAdmin } = useAuth();

  useEffect(() => {
    // Scroll to top when section changes
    window.scrollTo(0, 0);
  }, [currentSection]);

  // Vérifie si l'utilisateur a accès à certaines sections
  if ((currentSection === 'admin' || currentSection === 'audit') && !isSuperAdmin) {
    return (
      <div className="flex-1 md:max-w-3xl w-full">
        <Card>
          <CardHeader className="text-center text-destructive">
            Accès non autorisé
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Vous n'avez pas les droits nécessaires pour accéder à cette section.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if ((currentSection === 'users' || currentSection === 'agency' || 
       currentSection === 'freelancers' || currentSection === 'account-managers') && 
      !isAdminOrSuperAdmin) {
    return (
      <div className="flex-1 md:max-w-3xl w-full">
        <Card>
          <CardHeader className="text-center text-destructive">
            Accès non autorisé
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Vous n'avez pas les droits nécessaires pour accéder à cette section.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rendu du contenu en fonction du chemin actuel
  const renderContent = () => {
    switch (currentSection) {
      case "profile":
        return <UserProfileSettings currentUser={currentUser} />;
      case "notifications":
        return <NotificationsSettings />;
      case "security":
        return <SecuritySettings />;
      case "freelancers":
        return <FreelancerManagement />;
      case "account-managers":
        return <AccountManagerManagement />;
      case "users":
        return <UsersList onSelectUser={onSelectUser} />;
      case "agency":
        return <AgencySettings />;
      case "admin":
        return <UserManagerSettings />;
      case "audit":
        return <AuditSettings />;
      default:
        return <UserProfileSettings currentUser={currentUser} />;
    }
  };

  return (
    <div className="flex-1 md:max-w-3xl w-full">
      {renderContent()}
    </div>
  );
};

export default SettingsContent;
