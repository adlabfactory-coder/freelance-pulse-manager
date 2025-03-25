
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isEqual } from "date-fns";
import { fr } from "date-fns/locale";

interface AppointmentWeekViewProps {
  date: Date | undefined;
  onAddAppointment: () => void;
}

const AppointmentWeekView: React.FC<AppointmentWeekViewProps> = ({ date, onAddAppointment }) => {
  // Generate the days for the week view
  const weekStart = date ? startOfWeek(date, { weekStartsOn: 1 }) : startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = date ? endOfWeek(date, { weekStartsOn: 1 }) : endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Generate time slots for the day
  const timeSlots = Array.from({ length: 6 }, (_, i) => {
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
          <CardTitle>Planning hebdomadaire</CardTitle>
          <CardDescription>
            Semaine du {format(weekStart, "d MMMM", { locale: fr })} au {format(weekEnd, "d MMMM yyyy", { locale: fr })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center">
              <div className={`
                text-sm font-medium p-2 rounded-md
                ${isToday(day) ? 'bg-primary text-primary-foreground' : ''}
                ${isEqual(day, date || new Date()) && !isToday(day) ? 'bg-accent' : ''}
              `}>
                {format(day, "EEE", { locale: fr })}
                <div>{format(day, "d")}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-4">
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex items-start border-b pb-2">
              <div className="w-16 font-medium text-muted-foreground">{slot.formattedTime}</div>
              <div className="flex-1 grid grid-cols-7 gap-1">
                {weekDays.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className="h-12 rounded-md border border-dashed border-muted hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={onAddAppointment}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentWeekView;
