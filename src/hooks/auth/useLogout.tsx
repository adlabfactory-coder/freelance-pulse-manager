
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";

/**
 * Hook personnalisé pour gérer la déconnexion de l'utilisateur
 */
export const useLogout = () => {
  const navigate = useNavigate();
  
  /**
   * Déconnecte l'utilisateur et redirige vers la page de connexion
   */
  const logout = async () => {
    try {
      console.log("Début du processus de déconnexion");
      
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
      
      // Déconnecter de Supabase si nécessaire (en mode non démo)
      const DEMO_MODE = true; // Même valeur que dans useAuth
      
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
      
      // Rediriger vers la page de connexion immédiatement
      console.log("Redirection vers /auth/login après déconnexion");
      navigate('/auth/login', { replace: true });
      
    } catch (err: any) {
      console.error("Erreur lors de la déconnexion:", err);
      toast.error(`Erreur lors de la déconnexion: ${err.message}`);
      
      // Même en cas d'erreur, rediriger vers la page de connexion
      navigate('/auth/login', { replace: true });
    }
  };

  return logout;
};
