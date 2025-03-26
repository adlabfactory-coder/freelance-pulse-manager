
import React from "react";
import { RefreshCw } from "lucide-react";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-center py-8">
      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
};

export default LoadingIndicator;
