
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = 'https://kdvyhirsdauyqvsiqjgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdnloaXJzZGF1eXF2c2lxamd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzNTk3MDgsImV4cCI6MjAzMDkzNTcwOH0.jEmJkuN3_EFXHm_dFIrQYHWGQVuFpgKRvZfZJr59LRQ';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Ces fonctions servent à vérifier l'état de la connexion Supabase
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('contacts').select('id').limit(1);
    if (error) throw error;
    return { success: true, message: 'Connexion à Supabase réussie' };
  } catch (error) {
    console.error('Erreur de connexion à Supabase:', error);
    return { success: false, message: 'Erreur de connexion à Supabase' };
  }
};
