
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AppointmentDialogContent from "../components/AppointmentDialogContent";

interface NewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const NewAppointmentDialog: React.FC<NewAppointmentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppointmentDialogContent 
        onOpenChange={(value) => {
          onOpenChange(value);
          if (!value) {
            handleSuccess();
          }
        }}
      />
    </Dialog>
  );
};

export default NewAppointmentDialog;
