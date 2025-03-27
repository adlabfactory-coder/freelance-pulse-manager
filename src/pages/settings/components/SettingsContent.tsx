
import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading state to give components time to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Vérifier que l'utilisateur a les permissions d'accès aux paramètres
  useEffect(() => {
    if (!isAdminOrSuperAdmin && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAdminOrSuperAdmin, isLoading, navigate]);
  
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

  // Rediriger si l'utilisateur n'est pas admin ou super admin
  if (!isAdminOrSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Extract the current tab from the URL path
  const path = location.pathname.split('/settings/')[1] || '';
  
  // Render the appropriate component based on the current path
  const renderContent = () => {
    // Base routes for all users
    if (path === '' || path === 'profile') {
      return <UserProfileTabs onSelectUser={onSelectUser} />;
    }
    if (path === 'security') {
      return <SecurityTab isCurrentUser={isCurrentUser} />;
    }
    if (path === 'api-keys') {
      return <ApiKeysTab />;
    }
    
    // Admin & Super Admin routes
    if (isAdminOrSuperAdmin) {
      if (path === 'users') {
        return <UsersManagementTabs onSelectUser={onSelectUser} />;
      }
      if (path === 'services') {
        return <ServicesSettings />;
      }
      if (path === 'commissions') {
        return <CommissionSettingsTab />;
      }
    }
    
    // Super Admin only routes
    if (isSuperAdmin && path === 'database') {
      return <DatabaseTab />;
    }
    
    // If path doesn't match any valid route, navigate to settings home
    if (path !== '') {
      navigate('/settings', { replace: true });
      return null;
    }
    
    return <UserProfileTabs onSelectUser={onSelectUser} />;
  };
  
  return (
    <div className="flex-1 space-y-4">
      {renderContent()}
    </div>
  );
};

export default SettingsContent;
