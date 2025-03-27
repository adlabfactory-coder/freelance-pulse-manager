
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Eye } from "lucide-react";
import { Commission, CommissionStatus, CommissionTier } from "@/types/commissions";
import { Skeleton } from "@/components/ui/skeleton";

interface CommissionsTableProps {
  commissions: Commission[];
  requestingPayment: boolean;
  requestPayment: (commissionId: string) => void;
  approvePayment?: (commissionId: string) => void;
  isAdmin?: boolean;
  getTierLabel: (tier: CommissionTier) => string;
  getStatusBadge: (status: string, paymentRequested: boolean) => React.ReactNode;
  formatCurrency: (amount: number) => string;
  formatPeriod: (start: Date, end: Date) => string;
  onViewCommission: (id: string) => void;
}

const CommissionsTable: React.FC<CommissionsTableProps> = ({
  commissions,
  requestingPayment,
  requestPayment,
  approvePayment,
  isAdmin = false,
  getTierLabel,
  getStatusBadge,
  formatCurrency,
  formatPeriod,
  onViewCommission
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Période</TableHead>
            <TableHead>Niveau</TableHead>
            <TableHead>Contrats</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commissions.map((commission) => (
            <TableRow key={commission.id}>
              <TableCell>
                {formatPeriod(
                  new Date(commission.periodStart), 
                  new Date(commission.periodEnd)
                )}
              </TableCell>
              <TableCell>{getTierLabel(commission.tier)}</TableCell>
              <TableCell>{commission.contracts_count || 0}</TableCell>
              <TableCell>{formatCurrency(commission.amount)}</TableCell>
              <TableCell>
                {getStatusBadge(commission.status, commission.payment_requested)}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewCommission(commission.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Détails
                </Button>
                
                {commission.status === "pending" && !commission.payment_requested && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={requestingPayment}
                    onClick={() => requestPayment(commission.id)}
                  >
                    Demander
                  </Button>
                )}
                
                {isAdmin && commission.payment_requested && commission.status !== "paid" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={() => approvePayment && approvePayment(commission.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Valider
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
