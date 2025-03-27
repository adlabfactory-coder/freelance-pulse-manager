
import React from "react";
import { Button } from "@/components/ui/button";
import { AppointmentTitleOption } from "@/hooks/appointments/useAppointmentForm";
import AppointmentTypeSelect from "@/components/appointments/components/AppointmentTypeSelect";
import AppointmentDescription from "@/components/appointments/components/AppointmentDescription";
import AppointmentDateTimePicker from "@/components/appointments/components/AppointmentDateTimePicker";

interface ContactAppointmentFormProps {
  titleOption: AppointmentTitleOption;
  onTitleOptionChange: (value: string) => void;
  customTitle: string;
  onCustomTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  time: string;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  duration: string;
  onDurationChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
}

const ContactAppointmentForm: React.FC<ContactAppointmentFormProps> = ({
  titleOption,
  onTitleOptionChange,
  customTitle,
  onCustomTitleChange,
  description,
  onDescriptionChange,
  date,
  onDateChange,
  time,
  onTimeChange,
  duration,
  onDurationChange,
  onSubmit,
  onCancel,
  isSubmitting,
  error
}) => {
  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          <AppointmentTypeSelect
            titleOption={titleOption}
            onTitleOptionChange={onTitleOptionChange}
            customTitle={customTitle}
            onCustomTitleChange={onCustomTitleChange}
          />
          
          <AppointmentDescription
            description={description}
            onDescriptionChange={onDescriptionChange}
          />
          
          <AppointmentDateTimePicker
            date={date}
            onDateChange={onDateChange}
            time={time}
            onTimeChange={onTimeChange}
            duration={duration}
            onDurationChange={onDurationChange}
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Planification..." : "Planifier le rendez-vous"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ContactAppointmentForm;
