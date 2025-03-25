
import React from "react";
import { useCommissions } from "@/hooks/use-commissions";
import CommissionContent from "@/components/commissions/CommissionContent";

const Commissions: React.FC = () => {
  const {
    commissions,
    commissionRules,
    loading,
    requestingPayment,
    requestPayment,
  } = useCommissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commissions</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les commissions des commerciaux
        </p>
      </div>

      <CommissionContent
        commissions={commissions}
        commissionRules={commissionRules}
        loading={loading}
        requestingPayment={requestingPayment}
        requestPayment={requestPayment}
      />
    </div>
  );
};

export default Commissions;
