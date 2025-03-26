
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface AppointmentEmptyStateProps {
  hasFilters: boolean;
  onAddAppointment: () => void;
}

const AppointmentEmptyState: React.FC<AppointmentEmptyStateProps> = ({ 
  hasFilters, 
  onAddAppointment 
}) => {
  return (
    <CardContent>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">Aucun rendez-vous trouvé</h3>
        <p className="text-sm text-gray-500 mt-1 mb-6 max-w-sm">
          {hasFilters 
            ? "Essayez de modifier vos critères de recherche" 
            : "Commencez par planifier votre premier rendez-vous"}
        </p>
        <Button onClick={onAddAppointment}>
          Planifier un rendez-vous
        </Button>
      </div>
    </CardContent>
  );
};

export default AppointmentEmptyState;
