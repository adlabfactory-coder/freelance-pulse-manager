
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";

interface FreelancerContactsHeaderProps {
  loading: boolean;
  onRefresh?: () => void;
}

const FreelancerContactsHeader: React.FC<FreelancerContactsHeaderProps> = ({ 
  loading,
  onRefresh 
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Mes contacts</h2>
      <div className="flex space-x-2">
        {onRefresh && (
          <Button 
            variant="primary" 
            size="sm" 
            disabled={loading}
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        )}
        <Button variant="outline" size="sm" disabled={loading}>
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>
    </div>
  );
};

export default FreelancerContactsHeader;
