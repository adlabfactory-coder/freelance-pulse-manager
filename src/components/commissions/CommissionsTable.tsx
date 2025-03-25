
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BadgeDollarSign, Eye } from "lucide-react";
import { CommissionTier } from "@/types";

interface Commission {
  id: string;
  freelancerName: string;
  amount: number;
  tier: CommissionTier;
  period: {
    startDate: Date;
    endDate: Date;
  };
  status: string;
  paidDate?: Date;
  paymentRequested?: boolean;
}

interface CommissionsTableProps {
  commissions: Commission[];
  requestingPayment: boolean;
  requestPayment: (commissionId: string) => void;
  getTierLabel: (tier: CommissionTier) => string;
  getStatusBadge: (status: string, paymentRequested?: boolean) => React.ReactNode;
  formatCurrency: (amount: number) => string;
  formatPeriod: (startDate: Date, endDate: Date) => string;
  onViewCommission: (commissionId: string) => void;
}

const CommissionsTable: React.FC<CommissionsTableProps> = ({
  commissions,
  requestingPayment,
  requestPayment,
  getTierLabel,
  getStatusBadge,
  formatCurrency,
  formatPeriod,
  onViewCommission,
}) => {
  return (
    <div className="rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Commercial</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Palier</TableHead>
            <TableHead className="hidden md:table-cell">Période</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="hidden md:table-cell">Date de paiement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commissions.map((commission) => (
            <TableRow key={commission.id}>
              <TableCell className="font-medium">{commission.id}</TableCell>
              <TableCell>{commission.freelancerName}</TableCell>
              <TableCell>{formatCurrency(commission.amount)}</TableCell>
              <TableCell>{getTierLabel(commission.tier)}</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatPeriod(
                  commission.period.startDate,
                  commission.period.endDate
                )}
              </TableCell>
              <TableCell>
                {getStatusBadge(commission.status, commission.paymentRequested)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {commission.paidDate
                  ? commission.paidDate.toLocaleDateString()
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                {commission.status === "pending" && !commission.paymentRequested ? (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => requestPayment(commission.id)}
                    disabled={requestingPayment}
                  >
                    <BadgeDollarSign className="mr-2 h-4 w-4" />
                    Demander versement
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewCommission(commission.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Voir
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommissionsTable;
