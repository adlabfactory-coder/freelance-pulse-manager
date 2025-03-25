
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AppointmentDayViewProps {
  date: Date | undefined;
  onAddAppointment: () => void;
}

const AppointmentDayView: React.FC<AppointmentDayViewProps> = ({ date, onAddAppointment }) => {
  // Generate time slots for the day
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // Start at 8 AM
    return {
      time: `${hour}:00`,
      formattedTime: `${hour}:00`,
    };
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Agenda du jour</CardTitle>
          <CardDescription>
            {date ? format(date, "EEEE d MMMM yyyy", { locale: fr }) : "Aujourd'hui"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex items-start border-b pb-2">
              <div className="w-16 font-medium text-muted-foreground">{slot.formattedTime}</div>
              <div className="flex-1 ml-4">
                <div 
                  className="h-12 rounded-md border border-dashed border-muted hover:bg-accent/50 transition-colors cursor-pointer px-2 py-1"
                  onClick={onAddAppointment}
                >
                  <span className="text-xs text-muted-foreground">+ Ajouter</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentDayView;
