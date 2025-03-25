
import React from "react";
import { useParams } from "react-router-dom";
import { useCommissionDetail } from "@/hooks/use-commission-detail";
import CommissionDetailHeader from "@/components/commissions/CommissionDetailHeader";
import CommissionGeneralInfo from "@/components/commissions/CommissionGeneralInfo";
import CommissionActions from "@/components/commissions/CommissionActions";
import CommissionNotFound from "@/components/commissions/CommissionNotFound";

const CommissionDetailPage: React.FC = () => {
  const { commissionId } = useParams<{ commissionId: string }>();
  const { commission, loading, requestingPayment, requestPayment } = useCommissionDetail(commissionId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CommissionDetailHeader commissionId={commissionId} loading={loading} />

      {!commission ? (
        <CommissionNotFound />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CommissionGeneralInfo commission={commission} />
          
          <CommissionActions 
            status={commission.status}
            paymentRequested={commission.payment_requested}
            requestingPayment={requestingPayment}
            onRequestPayment={requestPayment}
          />
        </div>
      )}
    </div>
  );
};

export default CommissionDetailPage;
