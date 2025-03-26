
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';

/**
 * Crée un nouvel utilisateur
 */
export const createUser = async (userData: Omit<User, 'id'>, currentUserRole: UserRole): Promise<{success: boolean, error?: string, userId?: string}> => {
  // Vérifier que seuls les admin et superadmin peuvent créer des utilisateurs
  if (currentUserRole !== UserRole.ADMIN && currentUserRole !== UserRole.SUPER_ADMIN) {
    return { 
      success: false, 
      error: "Vous n'avez pas les droits pour créer un utilisateur" 
    };
  }
  
  // Pour les utilisateurs de démo, simuler une création réussie
  if (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SUPER_ADMIN) {
    try {
      // Simuler la création d'un utilisateur avec un UUID aléatoire
      const mockUserId = crypto.randomUUID();
      
      toast({
        title: "Succès",
        description: "L'utilisateur a été créé avec succès.",
      });
      
      return { 
        success: true,
        userId: mockUserId
      };
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer l'utilisateur.",
      });
      
      return {
        success: false,
        error: "Erreur technique lors de la création de l'utilisateur"
      };
    }
  }
  
  // Si on arrive ici, c'est qu'il y a un problème de droits
  return {
    success: false,
    error: "Vous n'avez pas les autorisations nécessaires"
  };
};
