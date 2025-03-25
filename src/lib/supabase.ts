
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = 'https://kdvyhirsdauyqvsiqjgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdnloaXJzZGF1eXF2c2lxamd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NjE3MDQsImV4cCI6MjA1ODQzNzcwNH0.ZtWMPQ64TbMMTQbPEYsmV_R2POsSkyRJ3M6lTBsl60w';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Fonction simplifiée pour vérifier l'état de la connexion Supabase
export const checkSupabaseConnection = async () => {
  try {
    // Test de connexion simple, sans vérifier une table spécifique
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erreur de connexion à Supabase:', error.message);
      return { success: false, message: 'Erreur de connexion à Supabase: ' + error.message };
    }
    
    return { success: true, message: 'Connexion à Supabase réussie' };
  } catch (error: any) {
    console.error('Erreur de connexion à Supabase:', error);
    return { success: false, message: 'Erreur de connexion à Supabase: ' + (error.message || 'Erreur inconnue') };
  }
};
