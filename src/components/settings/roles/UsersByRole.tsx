
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";
import { USER_ROLE_LABELS } from "@/types/roles";
import { fetchUsers } from "@/services/user/fetch-users";
import UserAvatar from "@/components/settings/UserAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UsersByRoleProps {
  activeTab?: UserRole;
  onTabChange?: (tab: UserRole) => void;
}

const UsersByRole: React.FC<UsersByRoleProps> = ({ 
  activeTab = UserRole.ADMIN, 
  onTabChange 
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Charge les utilisateurs au chargement du composant
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const allUsers = await fetchUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  // Filtrer les utilisateurs par rôle
  const adminUsers = users.filter(u => u.role === UserRole.ADMIN);
  const superAdminUsers = users.filter(u => u.role === UserRole.SUPER_ADMIN);
  const accountManagerUsers = users.filter(u => u.role === UserRole.ACCOUNT_MANAGER);
  const freelancerUsers = users.filter(u => u.role === UserRole.FREELANCER);
  
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value as UserRole);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilisateurs par rôle</CardTitle>
        <CardDescription>
          Vue d'ensemble des utilisateurs regroupés par leur rôle dans le système
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={handleTabChange}
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value={UserRole.ADMIN}>
              Admins ({adminUsers.length})
            </TabsTrigger>
            <TabsTrigger value={UserRole.SUPER_ADMIN}>
              Super Admins ({superAdminUsers.length})
            </TabsTrigger>
            <TabsTrigger value={UserRole.ACCOUNT_MANAGER}>
              Chargés de compte ({accountManagerUsers.length})
            </TabsTrigger>
            <TabsTrigger value={UserRole.FREELANCER}>
              Freelances ({freelancerUsers.length})
            </TabsTrigger>
          </TabsList>
          
          {/* Contenu pour les admins */}
          <TabsContent value={UserRole.ADMIN}>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {adminUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground">Aucun administrateur trouvé</p>
                ) : (
                  adminUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <UserAvatar name={user.name} avatarUrl={user.avatar || undefined} />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {USER_ROLE_LABELS[UserRole.ADMIN]}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Contenu pour les super admins */}
          <TabsContent value={UserRole.SUPER_ADMIN}>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {superAdminUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground">Aucun super administrateur trouvé</p>
                ) : (
                  superAdminUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <UserAvatar name={user.name} avatarUrl={user.avatar || undefined} />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {USER_ROLE_LABELS[UserRole.SUPER_ADMIN]}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Contenu pour les autres rôles - similaire aux précédents */}
          <TabsContent value={UserRole.ACCOUNT_MANAGER}>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {accountManagerUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground">Aucun chargé de compte trouvé</p>
                ) : (
                  accountManagerUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <UserAvatar name={user.name} avatarUrl={user.avatar || undefined} />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {USER_ROLE_LABELS[UserRole.ACCOUNT_MANAGER]}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value={UserRole.FREELANCER}>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {freelancerUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground">Aucun freelance trouvé</p>
                ) : (
                  freelancerUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <UserAvatar name={user.name} avatarUrl={user.avatar || undefined} />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {USER_ROLE_LABELS[UserRole.FREELANCER]}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UsersByRole;
