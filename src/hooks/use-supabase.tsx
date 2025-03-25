
import { useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { fetchUsers, fetchUserById, updateUser } from '@/services/supabase-user-service';
import { checkSupabaseStatus, checkDatabaseStatus, initializeDatabase } from '@/services/supabase-database-service';

// Import the centralized supabase client
import { supabase as supabaseClient } from '@/integrations/supabase/client';

export const useSupabase = () => {
  return {
    supabaseClient,
    fetchUsers,
    fetchUserById,
    updateUser,
    checkSupabaseStatus,
    checkDatabaseStatus,
    initializeDatabase
  };
};
