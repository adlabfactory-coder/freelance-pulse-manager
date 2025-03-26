
import { supabase } from '@/integrations/supabase/client';
import { DatabaseConnectionStatus } from './types';

/**
 * Vérifie la connexion à Supabase et renvoie le statut
 */
export const checkSupabaseConnection = async (): Promise<DatabaseConnectionStatus> => {
  try {
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
      // Utiliser une requête RPC qui devrait toujours fonctionner pour vérifier la connexion
      const { error: functionError } = await supabase.rpc('version');
      
      if (functionError) {
        console.warn('Erreur lors de la vérification des fonctions:', functionError.message);
        return { 
          success: false, 
          message: 'Accès limité à la base de données. Certaines fonctionnalités peuvent ne pas être disponibles.',
          partialConnection: true
        };
      }
    } catch (functionCheckError) {
      console.warn('Erreur lors de la vérification des fonctions:', functionCheckError);
      // On ne fait pas échouer complètement la vérification si seules les fonctions sont inaccessibles
      return { 
        success: true, 
        message: 'Connexion établie, mais avec des fonctionnalités limitées',
        partialConnection: true
      };
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
