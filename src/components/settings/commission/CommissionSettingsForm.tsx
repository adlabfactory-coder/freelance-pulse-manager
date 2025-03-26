
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CommissionTierRow from "./CommissionTierRow";
import { useCommissionTiers } from "./useCommissionTiers";

const CommissionSettingsForm: React.FC = () => {
  const {
    tiers,
    isSubmitting,
    handleInputChange,
    handleSave,
    fetchCommissionRules
  } = useCommissionTiers();

  return (
    <>
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Configurez les montants fixes pour chaque palier de commission. Les freelances recevront une commission par contrat validé en fonction du palier atteint.
        </p>
      </div>
      
      <div className="space-y-4">
        {tiers.map((tier, index) => (
          <CommissionTierRow
            key={index}
            tier={tier}
            index={index}
            onInputChange={handleInputChange}
          />
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
    </>
  );
};

export default CommissionSettingsForm;
