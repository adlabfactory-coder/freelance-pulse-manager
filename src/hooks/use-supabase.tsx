
import { useContext } from 'react';
import { toast } from '@/components/ui/use-toast';
import { fetchUsers, fetchUserById, updateUser } from '@/services/supabase-user-service';
import { checkSupabaseStatus, checkDatabaseStatus, initializeDatabase } from '@/services/supabase-database-service';

// Import the centralized supabase client
import { supabase as supabaseClient } from '@/integrations/supabase/client';

export const useSupabase = () => {
  const checkSupabaseConnection = async () => {
    try {
      // Vérification simple de la connexion
      const { data, error } = await supabaseClient.from('adlab hub freelancer').select('count()', { count: 'exact', head: true });
      
      if (error) {
        console.warn('Erreur lors de la vérification de la connexion à Supabase:', error.message);
        return { success: false, message: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la vérification de la connexion à Supabase:', error);
      return { success: false, message: 'Impossible de se connecter à Supabase' };
    }
  };

  return {
    supabaseClient,
    fetchUsers,
    fetchUserById,
    updateUser,
    checkSupabaseStatus: checkSupabaseStatus || checkSupabaseConnection,
    checkDatabaseStatus,
    initializeDatabase
  };
};
