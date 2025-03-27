
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionInterval } from "@/types/subscription";
import SubscriptionIntervalLabel from "./SubscriptionIntervalLabel";

interface SubscriptionFiltersProps {
  selectedInterval: string | null;
  onFilterChange: (interval: string | null) => void;
}

const SubscriptionFilters: React.FC<SubscriptionFiltersProps> = ({ 
  selectedInterval, 
  onFilterChange 
}) => {
  const intervals = Object.values(SubscriptionInterval);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filtres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Période de facturation</h3>
          <div className="flex flex-col space-y-2">
            <Button
              variant={selectedInterval === null ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(null)}
              className="justify-start"
            >
              Tous
            </Button>
            
            {intervals.map((interval) => (
              <Button
                key={interval}
                variant={selectedInterval === interval ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange(interval)}
                className="justify-start"
              >
                <SubscriptionIntervalLabel interval={interval as SubscriptionInterval} />
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionFilters;
