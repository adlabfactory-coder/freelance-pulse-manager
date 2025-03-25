
import React from "react";
import CompanySettings from "@/components/settings/CompanySettings";
import UsersManagement from "@/components/settings/UsersManagement";
import ServicesSettings from "@/components/settings/ServicesSettings";
import CommissionSettings from "@/components/settings/CommissionSettings";
import ScheduleSettings from "@/components/settings/ScheduleSettings";
import DatabaseTab from "@/components/settings/DatabaseTab";

interface SettingsTabContentProps {
  activeTab: string;
  currentUser?: any;
  users?: any[];
  isLoading?: boolean;
  onUserSelect?: (userId: string) => void;
  selectedUserId?: string;
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({
  activeTab,
  currentUser,
  users,
  isLoading,
  onUserSelect,
  selectedUserId,
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "company":
        return <CompanySettings />;
      case "users":
        return (
          <UsersManagement
            currentUser={currentUser}
            users={users}
            isLoading={isLoading}
            onUserSelect={onUserSelect}
            selectedUserId={selectedUserId}
          />
        );
      case "commissions":
        return <CommissionSettings />;
      case "schedule":
        return <ScheduleSettings />;
      case "database":
        return <DatabaseTab />;
      case "services":
        return <ServicesSettings />;
      default:
        return <div>Sélectionnez un onglet</div>;
    }
  };

  return <div className="p-6">{renderTabContent()}</div>;
};

export default SettingsTabContent;
