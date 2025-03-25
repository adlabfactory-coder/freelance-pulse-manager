
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CommissionDetailHeaderProps {
  commissionId: string | undefined;
  loading: boolean;
}

const CommissionDetailHeader: React.FC<CommissionDetailHeaderProps> = ({ 
  commissionId, 
  loading 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" onClick={() => navigate("/commissions")}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      {loading ? (
        <h1 className="text-3xl font-bold tracking-tight">Chargement...</h1>
      ) : commissionId ? (
        <h1 className="text-3xl font-bold tracking-tight">Commission {commissionId}</h1>
      ) : (
        <h1 className="text-3xl font-bold tracking-tight">Commission introuvable</h1>
      )}
    </div>
  );
};

export default CommissionDetailHeader;
