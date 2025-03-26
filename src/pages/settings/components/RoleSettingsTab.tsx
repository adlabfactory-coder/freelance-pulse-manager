
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleManagement from "@/components/settings/roles/RoleManagement";
import UsersByRole from "@/components/settings/roles/UsersByRole";
import { useAuth } from "@/hooks/use-auth";

const RoleSettingsTab: React.FC = () => {
  const { isAdminOrSuperAdmin } = useAuth();
  
  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des rôles</CardTitle>
          <CardDescription>
            Vous n'avez pas les autorisations nécessaires pour accéder à cette section.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des rôles utilisateurs</CardTitle>
          <CardDescription>
            Configurez les rôles et visualisez les utilisateurs par rôle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">Utilisateurs par rôle</TabsTrigger>
              <TabsTrigger value="permissions">Permissions des rôles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <UsersByRole />
            </TabsContent>
            
            <TabsContent value="permissions">
              <RoleManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSettingsTab;
