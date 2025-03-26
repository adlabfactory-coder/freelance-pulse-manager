
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CommissionRule } from "@/types/commissions";
import { createCommissionsService } from "@/services/supabase/commissions";

export const useCommissionRules = () => {
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const commissionsService = createCommissionsService(supabase as any);

  const fetchCommissionRules = useCallback(async () => {
    try {
      setError(null);
      const data = await commissionsService.fetchCommissionRules();
      setCommissionRules(data);
    } catch (error: any) {
      console.error("Erreur lors du chargement des règles de commissions:", error);
      setError("Impossible de récupérer les règles de commission.");
      
      // Utiliser des règles par défaut en cas d'erreur
      setCommissionRules([
        {
          id: "default-tier-1",
          tier: "bronze" as any,
          minContracts: 1,
          maxContracts: 10,
          percentage: 10,
          amount: 500
        },
        {
          id: "default-tier-2",
          tier: "silver" as any,
          minContracts: 11,
          maxContracts: 20,
          percentage: 15,
          amount: 1000
        },
        {
          id: "default-tier-3",
          tier: "gold" as any,
          minContracts: 21,
          maxContracts: 30,
          percentage: 20,
          amount: 1500
        },
        {
          id: "default-tier-4",
          tier: "platinum" as any,
          minContracts: 31,
          percentage: 25,
          amount: 2000
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [commissionsService]);

  useEffect(() => {
    fetchCommissionRules();
  }, [fetchCommissionRules]);

  return {
    commissionRules,
    loading,
    error,
    fetchCommissionRules
  };
};
