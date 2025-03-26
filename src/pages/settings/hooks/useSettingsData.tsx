
import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { checkDatabaseSetup } from "@/lib/supabase";
import { getMockUsers } from "@/utils/supabase-mock-data";

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
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      console.log("Vérification du statut Supabase...");
      let useMockData = false;
      
      try {
        const supabaseStatus = await supabase.checkSupabaseStatus();
        
        if (!supabaseStatus.success) {
          console.warn("Problème de connexion à Supabase:", supabaseStatus.message);
          useMockData = true;
          
          // Vérifier la configuration de la base de données
          try {
            const dbSetupStatus = await checkDatabaseSetup();
            setDbStatus(dbSetupStatus);
            
            if (!dbSetupStatus.success && dbSetupStatus.missingTables && dbSetupStatus.missingTables.length > 0) {
              console.warn("Tables manquantes dans la base de données:", dbSetupStatus.missingTables);
            }
          } catch (dbError) {
            console.error("Erreur lors de la vérification de la base de données:", dbError);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut Supabase:", error);
        useMockData = true;
      }
      
      // Utiliser les données de démonstration si Supabase n'est pas accessible
      if (useMockData) {
        console.log("Utilisation des données de démonstration");
        const mockUsers = getMockUsers();
        setUsers(mockUsers);
        
        // Utiliser le premier utilisateur comme utilisateur actuel
        if (mockUsers.length > 0) {
          const user = mockUsers[0];
          setCurrentUser(user);
          setSelectedUserId(user.id);
        }
        
        toast({
          variant: "default",
          title: "Mode démo activé",
          description: "Utilisation des données de démonstration car Supabase n'est pas accessible.",
        });
      } else {
        // Essayer de récupérer les données depuis Supabase
        try {
          console.log("Récupération des utilisateurs...");
          const usersData = await supabase.fetchUsers();
          console.log("Utilisateurs récupérés:", usersData);
          
          if (usersData.length > 0) {
            const user = usersData[0];
            setCurrentUser(user);
            setSelectedUserId(user.id);
            setUsers(usersData);
          } else {
            throw new Error("Aucun utilisateur trouvé dans Supabase");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des utilisateurs:", error);
          
          // Utiliser les données de démonstration en cas d'erreur
          const mockUsers = getMockUsers();
          setUsers(mockUsers);
          
          if (mockUsers.length > 0) {
            const user = mockUsers[0];
            setCurrentUser(user);
            setSelectedUserId(user.id);
          }
          
          toast({
            variant: "default",
            title: "Mode démo activé",
            description: "Utilisation des données de démonstration suite à une erreur de connexion.",
          });
        }
      }
    } catch (error) {
      console.error("Erreur fatale lors de la récupération des données:", error);
      setHasError(true);
      setErrorDetails({
        title: "Erreur système",
        description: "Une erreur système est survenue lors du chargement des paramètres."
      });
      
      // Essayer quand même de charger les données de démonstration
      try {
        const mockUsers = getMockUsers();
        if (mockUsers.length > 0) {
          setCurrentUser(mockUsers[0]);
          setSelectedUserId(mockUsers[0].id);
          setUsers(mockUsers);
          setHasError(false);
        }
      } catch (e) {
        console.error("Impossible de charger les données de démo:", e);
      }
      
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Utilisateur chargé en mode hors ligne.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, retryCount]);

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
        
        // Essayer quand même de charger les données de démonstration
        try {
          const mockUsers = getMockUsers();
          if (mockUsers.length > 0) {
            setCurrentUser(mockUsers[0]);
            setSelectedUserId(mockUsers[0].id);
            setUsers(mockUsers);
            setHasError(false);
          }
        } catch (err) {
          console.error("Impossible de charger les données de démo:", err);
        }
      }
    };
    
    loadData();
  }, [fetchData]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setActiveTab("profile");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
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
