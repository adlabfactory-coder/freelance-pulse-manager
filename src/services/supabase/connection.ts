
import { supabase } from '@/integrations/supabase/client';
import { DatabaseConnectionStatus } from './types';

/**
 * Vérifie la connexion à Supabase et renvoie le statut
 */
export const checkSupabaseConnection = async (): Promise<DatabaseConnectionStatus> => {
  try {
    console.log("Vérification de la connexion à Supabase...");
    
    // Vérifier la configuration
    const supabaseUrl = "https://cvgwwdwnfmnkiyxqfmnn.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3d3ZHduZm1ua2l5eHFmbW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODc5MDIsImV4cCI6MjA1ODQ2MzkwMn0.ItnJf48Z5NT7Gj-GcraxmPcUx2bKa7lzJZBahrwkq8A";
    
    console.log("Configuration vérifiée, tentative de connexion...");
    
    // Vérifier la connexion avec un appel simple qui ne dépend pas d'une table spécifique
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Erreur de connexion à Supabase (auth):', authError.message);
      return { 
        success: false, 
        message: 'Erreur de connexion à Supabase: ' + authError.message,
        networkError: true 
      };
    }
    
    // Essayons également de vérifier l'accès aux tables
    try {
      // Utiliser une simple requête sur une table pour vérifier l'accès
      const { error: tableError } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      if (tableError) {
        console.warn('Erreur lors de la vérification des tables:', tableError.message);
        return { 
          success: false, 
          message: 'Accès limité à la base de données. Certaines fonctionnalités peuvent ne pas être disponibles.',
          partialConnection: true
        };
      }
    } catch (tableCheckError) {
      console.warn('Erreur lors de la vérification des tables:', tableCheckError);
      // On ne fait pas échouer complètement la vérification si seules les tables sont inaccessibles
      return { 
        success: true, 
        message: 'Connexion établie, mais avec des fonctionnalités limitées',
        partialConnection: true
      };
    }
    
    console.log("Connexion à Supabase établie avec succès");
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

/**
 * Version simplifiée pour les vérifications rapides sans message détaillé
 */
export const isSupabaseConnected = async (): Promise<boolean> => {
  try {
    const { success } = await checkSupabaseConnection();
    return success;
  } catch (error) {
    console.error('Erreur lors de la vérification de la connexion Supabase:', error);
    return false;
  }
};
