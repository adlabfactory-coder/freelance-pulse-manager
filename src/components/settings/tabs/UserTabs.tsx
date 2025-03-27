
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoTab from "./PersonalInfoTab";
import SecurityTab from "./SecurityTab";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import ApiKeysTab from "@/components/settings/api-keys/ApiKeysTab";
import { toast } from "@/components/ui/use-toast";
import { useSupabase } from "@/hooks/use-supabase";

// Interface for component props
interface UserProfileTabsProps {
  onSelectUser?: (userId: string) => void;
}

const UserProfileTabs: React.FC<UserProfileTabsProps> = ({ onSelectUser }) => {
  const [activeTab, setActiveTab] = useState("general");
  const { user, role, isAdminOrSuperAdmin } = useAuth();
  const supabase = useSupabase();
  
  // State for PersonalInfoTab
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [userRole, setUserRole] = useState<UserRole>(role as UserRole || UserRole.FREELANCER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Seuls les administrateurs et les utilisateurs avec des rôles spécifiques peuvent accéder à certains onglets
  const canAccessApiKeys = isAdminOrSuperAdmin || role === UserRole.ACCOUNT_MANAGER;
  
  // Fetch user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setUserRole(role as UserRole || UserRole.FREELANCER);
    }
  }, [user, role]);

  // Check Supabase connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const status = await supabase.checkSupabaseStatus();
        
        if (!status.success) {
          console.warn("Issue with Supabase connection:", status.message);
          setError("Problème de connexion avec la base de données");
        } else {
          setError(null);
        }
      } catch (err) {
        console.error("Error checking Supabase connection:", err);
        setError("Erreur lors de la vérification de la connexion");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnection();
  }, [supabase]);
  
  const handleSubmit = async () => {
    if (!user) return;
    
    // Les utilisateurs normaux ne peuvent pas changer leur rôle
    if (!isAdminOrSuperAdmin && userRole !== role) {
      toast({
        variant: "destructive",
        title: "Action non autorisée",
        description: "Seuls les administrateurs peuvent modifier les rôles utilisateurs.",
      });
      // Réinitialiser au rôle actuel
      setUserRole(role as UserRole || UserRole.FREELANCER);
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Try to update user data through Supabase
      const result = await supabase.updateUser({
        id: user.id,
        name,
        email,
        role: userRole
      });
      
      if (result.success) {
        toast({
          title: "Profil mis à jour",
          description: "Les informations ont été enregistrées avec succès.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour le profil.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <p className="font-medium">Erreur de connexion</p>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue="general"
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="general">Informations générales</TabsTrigger>
        <TabsTrigger value="security">Sécurité</TabsTrigger>
        {canAccessApiKeys && (
          <TabsTrigger value="api-keys">Clés API</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="general" className="space-y-4">
        <PersonalInfoTab 
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          role={userRole}
          setRole={setUserRole}
          canEdit={true}
          isCurrentUser={true}
          currentUserRole={role as UserRole || UserRole.FREELANCER}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          // Seuls les administrateurs peuvent modifier les rôles
          canEditRole={isAdminOrSuperAdmin}
        />
      </TabsContent>
      <TabsContent value="security" className="space-y-4">
        <SecurityTab isCurrentUser={true} />
      </TabsContent>
      {canAccessApiKeys && (
        <TabsContent value="api-keys" className="space-y-4">
          <ApiKeysTab />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default UserProfileTabs;
