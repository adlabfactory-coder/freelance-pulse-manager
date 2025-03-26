
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface PendingAppointmentActionsProps {
  appointmentId: string;
  contactId: string;
  isProcessing: boolean;
  onAccept: (appointmentId: string, contactId: string) => void;
  onDecline: (appointmentId: string) => void;
}

const PendingAppointmentActions: React.FC<PendingAppointmentActionsProps> = ({
  appointmentId,
  contactId,
  isProcessing,
  onAccept,
  onDecline
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        className="text-red-600 border-red-200 hover:bg-red-50"
        onClick={() => onDecline(appointmentId)}
        disabled={isProcessing}
      >
        <X className="h-4 w-4 mr-1" />
        Refuser
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="text-green-600 border-green-200 hover:bg-green-50"
        onClick={() => onAccept(appointmentId, contactId)}
        disabled={isProcessing}
      >
        <Check className="h-4 w-4 mr-1" />
        Accepter
      </Button>
    </div>
  );
};

export default PendingAppointmentActions;
