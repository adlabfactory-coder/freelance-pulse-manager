
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface SettingsErrorProps {
  error: string;
  details?: string;
  onRetry?: () => void;
}

const SettingsError: React.FC<SettingsErrorProps> = ({ 
  error, 
  details, 
  onRetry 
}) => {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-medium text-destructive">{error}</h4>
          {details && (
            <p className="text-sm text-destructive/80">{details}</p>
          )}
        </div>
      </div>
      
      {onRetry && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="text-sm border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Réessayer
          </Button>
        </div>
      )}
    </div>
  );
};

export default SettingsError;
