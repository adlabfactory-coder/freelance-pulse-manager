
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const SubscriptionHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Abonnements</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les abonnements de vos clients
        </p>
      </div>
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Nouvel abonnement
      </Button>
    </div>
  );
};

export default SubscriptionHeader;
