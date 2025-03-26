
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AppointmentHeaderProps {
  onAddAppointment: () => void;
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  onAddAppointment
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
        <p className="text-muted-foreground">
          Gérez vos rendez-vous et consultations
        </p>
      </div>
      <div>
        <Button onClick={onAddAppointment}>
          <Plus className="mr-2 h-4 w-4" /> Nouveau rendez-vous
        </Button>
      </div>
    </div>
  );
};

export default AppointmentHeader;
