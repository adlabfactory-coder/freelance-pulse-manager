
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { AgencySettings } from './types';

export const fetchAgencySettings = async (
  supabase: SupabaseClient<Database>
): Promise<AgencySettings | null> => {
  try {
    const { data, error } = await supabase
      .from('agency_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des paramètres de l\'agence:', error);
      return null;
    }

    return data as AgencySettings;
  } catch (error) {
    console.error('Exception lors de la récupération des paramètres de l\'agence:', error);
    return null;
  }
};
