
import { useContext } from 'react';
import { SupabaseContext } from '@/App';
import { toast } from '@/components/ui/use-toast';
import { User, UserRole } from '@/types';

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
      // Vérification de l'état de la connexion Supabase avant d'effectuer la requête
      const connectionCheck = await supabase.from('users').select('count');
      if (connectionCheck.error) {
        throw new Error("Erreur de connexion à Supabase: " + connectionCheck.error.message);
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      return data.map(user => ({
        ...user,
        role: user.role as UserRole
      })) as User[];
    } catch (error: any) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      // Propager l'erreur pour permettre une gestion locale
      throw new Error(error.message || "Erreur lors de la récupération des utilisateurs");
    }
  };
  
  const fetchUserById = async (userId: string) => {
    try {
      // Gestion spéciale pour les utilisateurs de démonstration
      if (userId === "1") {
        return {
          id: "1",
          name: "Utilisateur Démo",
          email: "demo@example.com",
          role: UserRole.ADMIN,
          calendly_url: "https://calendly.com/demo",
          calendly_enabled: true,
          calendly_sync_email: "demo@example.com"
        } as User;
      }
      if (userId === "2") {
        return {
          id: "2",
          name: "Commercial Démo",
          email: "commercial@example.com",
          role: UserRole.FREELANCER,
          calendly_url: "https://calendly.com/commercial-demo",
          calendly_enabled: true,
          calendly_sync_email: "commercial@example.com"
        } as User;
      }
      if (userId === "3") {
        return {
          id: "3",
          name: "Client Démo",
          email: "client@example.com",
          role: UserRole.CLIENT,
          calendly_url: "",
          calendly_enabled: false,
          calendly_sync_email: ""
        } as User;
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        role: data.role as UserRole
      } as User;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      // Ne pas lancer d'erreur ici, retourner null pour permettre le fallback aux données de démo
      return null;
    }
  };
  
  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      // Pour les utilisateurs de démo, simuler une mise à jour réussie
      if (userId === "1" || userId === "2" || userId === "3") {
        return true;
      }
      
      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId);
      
      if (error) throw error;
      
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
  
  return {
    ...supabase,
    fetchUsers,
    fetchUserById,
    updateUser
  };
};
