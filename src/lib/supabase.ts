
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = 'https://kdvyhirsdauyqvsiqjgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdnloaXJzZGF1eXF2c2lxamd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NjE3MDQsImV4cCI6MjA1ODQzNzcwNH0.ZtWMPQ64TbMMTQbPEYsmV_R2POsSkyRJ3M6lTBsl60w';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Fonction pour vérifier l'état de la connexion Supabase de manière robuste
export const checkSupabaseConnection = async () => {
  try {
    // On essaie d'abord une opération simple qui ne dépend pas d'une table spécifique
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Erreur de connexion à Supabase (auth):', authError.message);
      return { success: false, message: 'Erreur de connexion à Supabase: ' + authError.message };
    }
    
    // On vérifie également que les tables sont accessibles en essayant d'accéder à une table courante
    try {
      const { error: tableError } = await supabase.from('contacts').select('id').limit(1);
      
      if (tableError && tableError.code === '42P01') { // Code pour "relation does not exist"
        console.warn('Table contacts non trouvée:', tableError.message);
        return { 
          success: false, 
          message: 'Base de données non configurée correctement. Tables non trouvées.',
          needsSetup: true 
        };
      } else if (tableError) {
        console.warn('Erreur lors de l\'accès aux tables:', tableError.message);
        return { success: false, message: 'Erreur d\'accès aux données: ' + tableError.message };
      }
    } catch (tableCheckError) {
      console.warn('Erreur lors de la vérification des tables:', tableCheckError);
      // On ne fait pas échouer la vérification complète si seulement les tables sont inaccessibles
    }
    
    return { success: true, message: 'Connexion à Supabase réussie' };
  } catch (error: any) {
    console.error('Erreur générale de connexion à Supabase:', error);
    return { 
      success: false, 
      message: 'Erreur de connexion à Supabase: ' + (error.message || 'Erreur inconnue'),
      networkError: true
    };
  }
};

// Fonction pour vérifier si la base de données est correctement configurée
export const checkDatabaseSetup = async () => {
  try {
    const tables = ['users', 'contacts', 'appointments', 'quotes', 'subscriptions', 'commissions'];
    const results = await Promise.all(
      tables.map(async (table) => {
        const { error } = await supabase.from(table).select('id').limit(1);
        return { table, exists: !error || error.code !== '42P01' };
      })
    );
    
    const missingTables = results.filter(r => !r.exists).map(r => r.table);
    
    return {
      success: missingTables.length === 0,
      missingTables,
      message: missingTables.length > 0 
        ? `Tables manquantes: ${missingTables.join(', ')}` 
        : 'Toutes les tables sont correctement configurées'
    };
  } catch (error: any) {
    console.error('Erreur lors de la vérification de la configuration de la base de données:', error);
    return {
      success: false,
      message: 'Impossible de vérifier la configuration de la base de données: ' + (error.message || 'Erreur inconnue')
    };
  }
};
