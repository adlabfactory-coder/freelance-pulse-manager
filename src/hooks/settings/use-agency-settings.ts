
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { AgencySettings } from '@/services/supabase/agency-settings';
import { useAuth } from '@/hooks/use-auth';

export const useAgencySettings = () => {
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const { role } = useAuth();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agency_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération des paramètres de l\'agence:', error);
        // Si aucun enregistrement n'est trouvé, initialiser avec des valeurs par défaut
        if (error.code === 'PGRST116') {
          const defaultSettings: AgencySettings = {
            name: 'AdLab Factory',
            rc: '',
            if_number: '',
            capital: '',
            rib: '',
            bank_name: ''
          };
          setSettings(defaultSettings);
        }
      } else {
        setSettings(data as AgencySettings);
      }
    } catch (error) {
      console.error('Exception lors de la récupération des paramètres de l\'agence:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: AgencySettings): Promise<boolean> => {
    if (!role || !['admin', 'super_admin'].includes(role)) {
      toast.error("Vous n'avez pas les droits nécessaires pour cette action");
      return false;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('agency_settings')
        .upsert({
          ...newSettings,
          updated_at: new Date()
        })
        .select('*')
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour des paramètres:', error);
        toast.error("Erreur lors de l'enregistrement des paramètres");
        return false;
      }

      setSettings(data as AgencySettings);
      toast.success("Paramètres de l'agence mis à jour avec succès");
      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour des paramètres:', error);
      toast.error("Erreur lors de l'enregistrement des paramètres");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    saving,
    updateSettings,
    refreshSettings: fetchSettings
  };
};

export default useAgencySettings;
