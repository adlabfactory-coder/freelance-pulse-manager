
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CommissionRule, CommissionTier } from "@/types/commissions";
import { createCommissionsService } from "@/services/supabase/commissions";

export const useCommissionRules = () => {
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const commissionsService = createCommissionsService(supabase as any);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Vérifier d'abord la connexion Supabase
        try {
          const { data, error } = await supabase.from('commission_rules').select('count', { count: 'exact', head: true });
          if (error) {
            throw new Error(`Problème d'accès à la base de données: ${error.message}`);
          }
        } catch (connError: any) {
          console.warn("Vérification de connexion échouée:", connError.message || connError);
          throw new Error("Impossible de se connecter à la base de données");
        }
        
        const rules = await commissionsService.fetchCommissionRules();
        setCommissionRules(rules);
      } catch (error: any) {
        console.error("Erreur lors du chargement des règles de commissions:", error);
        setError("Impossible de récupérer les règles de commission. Veuillez réessayer plus tard.");
        
        // Fournir des données par défaut pour ne pas bloquer l'interface
        setCommissionRules([
          {
            id: "mock-rule-1",
            tier: CommissionTier.TIER_1,
            minContracts: 1,
            percentage: 5,
            unitAmount: 500 // Ajout de la propriété manquante
          },
          {
            id: "mock-rule-2",
            tier: CommissionTier.TIER_2,
            minContracts: 5,
            percentage: 10,
            unitAmount: 1000 // Ajout de la propriété manquante
          },
          {
            id: "mock-rule-3",
            tier: CommissionTier.TIER_3,
            minContracts: 10,
            percentage: 15,
            unitAmount: 1500 // Ajout de la propriété manquante
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, [commissionsService]);

  return { commissionRules, loading, error };
};
