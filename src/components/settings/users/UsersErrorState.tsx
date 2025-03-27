
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface UsersErrorStateProps {
  onRetry: () => void;
}

const UsersErrorState: React.FC<UsersErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="text-center py-4 space-y-4">
      <div className="text-amber-500">
        Données de démonstration chargées (impossible de se connecter à Supabase)
      </div>
      <Button onClick={onRetry} variant="outline" size="sm">
        <RefreshCw className="mr-2 h-4 w-4" />
        Réessayer
      </Button>
    </div>
  );
};

export default UsersErrorState;
