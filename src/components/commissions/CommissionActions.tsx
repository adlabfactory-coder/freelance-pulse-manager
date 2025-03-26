
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, FileText } from "lucide-react";
import { Commission } from "@/types/commissions";
import { useCommissions } from "@/hooks/use-commissions";

interface CommissionActionsProps {
  status: string;
  paymentRequested: boolean;
  requestingPayment: boolean;
  onRequestPayment: () => void;
  isAdmin?: boolean;
  commission?: Commission;
}

const CommissionActions: React.FC<CommissionActionsProps> = ({
  status,
  paymentRequested,
  requestingPayment,
  onRequestPayment,
  isAdmin = false,
  commission
}) => {
  const navigate = useNavigate();
  const { approvePayment } = useCommissions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Demande de versement (visible par le freelance et l'admin) */}
        {status === "pending" && !paymentRequested ? (
          <Button 
            className="w-full" 
            onClick={onRequestPayment}
            disabled={requestingPayment}
          >
            {requestingPayment ? "Envoi en cours..." : "Demander le versement"}
          </Button>
        ) : paymentRequested && status !== "paid" ? (
          <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
            Demande de versement en attente
          </div>
        ) : null}

        {/* Actions réservées à l'administrateur */}
        {isAdmin && commission && paymentRequested && status !== "paid" && (
          <Button 
            variant="outline" 
            className="w-full border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
            onClick={() => approvePayment(commission.id)}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Valider le versement
          </Button>
        )}

        {/* Génération de facture (exemple) */}
        {status === "paid" && (
          <Button 
            variant="outline" 
            className="w-full"
          >
            <FileText className="mr-2 h-4 w-4" />
            Télécharger la facture
          </Button>
        )}

        {/* Bouton de retour */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/commissions")}
        >
          Retour à la liste
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommissionActions;
