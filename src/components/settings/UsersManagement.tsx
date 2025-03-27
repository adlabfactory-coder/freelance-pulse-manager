
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UserRole } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import useUsersManagementData from "@/hooks/settings/useUsersManagementData";
import UsersLoadingState from "./users/UsersLoadingState";
import UsersErrorState from "./users/UsersErrorState";
import UsersTable from "./users/UsersTable";
import UsersHeader from "./users/UsersHeader";

interface UsersManagementProps {
  onSelectUser: (userId: string) => void;
  currentUser?: User;
  users?: User[];
  selectedUserId?: string;
  isLoading?: boolean;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ 
  onSelectUser,
  currentUser,
  users: externalUsers,
  selectedUserId,
  isLoading: externalLoading
}) => {
  const { role: currentUserRole, isAdminOrSuperAdmin } = useAuth();
  const { users, isLoading, hasError, fetchUsersData } = useUsersManagementData(externalUsers, externalLoading);

  const handleUserClick = (user: User) => {
    onSelectUser(user.id);
  };

  const handleRetry = () => {
    fetchUsersData();
  };

  // Ensure this function returns a Promise<void> to match the expected type
  const handleUserUpdated = async (): Promise<void> => {
    return fetchUsersData();
  };

  // Vérification des permissions administratives
  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Vous n'avez pas les droits nécessaires pour accéder à cette section.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Liste de tous les utilisateurs de l'application
          </CardDescription>
        </div>
        <UsersHeader onRefresh={handleRetry} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <UsersLoadingState />
        ) : hasError ? (
          <UsersErrorState onRetry={handleRetry} />
        ) : (
          <UsersTable
            users={users}
            selectedUserId={selectedUserId}
            currentUserRole={currentUserRole as UserRole}
            onUserClick={handleUserClick}
            onUserUpdated={handleUserUpdated}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
