
import { useState, useCallback, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "@/components/ui/use-toast";

export const useSupabaseStatus = () => {
  const supabase = useSupabase();
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message?: string;
    checkedAt?: Date;
  }>({ success: false });
  const [isChecking, setIsChecking] = useState(false);
  
  const checkSupabaseStatus = useCallback(async () => {
    try {
      setIsChecking(true);
      console.log("Vérification du statut Supabase...");
      const supabaseStatus = await supabase.checkSupabaseStatus();
      
      setConnectionStatus({
        success: supabaseStatus.success,
        message: supabaseStatus.message,
        checkedAt: new Date()
      });
      
      if (!supabaseStatus.success) {
        console.warn("Problème de connexion à Supabase:", supabaseStatus.message);
        return { success: false, message: supabaseStatus.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la vérification du statut Supabase:", error);
      setConnectionStatus({
        success: false,
        message: "Erreur inattendue lors de la vérification de la connexion",
        checkedAt: new Date()
      });
      return { success: false, message: "Erreur de connexion à Supabase" };
    } finally {
      setIsChecking(false);
    }
  }, [supabase]);
  
  // Run an initial check when the hook is first used
  useEffect(() => {
    checkSupabaseStatus().catch(err => {
      console.error("Échec de la vérification initiale:", err);
    });
  }, [checkSupabaseStatus]);
  
  return {
    checkSupabaseStatus,
    connectionStatus,
    isChecking
  };
};

export default useSupabaseStatus;
