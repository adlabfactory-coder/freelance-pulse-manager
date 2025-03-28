
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { fetchAgencySettings } from './fetch-settings';
import { updateAgencySettings } from './update-settings';
import { AgencySettings, AgencySettingsResponse } from './types';

export const createAgencySettingsService = (supabase: SupabaseClient<Database>) => {
  return {
    fetchAgencySettings: () => fetchAgencySettings(supabase),
    updateAgencySettings: (settings: AgencySettings, userRole: string) => 
      updateAgencySettings(supabase, settings, userRole)
  };
};

export type { AgencySettings, AgencySettingsResponse };
