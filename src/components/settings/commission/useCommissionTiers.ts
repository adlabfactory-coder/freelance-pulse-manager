import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "@/components/ui/use-toast";
import { CommissionRuleForm } from "./types";
import { mapTierToEnum, mapEnumToTier } from "./TierMapper";
import { CommissionTier } from "@/types/commissions";

export const useCommissionTiers = () => {
  const { supabaseClient } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<CommissionRuleForm[]>([
    { tier: CommissionTier.TIER_1, minContracts: 0, unit_amount: 500, maxContracts: 10 },
    { tier: CommissionTier.TIER_2, minContracts: 11, unit_amount: 1000, maxContracts: 20 },
    { tier: CommissionTier.TIER_3, minContracts: 21, unit_amount: 1500, maxContracts: 30 },
    { tier: CommissionTier.TIER_4, minContracts: 31, unit_amount: 2000 },
  ]);

  useEffect(() => {
    fetchCommissionRules();
  }, []);

  const fetchCommissionRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from('commission_rules')
        .select('*')
        .order('minContracts', { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        console.log("Data received from DB:", data);
        
        const existingTiers: Record<string, CommissionRuleForm> = {};
        
        data.forEach(rule => {
          const mappedTier = mapTierToEnum(rule.tier);
          existingTiers[mappedTier] = {
            id: rule.id,
            minContracts: rule.minContracts || 0,
            unit_amount: rule.unit_amount || 0,
            maxContracts: rule.maxContracts || null,
            tier: mappedTier
          };
        });
        
        const updatedTiers: CommissionRuleForm[] = [];
        
        [CommissionTier.TIER_1, CommissionTier.TIER_2, CommissionTier.TIER_3, CommissionTier.TIER_4].forEach((tier) => {
          if (existingTiers[tier]) {
            updatedTiers.push(existingTiers[tier]);
          } else {
            updatedTiers.push(getDefaultTier(tier));
          }
        });
        
        updatedTiers.sort((a, b) => a.minContracts - b.minContracts);
        
        setTiers(updatedTiers);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des règles de commission:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les règles de commission.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTier = (tier: CommissionTier): CommissionRuleForm => {
    switch (tier) {
      case CommissionTier.TIER_1:
        return { tier: CommissionTier.TIER_1, minContracts: 0, unit_amount: 500, maxContracts: 10 };
      case CommissionTier.TIER_2:
        return { tier: CommissionTier.TIER_2, minContracts: 11, unit_amount: 1000, maxContracts: 20 };
      case CommissionTier.TIER_3:
        return { tier: CommissionTier.TIER_3, minContracts: 21, unit_amount: 1500, maxContracts: 30 };
      case CommissionTier.TIER_4:
        return { tier: CommissionTier.TIER_4, minContracts: 31, unit_amount: 2000 };
      default:
        return { tier: CommissionTier.TIER_1, minContracts: 0, unit_amount: 500, maxContracts: 10 };
    }
  };

  const handleInputChange = (index: number, field: keyof CommissionRuleForm, value: string) => {
    const newTiers = [...tiers];
    if (field === 'minContracts' || field === 'unit_amount' || field === 'maxContracts') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        newTiers[index][field] = numValue;
      }
    } else {
      newTiers[index][field] = value;
    }
    setTiers(newTiers);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const validTiers = tiers.map(tier => ({
        ...tier,
        tier: mapEnumToTier(tier.tier),
        minContracts: isNaN(tier.minContracts) ? 0 : tier.minContracts,
        unit_amount: isNaN(tier.unit_amount) ? 0 : tier.unit_amount,
        maxContracts: tier.maxContracts && !isNaN(tier.maxContracts) ? tier.maxContracts : null,
        percentage: 0
      }));

      console.log("Saving to DB:", validTiers);

      const { error: deleteError } = await supabaseClient
        .from('commission_rules')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabaseClient
        .from('commission_rules')
        .insert(validTiers.map(tier => ({
          tier: tier.tier,
          minContracts: tier.minContracts,
          maxContracts: tier.maxContracts,
          unit_amount: tier.unit_amount,
          percentage: 0
        })));

      if (insertError) throw insertError;

      toast({
        title: "Paliers mis à jour",
        description: "Les paliers de commission ont été enregistrés avec succès.",
      });
      
      fetchCommissionRules();
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement des paliers:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement des paliers.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    tiers,
    loading,
    isSubmitting,
    handleInputChange,
    handleSave,
    fetchCommissionRules
  };
};
