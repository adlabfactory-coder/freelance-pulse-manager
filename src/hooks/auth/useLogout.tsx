
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase"; // Import standardisé
import { toast } from "sonner";

/**
 * Hook personnalisé pour gérer la déconnexion de l'utilisateur
 * avec gestion améliorée des états et des transitions
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  /**
   * Déconnecte l'utilisateur et redirige vers la page de connexion
   * avec annulation des requêtes et nettoyage des états
   */
  const logout = async () => {
    // Éviter les déconnexions multiples
    if (isLoggingOut) {
      console.log("Déconnexion déjà en cours");
      return;
    }
    
    try {
      setIsLoggingOut(true);
      console.log("Début du processus de déconnexion");
      
      // Désactiver les canaux Realtime actifs avant la déconnexion
      const channels = supabase.getChannels();
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      
      // Nettoyer toutes les données d'authentification
      localStorage.removeItem('auth_persistence');
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('currentUser');
      
      // Nettoyer d'autres états de l'application
      localStorage.removeItem('sidebar-collapsed');
      localStorage.removeItem('last-viewed-contact');
      localStorage.removeItem('last-viewed-quote');
      
      // Effacer la session storage pour une déconnexion complète
      sessionStorage.clear();
      
      // Déconnecter de Supabase
      const DEMO_MODE = false; // Désactiver le mode démo pour tester avec Supabase
      
      if (!DEMO_MODE) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Erreur lors de la déconnexion Supabase:", error.message);
          toast.error(`Erreur lors de la déconnexion: ${error.message}`);
        } else {
          console.log("Déconnexion Supabase réussie");
        }
      } else {
        console.log("Déconnexion en mode démo effectuée");
      }
      
      // Notification de succès
      toast.success("Déconnexion réussie");
      
      // Nettoyer tous les contextes React gérés par des providers
      // en forçant la réinitialisation de l'état après un délai court
      setTimeout(() => {
        // Rediriger vers la page de connexion après le nettoyage
        console.log("Redirection vers /auth/login après déconnexion");
        navigate('/auth/login', { replace: true });
        
        // Réinitialiser l'état de déconnexion après un délai
        setTimeout(() => {
          setIsLoggingOut(false);
        }, 500);
        
      }, 100);
      
    } catch (err: any) {
      console.error("Erreur lors de la déconnexion:", err);
      toast.error(`Erreur lors de la déconnexion: ${err.message}`);
      
      // Même en cas d'erreur, rediriger vers la page de connexion
      navigate('/auth/login', { replace: true });
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
};
