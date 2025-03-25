
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface CommissionTier {
  id?: string;
  tier: string;
  minContracts: number;
  percentage: number;
}

const CommissionSettings: React.FC = () => {
  const { supabaseClient } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<CommissionTier[]>([
    { tier: 'tier_1', minContracts: 0, percentage: 10 },
    { tier: 'tier_2', minContracts: 5, percentage: 15 },
    { tier: 'tier_3', minContracts: 10, percentage: 20 },
    { tier: 'tier_4', minContracts: 20, percentage: 25 },
  ]);

  useEffect(() => {
    fetchCommissionRules();
  }, [supabaseClient]);

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
        setTiers(data);
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

  const handleInputChange = (index: number, field: keyof CommissionTier, value: string) => {
    const newTiers = [...tiers];
    if (field === 'minContracts' || field === 'percentage') {
      newTiers[index][field] = parseInt(value, 10);
    } else {
      // @ts-ignore - We know this is safe since it's a string field
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
        minContracts: isNaN(tier.minContracts) ? 0 : tier.minContracts,
        percentage: isNaN(tier.percentage) ? 0 : tier.percentage
      }));

      // Supprimer les anciennes règles et insérer les nouvelles
      for (const tier of validTiers) {
        if (tier.id) {
          // Mettre à jour le tier existant
          const { error } = await supabaseClient
            .from('commission_rules')
            .update({
              minContracts: tier.minContracts,
              percentage: tier.percentage
            })
            .eq('id', tier.id);

          if (error) throw error;
        } else {
          // Créer un nouveau tier
          const { error } = await supabaseClient
            .from('commission_rules')
            .insert({
              tier: tier.tier,
              minContracts: tier.minContracts,
              percentage: tier.percentage
            });

          if (error) throw error;
        }
      }

      toast({
        title: "Paliers mis à jour",
        description: "Les paliers de commission ont été enregistrés avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des paliers:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paliers.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paliers de commission</CardTitle>
        <CardDescription>
          Configurez les paliers de commission des commerciaux
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tiers.map((tier, index) => (
            <div key={tier.tier} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b pb-4">
              <div>
                <Label className="text-base">
                  {tier.tier === 'tier_1' ? 'Palier 1 (Base)' :
                   tier.tier === 'tier_2' ? 'Palier 2' :
                   tier.tier === 'tier_3' ? 'Palier 3' :
                   'Palier 4'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {tier.minContracts} contrats et plus
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`tier${index+1}`}>Taux de commission (%)</Label>
                <Input 
                  id={`tier${index+1}`} 
                  value={tier.percentage} 
                  onChange={(e) => handleInputChange(index, 'percentage', e.target.value)}
                  type="number"
                  min="0"
                  max="100"
                />
              </div>
              {tier.tier !== 'tier_1' && (
                <div className="space-y-2">
                  <Label htmlFor={`tier${index+1}-min`}>Nombre min. de contrats</Label>
                  <Input 
                    id={`tier${index+1}-min`} 
                    value={tier.minContracts} 
                    onChange={(e) => handleInputChange(index, 'minContracts', e.target.value)}
                    type="number"
                    min="0"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={fetchCommissionRules}>Annuler</Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommissionSettings;
