
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { getMockUsers, getMockUserById } from '@/utils/supabase-mock-data';
import { checkSupabaseConnection } from '@/lib/supabase';

export const fetchUsers = async (): Promise<User[]> => {
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

export const fetchUserById = async (userId: string): Promise<User | null> => {
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

export const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
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
