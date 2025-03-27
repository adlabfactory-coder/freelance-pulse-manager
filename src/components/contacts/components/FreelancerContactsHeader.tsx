
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FreelancerContactsHeaderProps {
  loading: boolean;
}

const FreelancerContactsHeader: React.FC<FreelancerContactsHeaderProps> = ({ loading }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Mes contacts</h2>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" disabled={loading}>
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>
    </div>
  );
};

export default FreelancerContactsHeader;
