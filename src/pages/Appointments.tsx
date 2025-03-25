
import React, { useState } from "react";
import AppointmentHeader from "@/components/appointments/AppointmentHeader";
import AppointmentTabs from "@/components/appointments/AppointmentTabs";
import AddAppointmentDialog from "@/components/appointments/AddAppointmentDialog";

const Appointments: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"list" | "grid" | "calendar">("list");
  const [timeView, setTimeView] = useState<"day" | "week">("day");
  const [searchQuery, setSearchQuery] = useState("");
  const [openNewAppointmentDialog, setOpenNewAppointmentDialog] = useState(false);

  const handleAddAppointment = () => {
    setOpenNewAppointmentDialog(true);
  };

  return (
    <div className="space-y-6">
      <AppointmentHeader 
        view={view}
        setView={setView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddAppointment={handleAddAppointment}
      />

      <AppointmentTabs 
        date={date}
        setDate={setDate}
        timeView={timeView}
        setTimeView={setTimeView}
        onAddAppointment={handleAddAppointment}
      />

      <AddAppointmentDialog 
        open={openNewAppointmentDialog} 
        onOpenChange={setOpenNewAppointmentDialog}
        selectedDate={date}
      />
    </div>
  );
};

export default Appointments;
