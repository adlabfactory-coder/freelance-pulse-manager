
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatPeriod, getTierLabel } from "@/utils/commission";
import { CommissionTier } from "@/types/commissions";
import { User, DollarSign, Calendar } from "lucide-react";
import { CommissionDetail } from "@/hooks/use-commission-detail";

interface CommissionGeneralInfoProps {
  commission: CommissionDetail;
}

const CommissionGeneralInfo: React.FC<CommissionGeneralInfoProps> = ({ commission }) => {
  const getStatusLabel = (status: string, paymentRequested: boolean): string => {
    switch (status) {
      case "paid":
        return "Payé";
      case "pending":
        return paymentRequested ? "Demande envoyée" : "En attente";
      default:
        return "";
    }
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Informations générales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Référence</p>
            <p className="font-medium">{commission.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Statut</p>
            <div className="flex items-center">
              <span 
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset
                  ${commission.status === 'paid' 
                    ? 'bg-green-50 text-green-700 ring-green-700/10' 
                    : commission.payment_requested 
                      ? 'bg-blue-50 text-blue-700 ring-blue-700/10'
                      : 'bg-yellow-50 text-yellow-700 ring-yellow-700/10'
                  }`
                }>
                {getStatusLabel(commission.status, commission.payment_requested)}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Commercial</p>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{commission.freelancerName}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Montant</p>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium text-green-600">{formatCurrency(commission.amount)}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Palier</p>
            <p className="font-medium">{getTierLabel(commission.tier as CommissionTier)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Date de paiement</p>
            <p className="font-medium">
              {commission.paidDate ? commission.paidDate.toLocaleDateString() : "-"}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Période</p>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium">
              {formatPeriod(commission.periodStart, commission.periodEnd)}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Date de création</p>
          <p className="font-medium">
            {commission.createdAt.toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionGeneralInfo;
