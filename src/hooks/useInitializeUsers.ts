
import { useState, useEffect } from 'react';
import { initializeTestUsers } from '@/utils/user-creation-helper';
import { toast } from 'sonner';

export const useInitializeUsers = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeUsers = async () => {
    if (isInitializing || isInitialized) return;
    
    try {
      setIsInitializing(true);
      setError(null);
      
      const result = await initializeTestUsers();
      
      if (result.success) {
        toast.success(`${result.successCount} utilisateurs créés/mis à jour avec succès`);
        setIsInitialized(true);
      } else {
        setError(`${result.errorCount} erreurs rencontrées pendant l'initialisation`);
        toast.error(`Erreur lors de l'initialisation des utilisateurs`, {
          description: `${result.errorCount} erreurs rencontrées. Vérifiez la console pour plus de détails.`
        });
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur inconnue est survenue');
      toast.error('Erreur lors de l\'initialisation des utilisateurs');
    } finally {
      setIsInitializing(false);
    }
  };

  return {
    isInitializing,
    isInitialized,
    error,
    initializeUsers
  };
};
