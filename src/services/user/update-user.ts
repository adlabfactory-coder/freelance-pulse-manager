
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';

/**
 * Met à jour les informations d'un utilisateur
 */
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
