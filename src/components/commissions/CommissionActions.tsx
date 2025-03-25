
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CommissionActionsProps {
  status: string;
  paymentRequested: boolean;
  requestingPayment: boolean;
  onRequestPayment: () => void;
}

const CommissionActions: React.FC<CommissionActionsProps> = ({
  status,
  paymentRequested,
  requestingPayment,
  onRequestPayment
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "pending" && !paymentRequested ? (
          <Button 
            className="w-full" 
            onClick={onRequestPayment}
            disabled={requestingPayment}
          >
            Demander le versement
          </Button>
        ) : null}
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
