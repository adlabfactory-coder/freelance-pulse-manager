
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";

interface AppointmentDateSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

const AppointmentDateSelector: React.FC<AppointmentDateSelectorProps> = ({ 
  selectedDate, 
  setSelectedDate 
}) => {
  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      locale={fr}
      className="border rounded-md p-4"
    />
  );
};

export default AppointmentDateSelector;
