
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { checkDatabaseSetup } from "@/lib/supabase";

export const useSettingsData = () => {
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

  return {
    currentUser,
    users,
    selectedUserId,
    isLoading,
    activeTab,
    hasError,
    errorDetails,
    dbStatus,
    handleUserSelect,
    handleTabChange,
    handleRetry
  };
};
