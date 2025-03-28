
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import UserManager from "@/pages/admin/UserManager";

const UserManagerSettings: React.FC = () => {
  const { isAdminOrSuperAdmin } = useAuth();

  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Vous n'avez pas les droits nécessaires pour accéder à cette page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <UserManager />
    </div>
  );
};

export default UserManagerSettings;
