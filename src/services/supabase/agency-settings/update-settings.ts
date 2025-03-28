
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { AgencySettings, AgencySettingsResponse } from './types';

export const updateAgencySettings = async (
  supabase: SupabaseClient<Database>,
  settings: AgencySettings,
  userRole: string
): Promise<AgencySettingsResponse> => {
  try {
    // Vérifier si l'utilisateur a les droits d'administration
    if (!['admin', 'super_admin'].includes(userRole)) {
      return {
        success: false,
        error: "Vous n'avez pas les droits nécessaires pour modifier les paramètres de l'agence"
      };
    }

    const { data, error } = await supabase
      .from('agency_settings')
      .upsert({
        ...settings,
        updated_at: new Date()
      })
      .select('*')
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour des paramètres de l\'agence:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: data as AgencySettings
    };
  } catch (error: any) {
    console.error('Exception lors de la mise à jour des paramètres de l\'agence:', error);
    return {
      success: false,
      error: error.message || "Une erreur s'est produite"
    };
  }
};
