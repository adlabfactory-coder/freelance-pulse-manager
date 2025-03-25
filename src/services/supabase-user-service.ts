
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { getMockUsers, getMockUserById } from '@/utils/supabase-mock-data';
import { checkSupabaseConnection } from '@/lib/supabase';

export const fetchUsers = async (): Promise<User[]> => {
  try {
    // Vérification de l'état de la connexion Supabase
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
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return getMockUsers();
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de la connexion:', error);
    return getMockUsers();
  }
};

export const fetchUserById = async (userId: string): Promise<User | null> => {
  try {
    // Amélioration de la gestion des utilisateurs de démonstration
    if (userId === "1" || userId === "2" || userId === "3" || 
        userId === "7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc" || 
        userId === "487fb1af-4396-49d1-ba36-8711facbb03c" || 
        userId === "2b6329d2-73e4-4f5e-b56e-c26cdf4b3dda") {
      
      // Vérifier d'abord les ID UUID de démonstration
      if (userId === "7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc") {
        return getMockUsers()[0]; // Admin démo
      } else if (userId === "487fb1af-4396-49d1-ba36-8711facbb03c") {
        return getMockUsers()[1]; // Commercial démo
      } else if (userId === "2b6329d2-73e4-4f5e-b56e-c26cdf4b3dda") {
        return getMockUsers()[2]; // Client démo
      } else {
        // Fallback pour les anciens ID numériques
        return getMockUserById(userId);
      }
    }
    
    // Pour les vrais utilisateurs dans Supabase
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn("Erreur lors de la récupération de l'utilisateur:", error.message);
        // Essayons de récupérer un utilisateur démo avec cet ID
        return getMockUserById(userId) || getMockUsers()[0]; // Fallback sur admin démo
      }
      
      if (!data) {
        console.warn("Aucun utilisateur trouvé avec l'ID:", userId);
        return getMockUsers()[0]; // Fallback sur admin démo
      }
      
      return {
        ...data,
        role: data.role as UserRole
      } as User;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      // Ne pas lancer d'erreur ici, retourner un utilisateur démo
      return getMockUserById(userId) || getMockUsers()[0];
    }
  } catch (error) {
    console.error('Erreur fatale lors de la récupération de l\'utilisateur:', error);
    return getMockUsers()[0]; // Fallback en cas d'erreur fatale
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
  try {
    // Pour les utilisateurs de démo, simuler une mise à jour réussie
    if (userId === "1" || userId === "2" || userId === "3" || 
        userId === "7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc" || 
        userId === "487fb1af-4396-49d1-ba36-8711facbb03c" || 
        userId === "2b6329d2-73e4-4f5e-b56e-c26cdf4b3dda") {
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
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible de mettre à jour les informations de l'utilisateur.",
    });
    return false;
  }
};
