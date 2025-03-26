
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fr } from "date-fns/locale";

interface AppointmentDateTimePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  time: string;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  duration: string;
  onDurationChange: (value: string) => void;
}

const AppointmentDateTimePicker: React.FC<AppointmentDateTimePickerProps> = ({
  date,
  onDateChange,
  time,
  onTimeChange,
  duration,
  onDurationChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date*</Label>
        <div className="border rounded-md p-2 max-w-full overflow-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            locale={fr}
            className="mx-auto"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="time">Heure*</Label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              id="time"
              type="time"
              value={time}
              onChange={onTimeChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Durée (minutes)*</Label>
          <Select 
            value={duration}
            onValueChange={onDurationChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">1 heure</SelectItem>
              <SelectItem value="90">1h30</SelectItem>
              <SelectItem value="120">2 heures</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDateTimePicker;
