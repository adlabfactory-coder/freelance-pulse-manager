
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserProfile from "@/components/settings/UserProfile";
import CompanySettings from "@/components/settings/CompanySettings";
import ServicesSettings from "@/components/settings/ServicesSettings";
import CommissionSettings from "@/components/settings/CommissionSettings";
import ScheduleSettings from "@/components/settings/ScheduleSettings";
import SettingsError from "./SettingsError";
import SettingsLoading from "./SettingsLoading";
import DatabaseTab from "@/components/settings/DatabaseTab";
import FreelancerManagement from "@/components/settings/FreelancerManagement";
import UserTabs from "@/components/settings/tabs/UserTabs";
import UserForm from "@/components/settings/UserForm";
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
  onUserSelect
}) => {
  const { isAdmin, isSuperAdmin, isAdminOrSuperAdmin } = useAuth();

  if (isLoading) {
    return <SettingsLoading />;
  }

  if (error) {
    return <SettingsError title="Erreur" description={error} onRetry={() => {}} />;
  }

  return (
    <Routes>
      <Route index element={<Navigate to="profile" replace />} />
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
      
      {/* Routes de gestion des utilisateurs pour Admin et SuperAdmin */}
      {isAdminOrSuperAdmin && (
        <>
          <Route path="/users" element={<UserTabs onSelectUser={onUserSelect} />} />
          <Route path="/add-user" element={<UserForm />} />
          <Route path="/edit-user/:id" element={<UserForm isEditing />} />
        </>
      )}
      
      {/* Route spécifique pour gestion des freelances */}
      {isAdmin && <Route path="/freelancers" element={<FreelancerManagement />} />}
      
      {/* Redirection par défaut sur la première route si aucune ne correspond */}
      <Route path="*" element={<Navigate to="profile" replace />} />
    </Routes>
  );
};

export default SettingsContent;
