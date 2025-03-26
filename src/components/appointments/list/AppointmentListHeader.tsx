
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AppointmentListHeaderProps {
  appointmentCount: number;
  hasFilters: boolean;
}

const AppointmentListHeader: React.FC<AppointmentListHeaderProps> = ({ 
  appointmentCount, 
  hasFilters 
}) => {
  return (
    <CardHeader>
      <CardTitle>
        Rendez-vous ({appointmentCount})
      </CardTitle>
      <CardDescription>
        {hasFilters 
          ? "Résultats filtrés" 
          : "Liste de tous vos rendez-vous"}
      </CardDescription>
    </CardHeader>
  );
};

export default AppointmentListHeader;
