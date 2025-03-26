
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserProfileTabs from "@/components/settings/tabs/UserTabs";
import SecurityTab from "@/components/settings/tabs/SecurityTab";
import UsersManagement from "@/components/settings/UsersManagement";
import FreelancerManagement from "@/components/settings/FreelancerManagement";
import ServicesSettings from "@/components/settings/ServicesSettings";
import DatabaseTab from "@/components/settings/DatabaseTab";
import ApiKeysTab from "@/components/settings/api-keys/ApiKeysTab";
import CommissionSettingsTab from "@/pages/settings/components/CommissionSettingsTab";
import { useAuth } from "@/hooks/use-auth";

interface SettingsContentProps {
  onSelectUser?: (userId: string) => void;
  currentUser?: any;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ 
  onSelectUser = () => {}, // valeur par défaut pour éviter les erreurs
  currentUser 
}) => {
  const { isSuperAdmin, isAdminOrSuperAdmin, user } = useAuth();
  const isCurrentUser = currentUser && user ? currentUser.id === user.id : true;
  
  return (
    <div className="flex-1 space-y-4">
      <Routes>
        {/* Base routes for all users */}
        <Route path="" element={<UserProfileTabs onSelectUser={onSelectUser} />} />
        <Route path="security" element={<SecurityTab isCurrentUser={isCurrentUser} />} />
        <Route path="api-keys" element={<ApiKeysTab />} />
        
        {/* Admin & Super Admin routes */}
        {isAdminOrSuperAdmin && (
          <>
            <Route path="users" element={<UsersManagement onSelectUser={onSelectUser} />} />
            <Route path="freelancers" element={<FreelancerManagement />} />
            <Route path="services" element={<ServicesSettings />} />
            <Route path="commissions" element={<CommissionSettingsTab />} />
          </>
        )}
        
        {/* Super Admin only routes */}
        {isSuperAdmin && (
          <Route path="database" element={<DatabaseTab />} />
        )}
        
        {/* Fallback redirect for invalid routes */}
        <Route path="*" element={<Navigate to="/settings" replace />} />
      </Routes>
    </div>
  );
};

export default SettingsContent;
