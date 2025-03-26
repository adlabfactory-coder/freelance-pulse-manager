
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UsersManagement from "@/components/settings/UsersManagement";
import FreelancerManagement from "@/components/settings/FreelancerManagement";
import RoleManagement from "@/components/settings/roles/RoleManagement";
import UsersByRole from "@/components/settings/roles/UsersByRole";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/components/ui/use-toast";

interface UsersManagementTabsProps {
  onSelectUser?: (userId: string) => void;
}

const UsersManagementTabs: React.FC<UsersManagementTabsProps> = ({ onSelectUser }) => {
  const [activeTab, setActiveTab] = useState("users-list");
  const { isAdminOrSuperAdmin, isSuperAdmin } = useAuth();
  
  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Vous n'avez pas les autorisations nécessaires pour accéder à cette section.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des utilisateurs</CardTitle>
        <CardDescription>
          Gérez les utilisateurs, les rôles, les permissions et les freelances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="users-list">Liste des utilisateurs</TabsTrigger>
            <TabsTrigger value="users-by-role">Utilisateurs par rôle</TabsTrigger>
            <TabsTrigger value="permissions">Permissions des rôles</TabsTrigger>
            <TabsTrigger value="freelancers">Freelances</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users-list">
            <UsersManagement onSelectUser={onSelectUser} />
          </TabsContent>
          
          <TabsContent value="users-by-role">
            <UsersByRole />
          </TabsContent>
          
          <TabsContent value="permissions">
            <RoleManagement />
          </TabsContent>
          
          <TabsContent value="freelancers">
            <FreelancerManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UsersManagementTabs;
