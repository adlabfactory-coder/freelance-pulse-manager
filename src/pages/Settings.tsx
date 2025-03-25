
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { TabsContent } from "@/components/ui/tabs";
import { UserRole, User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import UserProfile from "@/components/settings/UserProfile";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import UsersManagement from "@/components/settings/UsersManagement";
import CompanySettings from "@/components/settings/CompanySettings";
import CommissionSettings from "@/components/settings/CommissionSettings";

const Settings: React.FC = () => {
  const supabase = useSupabase();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all users
        const usersData = await supabase.fetchUsers();
        if (usersData.length > 0) {
          // Use the first user as current user for demo purposes
          const user = usersData[0];
          setCurrentUser(user);
          setSelectedUserId(user.id);
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les informations utilisateur.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setActiveTab("profile");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des paramètres...</div>;
  }

  if (!currentUser) {
    return <div className="text-center py-8">Impossible de charger les paramètres</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les paramètres de votre compte et de l'application
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <SettingsSidebar 
            currentUser={currentUser}
            users={users}
            selectedUserId={selectedUserId || currentUser.id}
            activeTab={activeTab}
            isLoading={isLoading}
            onUserSelect={handleUserSelect}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="md:col-span-3">
          <TabsContent value="profile" className="mt-0">
            {selectedUserId && (
              <UserProfile 
                userId={selectedUserId} 
                currentUser={currentUser} 
              />
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            <UsersManagement onSelectUser={handleUserSelect} />
          </TabsContent>

          <TabsContent value="company" className="mt-0">
            <CompanySettings />
          </TabsContent>

          <TabsContent value="commissions" className="mt-0">
            <CommissionSettings />
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default Settings;
