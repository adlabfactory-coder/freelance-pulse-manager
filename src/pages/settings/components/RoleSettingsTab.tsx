
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleManagement from "@/components/settings/roles/RoleManagement";
import UsersByRole from "@/components/settings/roles/UsersByRole";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useUsersDataLoader } from "@/pages/settings/hooks/useUsersDataLoader";

const RoleSettingsTab: React.FC = () => {
  const { isAdminOrSuperAdmin } = useAuth();
  const { loading, error, users } = useUsersDataLoader();
  const [activeTab, setActiveTab] = useState("users");
  
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur de chargement</AlertTitle>
              <AlertDescription>
                Impossible de charger les données utilisateurs. Veuillez réessayer ultérieurement.
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
