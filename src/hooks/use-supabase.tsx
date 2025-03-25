
import { useContext } from 'react';
import { SupabaseContext } from '@/App';
import { toast } from '@/components/ui/use-toast';
import { User, UserRole } from '@/types';
import { checkSupabaseConnection, checkDatabaseSetup, setupDatabase } from '@/lib/supabase';

export const useSupabase = () => {
  const supabase = useContext(SupabaseContext);
  
  if (!supabase) {
    const errorMessage = 'useSupabase doit être utilisé à l\'intérieur d\'un SupabaseContext.Provider';
    toast({
      variant: "destructive",
      title: "Erreur de configuration",
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }
  
  const fetchUsers = async () => {
    try {
      // Vérification de l'état de la connexion Supabase avec une gestion robuste des erreurs
      let shouldUseMockData = false;
      
      try {
        const connectionStatus = await checkSupabaseConnection();
        if (!connectionStatus.success) {
          console.warn("Erreur lors de la vérification de la connexion:", connectionStatus.message);
          shouldUseMockData = true;
        }
      } catch (error) {
        console.warn("Erreur lors de la vérification de la connexion:", error);
        shouldUseMockData = true;
      }
      
      // Utiliser des données de démo si la connexion a échoué
      if (shouldUseMockData) {
        console.info("Utilisation des données de démo pour les utilisateurs");
        return getMockUsers();
      }
      
      // La connexion est établie, on tente de récupérer les utilisateurs
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*');
        
        if (error) {
          // Si la table n'existe pas, on utilise les données de démo
          if (error.code === '42P01') {
            console.warn("Table 'users' non trouvée dans Supabase, utilisation des données de démo");
            return getMockUsers();
          }
          
          console.warn("Erreur lors de la récupération des utilisateurs:", error.message);
          return getMockUsers();
        }
        
        if (!data || data.length === 0) {
          console.warn("Aucun utilisateur trouvé dans Supabase, utilisation des données de démo");
          return getMockUsers();
        }
        
        return data.map(user => ({
          ...user,
          role: user.role as UserRole
        })) as User[];
      } catch (error: any) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        return getMockUsers();
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification de la connexion:', error);
      return getMockUsers();
    }
  };
  
  const fetchUserById = async (userId: string) => {
    try {
      // Gestion spéciale pour les utilisateurs de démonstration
      if (userId === "1" || userId === "2" || userId === "3") {
        return getMockUserById(userId);
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn("Erreur lors de la récupération de l'utilisateur:", error.message);
        // Essayons de récupérer un utilisateur démo avec cet ID
        return getMockUserById(userId) || getMockUserById("1"); // Fallback sur admin démo
      }
      
      if (!data) {
        console.warn("Aucun utilisateur trouvé avec l'ID:", userId);
        return getMockUserById("1"); // Fallback sur admin démo
      }
      
      return {
        ...data,
        role: data.role as UserRole
      } as User;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      // Ne pas lancer d'erreur ici, retourner un utilisateur démo
      return getMockUserById(userId) || getMockUserById("1");
    }
  };
  
  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      // Pour les utilisateurs de démo, simuler une mise à jour réussie
      if (userId === "1" || userId === "2" || userId === "3") {
        toast({
          title: "Succès",
          description: "Les informations de l'utilisateur ont été mises à jour.",
        });
        return true;
      }
      
      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId);
      
      if (error) {
        console.error("Erreur de mise à jour de l'utilisateur:", error.message);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour les informations de l'utilisateur.",
        });
        return false;
      }
      
      toast({
        title: "Succès",
        description: "Les informations de l'utilisateur ont été mises à jour.",
      });
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les informations de l'utilisateur.",
      });
      return false;
    }
  };
  
  // Fonctions utilitaires pour les données de démonstration
  const getMockUsers = (): User[] => {
    return [
      {
        id: "1",
        name: "Admin Démo",
        email: "admin@example.com",
        role: UserRole.ADMIN,
        calendly_url: "https://calendly.com/admin-demo",
        calendly_enabled: true,
        calendly_sync_email: "admin@example.com"
      },
      {
        id: "2",
        name: "Commercial Démo",
        email: "commercial@example.com",
        role: UserRole.FREELANCER,
        calendly_url: "https://calendly.com/commercial-demo",
        calendly_enabled: true,
        calendly_sync_email: "commercial@example.com"
      },
      {
        id: "3",
        name: "Client Démo",
        email: "client@example.com",
        role: UserRole.CLIENT,
        calendly_url: "",
        calendly_enabled: false,
        calendly_sync_email: ""
      }
    ];
  };
  
  const getMockUserById = (userId: string): User | null => {
    const mockUsers = getMockUsers();
    const foundUser = mockUsers.find(user => user.id === userId);
    return foundUser || null;
  };
  
  // Ajout d'une méthode pour vérifier l'état de la configuration Supabase
  const checkSupabaseStatus = async () => {
    const connectionStatus = await checkSupabaseConnection();
    return connectionStatus;
  };
  
  // Ajout d'une méthode pour vérifier la configuration de la base de données
  const checkDatabaseStatus = async () => {
    const dbStatus = await checkDatabaseSetup();
    return dbStatus;
  };
  
  // Ajout d'une méthode pour initialiser la base de données
  const initializeDatabase = async (options?: { onTableCreated?: (tableName: string) => void }) => {
    const setupResult = await setupDatabase(options);
    return setupResult;
  };
  
  return {
    ...supabase,
    fetchUsers,
    fetchUserById,
    updateUser,
    checkSupabaseStatus,
    checkDatabaseStatus,
    initializeDatabase
  };
};
