
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
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      return data.map(user => ({
        ...user,
        role: user.role as UserRole
      })) as User[];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les utilisateurs.",
      });
      return [];
    }
  };
  
  const fetchUserById = async (userId: string) => {
    try {
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
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les informations de l'utilisateur.",
      });
      return null;
    }
  };
  
  return {
    ...supabase,
    fetchUsers,
    fetchUserById
  };
};
