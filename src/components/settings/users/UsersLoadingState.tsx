
import React from "react";
import { RefreshCw } from "lucide-react";

const UsersLoadingState: React.FC = () => {
  return (
    <div className="text-center py-4 flex flex-col items-center gap-2">
      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      <div>Chargement des utilisateurs...</div>
    </div>
  );
};

export default UsersLoadingState;
