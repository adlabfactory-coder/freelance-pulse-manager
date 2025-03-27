
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Création d'une seule instance du client Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cvgwwdwnfmnkiyxqfmnn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3d3ZHduZm1ua2l5eHFmbW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODc5MDIsImV4cCI6MjA1ODQ2MzkwMn0.ItnJf48Z5NT7Gj-GcraxmPcUx2bKa7lzJZBahrwkq8A';

// Création du client Supabase
export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    headers: {
      'x-adlabhub-client': 'web-app'
    }
  }
});

// Validation de la configuration
export const validateSupabaseConfig = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Configuration Supabase incomplète. Veuillez vérifier vos variables d\'environnement.');
    return false;
  }
  return true;
};

// Vérifier la connexion au serveur Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    if (error) {
      console.error('Erreur de connexion à Supabase:', error);
      return false;
    }
    console.log('Connexion à Supabase établie avec succès.');
    return true;
  } catch (err) {
    console.error('Erreur lors de la vérification de la connexion à Supabase:', err);
    return false;
  }
};

// Exporter une instance par défaut
export default supabase;
