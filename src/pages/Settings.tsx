
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { UserRole, User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import UserProfile from "@/components/settings/UserProfile";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import UsersManagement from "@/components/settings/UsersManagement";
import CompanySettings from "@/components/settings/CompanySettings";
import CommissionSettings from "@/components/settings/CommissionSettings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const Settings: React.FC = () => {
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
        // Tenter de récupérer les utilisateurs depuis Supabase
        usersData = await supabase.fetchUsers();
        console.log("Utilisateurs récupérés:", usersData);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
      
      if (usersData.length > 0) {
        // Utiliser le premier utilisateur comme utilisateur actuel
        const user = usersData[0];
        setCurrentUser(user);
        setSelectedUserId(user.id);
        setUsers(usersData);
      } else {
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
    fetchData();
  }, [supabase]);

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
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground mt-1">
            Chargement des paramètres...
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p>Chargement des paramètres...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground mt-1">
            Une erreur est survenue
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Impossible de charger les paramètres</CardTitle>
            <CardDescription>
              Veuillez vérifier votre connexion à Supabase ou réessayer ultérieurement.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground mt-1">
            Impossible de charger les paramètres
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Aucun utilisateur trouvé</CardTitle>
            <CardDescription>
              Veuillez vérifier votre configuration Supabase ou réessayer ultérieurement.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les paramètres de votre compte et de l'application
        </p>
      </div>

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

export default Settings;
