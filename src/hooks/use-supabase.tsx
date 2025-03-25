
import { useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { fetchUsers, fetchUserById, updateUser } from '@/services/supabase-user-service';
import { checkSupabaseStatus, checkDatabaseStatus, initializeDatabase } from '@/services/supabase-database-service';

// Create a fallback client to be used when context isn't available
const supabaseUrl = 'https://cvgwwdwnfmnkiyxqfmnn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3d3ZHduZm1ua2l5eHFmbW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODc5MDIsImV4cCI6MjA1ODQ2MzkwMn0.ItnJf48Z5NT7Gj-GcraxmPcUx2bKa7lzJZBahrwkq8A';
const fallbackClient = createClient(supabaseUrl, supabaseAnonKey);

export const useSupabase = () => {
  // Since we don't have a SupabaseContext in App.tsx, we'll use the fallback client
  const supabaseClient = fallbackClient;
  
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
