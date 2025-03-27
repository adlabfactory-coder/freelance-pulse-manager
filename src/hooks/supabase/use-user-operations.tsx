
import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useUserOperations = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async (): Promise<User[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des utilisateurs.",
          variant: "destructive"
        });
        return [];
      }

      return data as User[];
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération des utilisateurs:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des utilisateurs.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserById = async (id: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations de l'utilisateur.",
          variant: "destructive"
        });
        return null;
      }

      return data as User;
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération de l'utilisateur.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!userData.id) {
        console.error('No user ID provided for update');
        toast({
          title: "Erreur",
          description: "ID utilisateur manquant pour la mise à jour.",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userData.id);

      if (error) {
        console.error('Error updating user:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour les informations de l'utilisateur.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Utilisateur mis à jour",
        description: "Les informations de l'utilisateur ont été mises à jour avec succès.",
      });
      return true;
    } catch (error) {
      console.error("Erreur inattendue lors de la mise à jour de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'utilisateur.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, 'id'>): Promise<{ success: boolean; id?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer l'utilisateur.",
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Utilisateur créé",
        description: "L'utilisateur a été créé avec succès.",
      });
      return { success: true, id: data.id };
    } catch (error) {
      console.error("Erreur inattendue lors de la création de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'utilisateur.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      });
      return true;
    } catch (error) {
      console.error("Erreur inattendue lors de la suppression de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getMockUsers = (): User[] => {
    return [
      {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: UserRole.ADMIN,
        avatar: null,
        calendly_enabled: false
      },
      {
        id: "2",
        name: "Freelancer User",
        email: "freelancer@example.com",
        role: UserRole.FREELANCER,
        avatar: null,
        calendly_enabled: false
      }
    ];
  };

  return {
    isLoading,
    fetchUsers,
    fetchUserById,
    updateUser,
    createUser,
    deleteUser,
    getMockUsers
  };
};
