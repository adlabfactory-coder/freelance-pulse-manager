
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserProfileTabs from "@/components/settings/tabs/UserTabs";
import SecurityTab from "@/components/settings/tabs/SecurityTab";
import UsersManagement from "@/components/settings/UsersManagement";
import FreelancerManagement from "@/components/settings/FreelancerManagement";
import ServicesSettings from "@/components/settings/ServicesSettings";
import DatabaseTab from "@/components/settings/DatabaseTab";
import ApiKeysTab from "@/components/settings/api-keys/ApiKeysTab";
import { useAuth } from "@/hooks/use-auth";

const SettingsContent: React.FC = () => {
  const { isSuperAdmin, isAdminOrSuperAdmin } = useAuth();
  
  return (
    <div className="flex-1 space-y-4">
      <Routes>
        {/* Base routes for all users */}
        <Route path="" element={<UserProfileTabs />} />
        <Route path="security" element={<SecurityTab />} />
        <Route path="api-keys" element={<ApiKeysTab />} />
        
        {/* Admin & Super Admin routes */}
        {isAdminOrSuperAdmin && (
          <>
            <Route path="users" element={<UsersManagement />} />
            <Route path="freelancers" element={<FreelancerManagement />} />
            <Route path="services" element={<ServicesSettings />} />
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
