
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

interface SettingsContentProps {
  onSelectUser: (userId: string) => void;
  currentUser: User | null;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ onSelectUser, currentUser }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const currentSection = pathSegments[pathSegments.length - 1];

  useEffect(() => {
    // Scroll to top when section changes
    window.scrollTo(0, 0);
  }, [currentSection]);

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
      case "settings": // Page par défaut
      default:
        return <CompanySettings />;
    }
  };

  return (
    <div className="flex-1 md:max-w-3xl w-full">
      {renderContent()}
    </div>
  );
};

export default SettingsContent;
