
import React from "react";
import { Routes, Route } from "react-router-dom";
import UserProfile from "@/components/settings/UserProfile";
import CompanySettings from "@/components/settings/CompanySettings";
import ServicesSettings from "@/components/settings/ServicesSettings";
import CommissionSettings from "@/components/settings/CommissionSettings";
import ScheduleSettings from "@/components/settings/ScheduleSettings";
import SettingsError from "./SettingsError";
import SettingsLoading from "./SettingsLoading";
import DatabaseTab from "@/components/settings/DatabaseTab";
import FreelancerManagement from "@/components/settings/FreelancerManagement";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types";

interface SettingsContentProps {
  isLoading: boolean;
  currentUser: User;
  selectedUserId: string;
  activeTab: string;
  onUserSelect: (userId: string) => void;
  onTabChange: (value: string) => void;
  users?: User[];
  error?: string | null;
}

const SettingsContent: React.FC<SettingsContentProps> = ({
  isLoading,
  error,
  currentUser,
  selectedUserId,
}) => {
  const { isAdmin } = useAuth();

  if (isLoading) {
    return <SettingsLoading />;
  }

  if (error) {
    return <SettingsError title="Erreur" description={error} onRetry={() => {}} />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <UserProfile
            userId={selectedUserId}
            currentUser={currentUser}
          />
        }
      />
      <Route
        path="/profile"
        element={
          <UserProfile
            userId={selectedUserId}
            currentUser={currentUser}
          />
        }
      />
      <Route path="/company" element={<CompanySettings />} />
      <Route path="/services" element={<ServicesSettings />} />
      <Route path="/commissions" element={<CommissionSettings />} />
      <Route path="/schedule" element={<ScheduleSettings />} />
      <Route path="/database" element={<DatabaseTab />} />
      {isAdmin && <Route path="/freelancers" element={<FreelancerManagement />} />}
    </Routes>
  );
};

export default SettingsContent;
