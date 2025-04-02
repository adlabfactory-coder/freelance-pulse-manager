
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
      const DEMO_MODE = true; // Même valeur que dans useAuth
      
      // Toujours nettoyer le localStorage pour les données d'authentification
      localStorage.removeItem('auth_persistence');
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('currentUser');
      
      // Nettoyer d'autres états potentiels de l'application
      localStorage.removeItem('sidebar-collapsed');
      localStorage.removeItem('last-viewed-contact');
      localStorage.removeItem('last-viewed-quote');
      sessionStorage.clear(); // Effacer tout le sessionStorage
      
      if (DEMO_MODE) {
        // En mode démo, simplement supprimer les données utilisateur et rediriger
        console.log("Déconnexion en mode démo effectuée");
        toast.success("Déconnexion réussie");
      } else {
        // Sinon, utiliser Supabase pour la déconnexion réelle
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.error("Erreur lors de la déconnexion Supabase:", error.message);
          toast.error(`Erreur lors de la déconnexion: ${error.message}`);
          return;
        }
        
        console.log("Déconnexion Supabase réussie");
        toast.success("Déconnexion réussie");
      }
      
      // Assurer un délai court avant la redirection pour permettre la mise à jour de l'état
      // et l'affichage du toast de déconnexion réussie
      setTimeout(() => {
        console.log("Redirection vers /auth/login après déconnexion");
        // Utiliser replace: true pour remplacer l'historique et empêcher le retour arrière
        navigate('/auth/login', { replace: true });
      }, 100);
      
    } catch (err: any) {
      console.error("Erreur lors de la déconnexion:", err);
      toast.error(`Erreur lors de la déconnexion: ${err.message}`);
      
      // Même en cas d'erreur, rediriger vers la page de connexion
      setTimeout(() => {
        navigate('/auth/login', { replace: true });
      }, 100);
    }
  };

  return logout;
};
