
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
      const DEMO_MODE = true; // Même valeur que dans useAuth
      
      if (DEMO_MODE) {
        // En mode démo, simplement supprimer les données utilisateur et rediriger
        toast.success("Déconnexion réussie");
        // Toujours rediriger vers la page de connexion après déconnexion
        navigate('/auth/login', { replace: true });
        return;
      }
      
      // Sinon, utiliser Supabase pour la déconnexion réelle
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erreur lors de la déconnexion Supabase:", error.message);
        toast.error(`Erreur lors de la déconnexion: ${error.message}`);
        return;
      }
      
      // Toujours rediriger explicitement vers la page de connexion
      navigate('/auth/login', { replace: true });
      toast.success("Déconnexion réussie");
    } catch (err: any) {
      console.error("Erreur lors de la déconnexion:", err);
      toast.error(`Erreur lors de la déconnexion: ${err.message}`);
      // Même en cas d'erreur, rediriger vers la page de connexion
      navigate('/auth/login', { replace: true });
    }
  };

  return logout;
};
