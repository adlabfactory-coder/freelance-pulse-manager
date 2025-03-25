
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CommissionNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        La commission que vous recherchez n'existe pas ou a été supprimée.
      </p>
      <Button onClick={() => navigate("/commissions")}>Retour aux commissions</Button>
    </div>
  );
};

export default CommissionNotFound;
