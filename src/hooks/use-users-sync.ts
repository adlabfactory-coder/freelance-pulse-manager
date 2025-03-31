
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

interface UserSyncStatus {
  email: string;
  inUsers: boolean;
  inAuth: boolean;
  synced: boolean;
  error?: string;
}

export function useUsersSync() {
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<UserSyncStatus[]>([]);
  const [summary, setSummary] = useState({ total: 0, synced: 0, notSynced: 0 });
  
  const checkSyncStatus = useCallback(async () => {
    setLoading(true);
    
    try {
      // Récupérer les utilisateurs de la table users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email');
      
      if (usersError) {
        throw new Error(`Erreur lors de la récupération des utilisateurs: ${usersError.message}`);
      }
      
      const statuses: UserSyncStatus[] = [];
      let synced = 0;
      let notSynced = 0;
      
      // Vérifier chaque utilisateur
      for (const user of usersData) {
        try {
          // Vérifier si l'utilisateur existe dans auth.users
          const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(user.id);
          
          // Correction: S'assurer que isInAuth est un boolean
          const isInAuth = !authError && authUser?.user !== undefined;
          const isSynced = isInAuth;
          
          statuses.push({
            email: user.email,
            inUsers: true,
            inAuth: isInAuth,
            synced: isSynced,
            error: authError?.message
          });
          
          if (isSynced) synced++;
          else notSynced++;
        } catch (err: any) {
          statuses.push({
            email: user.email,
            inUsers: true,
            inAuth: false,
            synced: false,
            error: err.message
          });
          notSynced++;
        }
      }
      
      setSyncStatus(statuses);
      setSummary({
        total: usersData.length,
        synced,
        notSynced
      });
      
    } catch (error: any) {
      console.error("Erreur lors de la vérification de synchronisation:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    checkSyncStatus();
  }, [checkSyncStatus]);
  
  return {
    loading,
    syncStatus,
    summary,
    refreshStatus: checkSyncStatus
  };
}
