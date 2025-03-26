
import React from "react";
import { useNavigate } from "react-router-dom";
import { Commission, CommissionRule } from "@/types/commissions";
import CommissionTiers from "@/components/commissions/CommissionTiers";
import CommissionsTable from "@/components/commissions/CommissionsTable";
import CommissionToolbar from "@/components/commissions/CommissionToolbar";
import CommissionStatusBadge from "@/components/commissions/CommissionStatusBadge";
import { formatPeriod } from "@/utils/commission";
import { formatCurrency } from "@/utils/format";
import { getTierLabel } from "@/components/settings/commission/TierMapper";

interface CommissionContentProps {
  commissions: Commission[];
  commissionRules: CommissionRule[];
  loading: boolean;
  requestingPayment: boolean;
  requestPayment: (commissionId: string) => void;
  approvePayment?: (commissionId: string) => void;
  isAdmin?: boolean;
}

const CommissionContent: React.FC<CommissionContentProps> = ({
  commissions,
  commissionRules,
  loading,
  requestingPayment,
  requestPayment,
  approvePayment,
  isAdmin = false,
}) => {
  const navigate = useNavigate();

  console.log("Commission rules in CommissionContent:", commissionRules);

  const getStatusBadge = (status: string, paymentRequested: boolean = false) => {
    return <CommissionStatusBadge status={status} paymentRequested={paymentRequested} />;
  };

  const handleViewCommission = (commissionId: string) => {
    navigate(`/commissions/detail/${commissionId}`);
  };

  return (
    <>
      <CommissionTiers 
        commissionRules={commissionRules} 
        formatCurrency={formatCurrency} 
        getTierLabel={getTierLabel} 
      />

      <CommissionToolbar />

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : commissions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucune commission disponible</p>
        </div>
      ) : (
        <CommissionsTable 
          commissions={commissions}
          requestingPayment={requestingPayment}
          requestPayment={requestPayment}
          approvePayment={approvePayment}
          isAdmin={isAdmin}
          getTierLabel={getTierLabel}
          getStatusBadge={getStatusBadge}
          formatCurrency={formatCurrency}
          formatPeriod={formatPeriod}
          onViewCommission={handleViewCommission}
        />
      )}
    </>
  );
};

export default CommissionContent;
