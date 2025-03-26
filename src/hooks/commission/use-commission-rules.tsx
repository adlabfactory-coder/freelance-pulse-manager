
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

  useEffect(() => {
    fetchCommissionRules();
  }, []);

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
        throw new Error("Unable to connect to database");
      }
      
      // Fetch the actual rules
      const { data, error } = await supabase
        .from('commission_rules')
        .select('*')
        .order('minContracts', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const mappedRules = data.map(mapRuleFromDatabase);
        setState(prev => ({ 
          ...prev, 
          commissionRules: mappedRules,
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
    return {
      id: dbRule.id,
      tier: mapTierFromDb(dbRule.tier),
      minContracts: dbRule.minContracts || 0,
      maxContracts: dbRule.maxContracts || null,
      percentage: dbRule.percentage || 0,
      unitAmount: dbRule.unit_amount || 0
    };
  };

  /**
   * Provides default commission rules when none are available
   */
  const getDefaultCommissionRules = (): CommissionRule[] => {
    return [
      {
        id: "default-tier-1",
        tier: CommissionTier.TIER_1,
        minContracts: 1,
        maxContracts: 10,
        percentage: 0,
        unitAmount: 500
      },
      {
        id: "default-tier-2",
        tier: CommissionTier.TIER_2,
        minContracts: 11,
        maxContracts: 20,
        percentage: 0,
        unitAmount: 1000
      },
      {
        id: "default-tier-3",
        tier: CommissionTier.TIER_3,
        minContracts: 21,
        maxContracts: 30,
        percentage: 0,
        unitAmount: 1500
      },
      {
        id: "default-tier-4",
        tier: CommissionTier.TIER_4,
        minContracts: 31,
        percentage: 0,
        unitAmount: 2000
      }
    ];
  };

  return { 
    commissionRules: state.commissionRules, 
    loading: state.loading, 
    error: state.error,
    fetchCommissionRules
  };
};
