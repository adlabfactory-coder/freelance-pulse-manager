
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AppointmentCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ date, setDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier</CardTitle>
        <CardDescription>
          {date?.toLocaleDateString() || "Sélectionnez une date"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="mx-auto"
          locale={fr}
        />
        <div className="mt-4 space-y-4">
          <h4 className="text-sm font-medium">Prochains rendez-vous</h4>
          <div className="text-center py-4 text-muted-foreground">
            Aucun rendez-vous pour cette date
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendar;
