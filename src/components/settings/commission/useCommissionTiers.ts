import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "@/components/ui/use-toast";
import { CommissionRuleForm } from "./types";
import { mapTierToEnum, mapEnumToTier } from "./TierMapper";
import { CommissionTierValues } from "@/types/commissions";

export const useCommissionTiers = () => {
  const { supabaseClient } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<CommissionRuleForm[]>([
    { tier: CommissionTierValues.BRONZE, minContracts: 0, unit_amount: 500, maxContracts: 10 },
    { tier: CommissionTierValues.SILVER, minContracts: 11, unit_amount: 1000, maxContracts: 20 },
    { tier: CommissionTierValues.GOLD, minContracts: 21, unit_amount: 1500, maxContracts: 30 },
    { tier: CommissionTierValues.PLATINUM, minContracts: 31, unit_amount: 2000 },
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
        
        [CommissionTierValues.BRONZE, CommissionTierValues.SILVER, CommissionTierValues.GOLD, CommissionTierValues.PLATINUM].forEach((tier) => {
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
      console.error("Error loading commission rules:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to load commission rules.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTier = (tier: string): CommissionRuleForm => {
    switch (tier) {
      case CommissionTierValues.BRONZE:
        return { tier: CommissionTierValues.BRONZE, minContracts: 0, unit_amount: 500, maxContracts: 10 };
      case CommissionTierValues.SILVER:
        return { tier: CommissionTierValues.SILVER, minContracts: 11, unit_amount: 1000, maxContracts: 20 };
      case CommissionTierValues.GOLD:
        return { tier: CommissionTierValues.GOLD, minContracts: 21, unit_amount: 1500, maxContracts: 30 };
      case CommissionTierValues.PLATINUM:
        return { tier: CommissionTierValues.PLATINUM, minContracts: 31, unit_amount: 2000 };
      default:
        return { tier: CommissionTierValues.BRONZE, minContracts: 0, unit_amount: 500, maxContracts: 10 };
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
      console.error("Error saving commission rules:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while saving commission rules.",
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
