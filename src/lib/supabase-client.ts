
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Configuration explicite des paramètres Supabase
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || "https://cvgwwdwnfmnkiyxqfmnn.supabase.co";
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3d3ZHduZm1ua2l5eHFmbW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODc5MDIsImV4cCI6MjA1ODQ2MzkwMn0.ItnJf48Z5NT7Gj-GcraxmPcUx2bKa7lzJZBahrwkq8A";

// Création du client Supabase avec options améliorées
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage
    },
    global: {
      headers: {
        'X-AdLabHub-Client': 'web-app'
      }
    }
  }
);

// Fonction utilitaire pour vérifier la validité de la configuration
export const validateSupabaseConfig = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Vérification de la connexion
export const checkSupabaseConnection = async (): Promise<{success: boolean, message: string}> => {
  try {
    // Tenter une opération simple pour vérifier la connexion
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Erreur de connexion à Supabase (auth):', authError.message);
      return { 
        success: false, 
        message: 'Erreur de connexion à Supabase: ' + authError.message
      };
    }
    
    return { success: true, message: 'Connexion à Supabase réussie' };
  } catch (error: any) {
    console.error('Erreur générale de connexion à Supabase:', error);
    return { 
      success: false, 
      message: 'Erreur de connexion à Supabase: ' + (error.message || 'Erreur inconnue')
    };
  }
};

// Exporter une instance par défaut
export default supabase;
