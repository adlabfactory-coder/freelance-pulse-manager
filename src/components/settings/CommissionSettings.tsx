
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { CommissionTier } from "@/types/commissions";

interface CommissionRule {
  id?: string;
  tier: string;
  minContracts: number;
  percentage: number;
  maxContracts?: number | null;
  amount?: number | null;
}

const CommissionSettings: React.FC = () => {
  const { supabaseClient } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<CommissionRule[]>([
    { tier: CommissionTier.TIER_1, minContracts: 0, percentage: 10 },
    { tier: CommissionTier.TIER_2, minContracts: 11, percentage: 15, maxContracts: 20 },
    { tier: CommissionTier.TIER_3, minContracts: 21, percentage: 20, maxContracts: 30 },
    { tier: CommissionTier.TIER_4, minContracts: 31, percentage: 25 },
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
          percentage: rule.percentage || 0,
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
    if (field === 'minContracts' || field === 'percentage' || field === 'maxContracts' || field === 'amount') {
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
        percentage: isNaN(tier.percentage) ? 0 : tier.percentage,
        maxContracts: tier.maxContracts && !isNaN(tier.maxContracts) ? tier.maxContracts : null,
        amount: tier.amount && !isNaN(tier.amount) ? tier.amount : null
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
          percentage: tier.percentage,
          maxContracts: tier.maxContracts,
          amount: tier.amount
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
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Configurez les pourcentages et les seuils pour chaque palier de commission. Les freelances seront rémunérés en fonction du nombre de contrats validés dans chaque palier.
        </p>
      </div>
      
      <div className="space-y-4">
        {tiers.map((tier, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-b pb-4">
            <div>
              <Label className="text-base font-medium">
                {tier.tier === CommissionTier.TIER_1 ? 'Bronze (Palier 1)' :
                 tier.tier === CommissionTier.TIER_2 ? 'Silver (Palier 2)' :
                 tier.tier === CommissionTier.TIER_3 ? 'Gold (Palier 3)' :
                 'Platinum (Palier 4)'}
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`percentage-${index}`}>Pourcentage (%)</Label>
              <Input 
                id={`percentage-${index}`} 
                value={tier.percentage} 
                onChange={(e) => handleInputChange(index, 'percentage', e.target.value)}
                type="number"
                min="0"
                max="100"
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
              <Label htmlFor={`max-${index}`}>{index < 3 ? "Contrats maximum" : "Montant fixe (optionnel)"}</Label>
              <Input 
                id={`max-${index}`} 
                value={index < 3 ? tier.maxContracts || '' : tier.amount || ''} 
                onChange={(e) => handleInputChange(index, index < 3 ? 'maxContracts' : 'amount', e.target.value)}
                type="number"
                min="0"
                placeholder={index < 3 ? "Optionnel" : "Montant en MAD"}
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
