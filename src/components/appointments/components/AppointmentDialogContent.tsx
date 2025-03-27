
import React, { useState, useEffect } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { useAppointmentForm, AppointmentTitleOption } from "../hooks/useAppointmentForm";
import AppointmentTypeSelect from "./AppointmentTypeSelect";
import AppointmentDescription from "./AppointmentDescription";
import AppointmentDateTimePicker from "./AppointmentDateTimePicker";
import ContactSelector from "./ContactSelector";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";

interface AppointmentDialogContentProps {
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  initialContactId?: string;
}

const AppointmentDialogContent: React.FC<AppointmentDialogContentProps> = ({
  onOpenChange,
  selectedDate,
  initialContactId
}) => {
  const { user } = useAuth();
  const isFreelancer = user?.role === 'freelancer';
  const isAccountManager = user?.role === 'account_manager';
  const [contactId, setContactId] = useState(initialContactId || "");
  
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
    handleSubmit: formSubmit,
    defaultFreelancer
  } = useAppointmentForm(selectedDate, () => onOpenChange(false), initialContactId, !isFreelancer);

  // Utilisation pour le débogage
  useEffect(() => {
    if (defaultFreelancer) {
      console.log("Freelancer par défaut assigné:", defaultFreelancer);
    }
  }, [defaultFreelancer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactId) {
      toast.error("Veuillez sélectionner un contact pour ce rendez-vous");
      return;
    }
    
    // Passer l'ID du contact lors de la soumission
    formSubmit(e, contactId);
  };

  const handleTitleOptionChange = (value: string) => {
    setTitleOption(value as AppointmentTitleOption);
  };

  const handleDurationChange = (value: string) => {
    setDuration(parseInt(value, 10));
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Planifier un nouveau rendez-vous
        </DialogTitle>
        <DialogDescription>
          {isFreelancer 
            ? "Ce rendez-vous vous sera attribué directement" 
            : isAccountManager
              ? "Vous pouvez planifier un rendez-vous qui sera assigné à un freelancer disponible"
              : "Ce rendez-vous sera assigné à un freelancer disponible"}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="contact" className="text-sm font-medium">
              Contact *
            </label>
            <ContactSelector 
              value={contactId} 
              onChange={setContactId} 
              placeholder="Sélectionner un contact"
            />
          </div>
          
          <AppointmentTypeSelect
            titleOption={titleOption}
            onTitleOptionChange={handleTitleOptionChange}
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
            duration={duration.toString()}
            onDurationChange={handleDurationChange}
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !contactId}
          >
            {isSubmitting ? "Planification..." : "Planifier le rendez-vous"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AppointmentDialogContent;
