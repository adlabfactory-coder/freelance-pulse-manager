
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import AppointmentDialogContent from "./components/AppointmentDialogContent";

interface AddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({
  open,
  onOpenChange,
  selectedDate
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppointmentDialogContent 
        onOpenChange={onOpenChange}
        selectedDate={selectedDate}
      />
    </Dialog>
  );
};

export default AddAppointmentDialog;
