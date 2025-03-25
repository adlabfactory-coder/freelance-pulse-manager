
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { UserRole, User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import SettingsHeader from "./components/SettingsHeader";
import SettingsLoading from "./components/SettingsLoading";
import SettingsError from "./components/SettingsError";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import UserProfile from "@/components/settings/UserProfile";
import UsersManagement from "@/components/settings/UsersManagement";
import CompanySettings from "@/components/settings/CompanySettings";
import CommissionSettings from "@/components/settings/CommissionSettings";

const SettingsPage: React.FC = () => {
  const supabase = useSupabase();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [hasError, setHasError] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      let usersData: User[] = [];
      
      try {
        // On récupère les données des utilisateurs, et on gère les erreurs potentielles
        usersData = await supabase.fetchUsers();
        console.log("Utilisateurs récupérés:", usersData);
        
        if (usersData.length === 0) {
          throw new Error("Aucun utilisateur trouvé");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        // Pas de setHasError ici - on laisse le code continuer avec les données de démo
      }
      
      // Si nous avons des utilisateurs, on initialise les états
      if (usersData.length > 0) {
        const user = usersData[0];
        setCurrentUser(user);
        setSelectedUserId(user.id);
        setUsers(usersData);
      } else {
        // Si nous n'avons toujours pas d'utilisateurs, c'est une erreur
        setHasError(true);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les informations utilisateur.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setHasError(true);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les informations utilisateur.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Assure que la page charge même en cas d'erreur avec Supabase
    const loadData = async () => {
      try {
        await fetchData();
      } catch (e) {
        console.error("Erreur fatale lors du chargement des données:", e);
        setIsLoading(false);
        setHasError(true);
      }
    };
    
    loadData();
  }, []);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setActiveTab("profile");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleRetry = () => {
    fetchData();
  };

  if (isLoading) {
    return <SettingsLoading />;
  }

  if (hasError || !currentUser) {
    return (
      <SettingsError 
        title={!currentUser ? "Aucun utilisateur trouvé" : "Impossible de charger les paramètres"}
        description="Veuillez vérifier votre configuration Supabase ou réessayer ultérieurement."
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SettingsHeader />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
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
      </Tabs>
    </div>
  );
};

export default SettingsPage;
