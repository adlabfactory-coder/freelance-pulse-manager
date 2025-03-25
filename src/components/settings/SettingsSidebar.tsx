
import React from "react";
import { UserRole, User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsSidebarProps {
  currentUser: User;
  users: User[];
  selectedUserId: string;
  activeTab: string;
  isLoading: boolean;
  onUserSelect: (userId: string) => void;
  onTabChange: (tab: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  currentUser,
  users,
  selectedUserId,
  activeTab,
  isLoading,
  onUserSelect,
  onTabChange,
}) => {
  const isAdmin = currentUser.role === UserRole.ADMIN;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>
            {isAdmin 
              ? "Sélectionnez un utilisateur pour voir ou modifier son profil" 
              : "Gérer votre profil utilisateur"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAdmin ? (
            <Select 
              value={selectedUserId} 
              onValueChange={onUserSelect}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un utilisateur" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.role === UserRole.ADMIN ? "Admin" : user.role === UserRole.FREELANCER ? "Commercial" : "Client"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>Vous visualisez votre profil personnel</p>
          )}
        </CardContent>
      </Card>
      
      <TabsList className="flex flex-col w-full h-auto">
        <TabsTrigger value="profile" className="justify-start">Profil</TabsTrigger>
        <TabsTrigger value="users" className="justify-start">Utilisateurs</TabsTrigger>
        <TabsTrigger value="company" className="justify-start">Entreprise</TabsTrigger>
        <TabsTrigger value="commissions" className="justify-start">Commissions</TabsTrigger>
      </TabsList>
    </div>
  );
};

export default SettingsSidebar;
