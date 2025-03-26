
import { useCallback } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "@/components/ui/use-toast";

export const useSupabaseStatus = () => {
  const supabase = useSupabase();
  
  const checkSupabaseStatus = useCallback(async () => {
    try {
      console.log("Vérification du statut Supabase...");
      const supabaseStatus = await supabase.checkSupabaseStatus();
      
      if (!supabaseStatus.success) {
        console.warn("Problème de connexion à Supabase:", supabaseStatus.message);
        return { success: false, message: supabaseStatus.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la vérification du statut Supabase:", error);
      return { success: false, message: "Erreur de connexion à Supabase" };
    }
  }, [supabase]);
  
  return {
    checkSupabaseStatus
  };
};
