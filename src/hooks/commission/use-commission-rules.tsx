
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CommissionRule, CommissionTier } from "@/types/commissions";
import { toast } from "@/components/ui/use-toast";
import { mapTierFromDb } from "@/services/supabase/commissions/utils";

interface CommissionRulesState {
  commissionRules: CommissionRule[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch and manage commission rules data
 */
export const useCommissionRules = () => {
  const [state, setState] = useState<CommissionRulesState>({
    commissionRules: [],
    loading: true,
    error: null
  });
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    // Limiter à une seule tentative de chargement
    if (loadAttempt === 0) {
      fetchCommissionRules();
      setLoadAttempt(1);
    }
  }, [loadAttempt]);

  /**
   * Fetches commission rules from the database
   */
  const fetchCommissionRules = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Initial connection check
      try {
        const { data, error } = await supabase
          .from('commission_rules')
          .select('count', { count: 'exact', head: true });
          
        if (error) {
          throw new Error(`Connection issue: ${error.message}`);
        }
      } catch (connError: any) {
        console.warn("Database connection check failed:", connError.message || connError);
        console.log("Falling back to default commission rules due to connection issue");
        setState(prev => ({
          ...prev,
          commissionRules: getDefaultCommissionRules(),
          loading: false
        }));
        return;
      }
      
      // Fetch the actual rules
      const { data, error } = await supabase
        .from('commission_rules')
        .select('*')
        .order('minContracts', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log("Commission rules from DB:", data);
        const mappedRules = data.map(mapRuleFromDatabase);
        
        // Vérifier si tous les paliers sont présents
        const tiers = [
          CommissionTier.TIER_1, 
          CommissionTier.TIER_2, 
          CommissionTier.TIER_3, 
          CommissionTier.TIER_4
        ];
        
        // Pour chaque palier, vérifier s'il existe
        const completeRules = [...mappedRules];
        
        for (const tier of tiers) {
          const existingRule = completeRules.find(rule => rule.tier === tier);
          if (!existingRule) {
            console.log(`Adding missing tier: ${tier}`);
            completeRules.push(getDefaultCommissionRule(tier));
          }
        }
        
        // Trier par nombre de contrats minimum
        completeRules.sort((a, b) => a.minContracts - b.minContracts);
        
        setState(prev => ({ 
          ...prev, 
          commissionRules: completeRules,
          loading: false 
        }));
      } else {
        console.log("No commission rules found, using defaults");
        setState(prev => ({ 
          ...prev, 
          commissionRules: getDefaultCommissionRules(),
          loading: false 
        }));
      }
    } catch (error: any) {
      console.error("Error loading commission rules:", error);
      setState(prev => ({ 
        ...prev, 
        error: "Failed to retrieve commission rules. Please try again later.",
        loading: false,
        commissionRules: getDefaultCommissionRules() // Provide fallback data
      }));
    }
  };

  /**
   * Maps a database rule to the application model
   */
  const mapRuleFromDatabase = (dbRule: any): CommissionRule => {
    // Vérifier si dbRule est valide
    if (!dbRule) {
      console.warn("Invalid DB rule received:", dbRule);
      return getDefaultCommissionRule(CommissionTier.TIER_1);
    }
    
    try {
      // Debug logging
      console.log("Mapping DB rule:", dbRule);
      
      return {
        id: dbRule.id || `default-${Date.now()}`,
        tier: mapTierFromDb(dbRule.tier || 'bronze'),
        minContracts: parseInt(dbRule.minContracts) || 0,
        maxContracts: dbRule.maxContracts ? parseInt(dbRule.maxContracts) : null,
        percentage: parseFloat(dbRule.percentage) || 0,
        // Prioritize unit_amount from DB or 0 as fallback
        unitAmount: parseFloat(dbRule.unit_amount) || 500 // Valeur par défaut
      };
    } catch (error) {
      console.error("Error mapping DB rule:", error, dbRule);
      return getDefaultCommissionRule(CommissionTier.TIER_1);
    }
  };

  /**
   * Provides a default commission rule for a specific tier
   */
  const getDefaultCommissionRule = (tier: CommissionTier): CommissionRule => {
    switch (tier) {
      case CommissionTier.TIER_1:
        return {
          id: "default-tier-1",
          tier: CommissionTier.TIER_1,
          minContracts: 1,
          maxContracts: 10,
          percentage: 0,
          unitAmount: 500
        };
      case CommissionTier.TIER_2:
        return {
          id: "default-tier-2",
          tier: CommissionTier.TIER_2,
          minContracts: 11,
          maxContracts: 20,
          percentage: 0,
          unitAmount: 1000
        };
      case CommissionTier.TIER_3:
        return {
          id: "default-tier-3",
          tier: CommissionTier.TIER_3,
          minContracts: 21,
          maxContracts: 30,
          percentage: 0,
          unitAmount: 1500
        };
      case CommissionTier.TIER_4:
        return {
          id: "default-tier-4",
          tier: CommissionTier.TIER_4,
          minContracts: 31,
          percentage: 0,
          unitAmount: 2000
        };
      default:
        return {
          id: "default-unknown",
          tier: CommissionTier.TIER_1,
          minContracts: 1,
          maxContracts: 10,
          percentage: 0,
          unitAmount: 500
        };
    }
  };

  /**
   * Provides default commission rules when none are available
   */
  const getDefaultCommissionRules = (): CommissionRule[] => {
    return [
      getDefaultCommissionRule(CommissionTier.TIER_1),
      getDefaultCommissionRule(CommissionTier.TIER_2),
      getDefaultCommissionRule(CommissionTier.TIER_3),
      getDefaultCommissionRule(CommissionTier.TIER_4)
    ];
  };

  return { 
    commissionRules: state.commissionRules, 
    loading: state.loading, 
    error: state.error,
    fetchCommissionRules
  };
};
