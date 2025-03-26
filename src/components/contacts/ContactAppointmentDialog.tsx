
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppointmentForm } from "@/components/appointments/hooks/useAppointmentForm";
import AppointmentTypeSelect from "@/components/appointments/components/AppointmentTypeSelect";
import AppointmentDescription from "@/components/appointments/components/AppointmentDescription";
import AppointmentDateTimePicker from "@/components/appointments/components/AppointmentDateTimePicker";

interface ContactAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  initialType?: string;
  autoAssign?: boolean;
}

const ContactAppointmentDialog: React.FC<ContactAppointmentDialogProps> = ({
  open,
  onOpenChange,
  contactId,
  contactName,
  initialType = "consultation-initiale",
  autoAssign = false
}) => {
  // Utiliser le hook de formulaire pour les rendez-vous avec données explicites
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
  } = useAppointmentForm(
    open ? new Date() : undefined, // Réinitialiser la date à chaque ouverture du dialogue
    () => onOpenChange(false), 
    contactId,
    autoAssign
  );

  // Définir le type initial lors de l'ouverture du dialogue
  React.useEffect(() => {
    if (open && initialType) {
      setTitleOption(initialType);
      
      // Si c'est une consultation initiale, ajouter une description automatique
      if (initialType === "consultation-initiale") {
        setDescription(`Consultation initiale avec ${contactName} pour évaluer les besoins du client.`);
      }
    }
  }, [open, initialType, setTitleOption, contactName, setDescription]);

  // Gérer la soumission du formulaire en incluant l'ID du contact
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId) {
      console.error("ID de contact manquant pour la création du rendez-vous");
      return;
    }
    handleSubmit(e);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Planifier un rendez-vous avec {contactName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleFormSubmit}>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Planification..." : "Planifier le rendez-vous"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactAppointmentDialog;
