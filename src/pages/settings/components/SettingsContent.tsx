
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserProfileTabs from "@/components/settings/tabs/UserTabs";
import SecurityTab from "@/components/settings/tabs/SecurityTab";
import UsersManagementTabs from "@/components/settings/UsersManagementTabs";
import ServicesSettings from "@/components/settings/ServicesSettings";
import DatabaseTab from "@/components/settings/DatabaseTab";
import ApiKeysTab from "@/components/settings/api-keys/ApiKeysTab";
import CommissionSettingsTab from "@/pages/settings/components/CommissionSettingsTab";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SettingsContentProps {
  onSelectUser?: (userId: string) => void;
  currentUser?: any;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ 
  onSelectUser = () => {}, 
  currentUser 
}) => {
  const { isSuperAdmin, isAdminOrSuperAdmin, user } = useAuth();
  const isCurrentUser = currentUser && user ? currentUser.id === user.id : true;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate loading state to give components time to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex-1 space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
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
            <Route path="users" element={<UsersManagementTabs onSelectUser={onSelectUser} />} />
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
