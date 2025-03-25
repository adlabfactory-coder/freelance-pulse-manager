
import { supabase } from './supabase-client';

// Function to create SQL functions in Supabase
export const createDatabaseFunctions = async () => {
  try {
    // Create the check_table_exists function that will be used by the frontend
    const { error: functionError } = await supabase.rpc('create_check_table_exists_function');
    
    if (functionError) {
      console.error('Erreur lors de la création de la fonction check_table_exists:', functionError);
      return { success: false, message: 'Erreur lors de la création des fonctions SQL' };
    }
    
    // Create functions for table creation
    const tableFunctions = [
      'create_create_contacts_table_function',
      'create_create_appointments_table_function',
      'create_create_quotes_table_function',
      'create_create_quote_items_table_function',
      'create_create_subscriptions_table_function',
      'create_create_commissions_table_function',
      'create_create_commission_rules_table_function'
    ];
    
    for (const funcName of tableFunctions) {
      const { error } = await supabase.rpc(funcName);
      if (error) {
        console.error(`Erreur lors de la création de la fonction ${funcName}:`, error);
      }
    }
    
    return { success: true, message: 'Fonctions SQL créées avec succès' };
  } catch (error: any) {
    console.error('Erreur lors de la création des fonctions SQL:', error);
    return { success: false, message: 'Erreur lors de la création des fonctions SQL' };
  }
};
