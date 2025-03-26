
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const PendingAppointmentsHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        Rendez-vous en attente d'attribution
      </CardTitle>
      <CardDescription>
        Ces rendez-vous sont en attente d'attribution à un chargé de compte
      </CardDescription>
    </CardHeader>
  );
};

export default PendingAppointmentsHeader;
