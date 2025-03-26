
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
    { tier: CommissionTier.TIER_1, minContracts: 0, unitAmount: 500, maxContracts: 10 },
    { tier: CommissionTier.TIER_2, minContracts: 11, unitAmount: 1000, maxContracts: 20 },
    { tier: CommissionTier.TIER_3, minContracts: 21, unitAmount: 1500, maxContracts: 30 },
    { tier: CommissionTier.TIER_4, minContracts: 31, unitAmount: 2000 },
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
        setTiers(data.map(rule => ({
          ...rule,
          minContracts: rule.minContracts || 0,
          unitAmount: rule.unit_amount || 0,
          tier: mapTierToEnum(rule.tier)
        })));
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

  const handleInputChange = (index: number, field: keyof CommissionRuleForm, value: string) => {
    const newTiers = [...tiers];
    if (field === 'minContracts' || field === 'unitAmount' || field === 'maxContracts') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        // @ts-ignore - Nous savons que c'est un champ numérique
        newTiers[index][field] = numValue;
      }
    } else {
      // @ts-ignore - Nous savons que c'est un champ texte
      newTiers[index][field] = value;
    }
    setTiers(newTiers);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Vérifier les données avant l'envoi
      const validTiers = tiers.map(tier => ({
        ...tier,
        tier: mapEnumToTier(tier.tier),
        minContracts: isNaN(tier.minContracts) ? 0 : tier.minContracts,
        unitAmount: isNaN(tier.unitAmount) ? 0 : tier.unitAmount,
        maxContracts: tier.maxContracts && !isNaN(tier.maxContracts) ? tier.maxContracts : null,
        percentage: 0 // Non utilisé dans la nouvelle logique
      }));

      // Supprimer les anciennes règles
      const { error: deleteError } = await supabaseClient
        .from('commission_rules')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Une condition toujours vraie pour tout supprimer

      if (deleteError) throw deleteError;

      // Créer les nouvelles règles
      const { error: insertError } = await supabaseClient
        .from('commission_rules')
        .insert(validTiers.map(tier => ({
          tier: tier.tier,
          minContracts: tier.minContracts,
          maxContracts: tier.maxContracts,
          unit_amount: tier.unitAmount,
          percentage: 0 // Non utilisé dans la nouvelle logique
        })));

      if (insertError) throw insertError;

      toast({
        title: "Paliers mis à jour",
        description: "Les paliers de commission ont été enregistrés avec succès.",
      });
      
      // Recharger les données après la mise à jour
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
