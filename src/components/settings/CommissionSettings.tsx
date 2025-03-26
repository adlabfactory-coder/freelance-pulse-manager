
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { CommissionTier } from "@/types/commissions";
import LoadingIndicator from "./database/LoadingIndicator";

interface CommissionRule {
  id?: string;
  tier: string;
  minContracts: number;
  percentage?: number;
  maxContracts?: number | null;
  unitAmount: number;
}

const CommissionSettings: React.FC = () => {
  const { supabaseClient } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<CommissionRule[]>([
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
          unitAmount: rule.unit_amount || rule.amount || 0,
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

  const mapTierToEnum = (tierString: string): string => {
    switch(tierString) {
      case 'bronze':
        return CommissionTier.TIER_1;
      case 'silver':
        return CommissionTier.TIER_2;
      case 'gold':
        return CommissionTier.TIER_3;
      case 'platinum':
        return CommissionTier.TIER_4;
      default:
        return tierString;
    }
  };

  const mapEnumToTier = (tierEnum: string): string => {
    switch(tierEnum) {
      case CommissionTier.TIER_1:
        return 'bronze';
      case CommissionTier.TIER_2:
        return 'silver';
      case CommissionTier.TIER_3:
        return 'gold';
      case CommissionTier.TIER_4:
        return 'platinum';
      default:
        return tierEnum;
    }
  };

  const handleInputChange = (index: number, field: keyof CommissionRule, value: string) => {
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

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Configurez les montants fixes pour chaque palier de commission. Les freelances recevront une commission par contrat validé en fonction du palier atteint.
        </p>
      </div>
      
      <div className="space-y-4">
        {tiers.map((tier, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-b pb-4">
            <div>
              <Label className="text-base font-medium">
                {tier.tier === CommissionTier.TIER_1 ? 'Palier 1 (Bronze)' :
                 tier.tier === CommissionTier.TIER_2 ? 'Palier 2 (Silver)' :
                 tier.tier === CommissionTier.TIER_3 ? 'Palier 3 (Gold)' :
                 'Palier 4 (Platinum)'}
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`unitAmount-${index}`}>Commission par contrat (MAD)</Label>
              <Input 
                id={`unitAmount-${index}`} 
                value={tier.unitAmount} 
                onChange={(e) => handleInputChange(index, 'unitAmount', e.target.value)}
                type="number"
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`min-${index}`}>Contrats minimum</Label>
              <Input 
                id={`min-${index}`} 
                value={tier.minContracts} 
                onChange={(e) => handleInputChange(index, 'minContracts', e.target.value)}
                type="number"
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`max-${index}`}>Contrats maximum</Label>
              <Input 
                id={`max-${index}`} 
                value={tier.maxContracts || ''} 
                onChange={(e) => handleInputChange(index, 'maxContracts', e.target.value)}
                type="number"
                min="0"
                placeholder={index === 3 ? "Illimité" : ""}
                disabled={index === 3}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={fetchCommissionRules} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : "Enregistrer les paliers"}
        </Button>
      </div>
    </div>
  );
};

export default CommissionSettings;
