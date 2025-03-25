
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

interface SettingsContentProps {
  isLoading: boolean;
  error: string | null;
  currentUserId: string;
  currentUser: any;
  selectedUserId: string;
}

const SettingsContent: React.FC<SettingsContentProps> = ({
  isLoading,
  error,
  currentUserId,
  currentUser,
  selectedUserId,
}) => {
  const { isAdmin } = useAuth();

  if (isLoading) {
    return <SettingsLoading />;
  }

  if (error) {
    return <SettingsError error={error} />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <UserProfile
            userId={selectedUserId || currentUserId}
            currentUser={currentUser}
          />
        }
      />
      <Route
        path="/profile"
        element={
          <UserProfile
            userId={selectedUserId || currentUserId}
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
