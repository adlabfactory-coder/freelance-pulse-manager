
import React from "react";
import { RefreshCw } from "lucide-react";

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-2">
      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export default LoadingIndicator;
