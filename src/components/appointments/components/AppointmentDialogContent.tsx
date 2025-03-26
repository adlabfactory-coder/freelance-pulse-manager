
import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import AppointmentTypeSelect from "./AppointmentTypeSelect";
import AppointmentDescription from "./AppointmentDescription";
import AppointmentDateTimePicker from "./AppointmentDateTimePicker";
import { useAppointmentForm } from "../hooks/useAppointmentForm";

interface AppointmentDialogContentProps {
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

const AppointmentDialogContent: React.FC<AppointmentDialogContentProps> = ({
  onOpenChange,
  selectedDate
}) => {
  const {
    titleOption,
    setTitleOption,
    customTitle,
    setCustomTitle,
    description,
    setDescription,
    date,
    setDate,
    time,
    setTime,
    duration,
    setDuration,
    isSubmitting,
    handleSubmit
  } = useAppointmentForm(selectedDate, () => onOpenChange(false));

  return (
    <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-full">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CalendarPlus className="h-5 w-5" />
          Nouveau rendez-vous
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <AppointmentTypeSelect
            titleOption={titleOption}
            onTitleOptionChange={setTitleOption}
            customTitle={customTitle}
            onCustomTitleChange={(e) => setCustomTitle(e.target.value)}
          />
          
          <AppointmentDescription
            description={description}
            onDescriptionChange={(e) => setDescription(e.target.value)}
          />
          
          <AppointmentDateTimePicker
            date={date}
            onDateChange={setDate}
            time={time}
            onTimeChange={(e) => setTime(e.target.value)}
            duration={duration}
            onDurationChange={setDuration}
          />
        </div>
        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Planification..." : "Planifier le rendez-vous"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AppointmentDialogContent;
