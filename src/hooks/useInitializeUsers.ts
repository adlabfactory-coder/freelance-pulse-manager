
import { useState, useEffect } from 'react';
import { initializeTestUsers } from '@/utils/user-creation-helper';
import { toast } from 'sonner';

export const useInitializeUsers = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeUsers = async () => {
    if (isInitializing) return;
    
    try {
      setIsInitializing(true);
      setError(null);
      
      console.log("🚀 Démarrage de l'initialisation des utilisateurs...");
      const result = await initializeTestUsers();
      console.log("📊 Résultat de l'initialisation:", result);
      
      if (result.success) {
        toast.success(`${result.successCount} utilisateurs créés/mis à jour avec succès`, {
          description: "Les profils utilisateurs ont été initialisés"
        });
        setIsInitialized(true);
      } else {
        setError(`${result.errorCount} erreurs rencontrées pendant l'initialisation`);
        toast.error(`Erreur lors de l'initialisation des utilisateurs`, {
          description: `${result.errorCount} erreurs rencontrées. Vérifiez la console pour plus de détails.`
        });
      }
    } catch (err: any) {
      console.error("❌ Erreur lors de l'initialisation des utilisateurs:", err);
      setError(err.message || 'Une erreur inconnue est survenue');
      toast.error('Erreur lors de l\'initialisation des utilisateurs');
    } finally {
      setIsInitializing(false);
    }
  };

  // Fonction pour réinitialiser l'état pour permettre une nouvelle tentative
  const reset = () => {
    setIsInitialized(false);
    setError(null);
  };

  return {
    isInitializing,
    isInitialized,
    error,
    initializeUsers,
    reset
  };
};
