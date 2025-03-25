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
import DatabaseTab from "@/components/settings/DatabaseTab";
import { checkDatabaseSetup } from "@/lib/supabase-setup";

const SettingsPage: React.FC = () => {
  const supabase = useSupabase();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{title: string, description: string}>({
    title: "Impossible de charger les paramètres",
    description: "Veuillez vérifier votre configuration Supabase ou réessayer ultérieurement."
  });
  const [dbStatus, setDbStatus] = useState<{
    success: boolean;
    missingTables?: string[];
    message?: string;
  } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      const supabaseStatus = await supabase.checkSupabaseStatus();
      
      if (!supabaseStatus.success) {
        console.warn("Problème de connexion à Supabase:", supabaseStatus.message);
        
        const dbSetupStatus = await checkDatabaseSetup();
        setDbStatus(dbSetupStatus);
        
        if (!dbSetupStatus.success && dbSetupStatus.missingTables && dbSetupStatus.missingTables.length > 0) {
          console.warn("Tables manquantes dans la base de données:", dbSetupStatus.missingTables);
          setErrorDetails({
            title: "Base de données non configurée",
            description: `Les tables nécessaires n'existent pas: ${dbSetupStatus.missingTables.join(', ')}`
          });
          setHasError(true);
          setIsLoading(false);
          return;
        }
        
        toast({
          variant: "default",
          title: "Mode démo activé",
          description: "Utilisation des données de démonstration car Supabase n'est pas accessible.",
        });
      }
      
      let usersData: User[] = [];
      
      try {
        usersData = await supabase.fetchUsers();
        console.log("Utilisateurs récupérés:", usersData);
        
        if (usersData.length === 0) {
          throw new Error("Aucun utilisateur trouvé");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
      
      if (usersData.length > 0) {
        const user = usersData[0];
        setCurrentUser(user);
        setSelectedUserId(user.id);
        setUsers(usersData);
      } else {
        setHasError(true);
        setErrorDetails({
          title: "Aucun utilisateur trouvé",
          description: "Impossible de récupérer les données utilisateurs, même en mode démo."
        });
        toast({
          variant: "destructive",
          title: "Erreur critique",
          description: "Impossible de récupérer les informations utilisateur, même en mode démo.",
        });
      }
    } catch (error) {
      console.error("Erreur fatale lors de la récupération des données:", error);
      setHasError(true);
      setErrorDetails({
        title: "Erreur système",
        description: "Une erreur système est survenue lors du chargement des paramètres."
      });
      toast({
        variant: "destructive",
        title: "Erreur système",
        description: "Impossible de récupérer les informations utilisateur.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchData();
      } catch (e) {
        console.error("Erreur fatale lors du chargement des données:", e);
        setIsLoading(false);
        setHasError(true);
        setErrorDetails({
          title: "Erreur inattendue",
          description: "Une erreur inattendue est survenue lors du chargement des données."
        });
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
        title={!currentUser ? "Aucun utilisateur trouvé" : errorDetails.title}
        description={errorDetails.description}
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
              <UsersManagement onSelectUser={(userId) => handleUserSelect(userId)} />
            </TabsContent>

            <TabsContent value="company" className="mt-0">
              <CompanySettings />
            </TabsContent>

            <TabsContent value="commissions" className="mt-0">
              <CommissionSettings />
            </TabsContent>
            
            <TabsContent value="database" className="mt-0">
              <DatabaseTab />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
