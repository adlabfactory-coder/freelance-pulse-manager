
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarClock } from "lucide-react";
import { useAppointmentForm, AppointmentTitleOption } from "@/hooks/appointments/useAppointmentForm";
import { toast } from "sonner";
import ContactAppointmentSuccess from "./appointment/ContactAppointmentSuccess";
import ContactAppointmentForm from "./appointment/ContactAppointmentForm";
import { AppointmentStatus } from "@/types/database/enums";

interface ContactAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  initialType?: AppointmentTitleOption;
  autoAssign?: boolean;
}

const ContactAppointmentDialog: React.FC<ContactAppointmentDialogProps> = ({
  open,
  onOpenChange,
  contactId,
  contactName,
  initialType = 'consultation-initiale',
  autoAssign = false
}) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSuccess = () => {
    console.log("Rendez-vous créé avec succès pour", contactName);
    setSuccess(true);
    setError(null);
    
    // Annoncer l'événement pour que les autres composants puissent réagir
    window.dispatchEvent(new CustomEvent('appointment-created'));
    
    toast.success(`Rendez-vous planifié avec ${contactName}`);
    
    // Fermer automatiquement après un délai
    setTimeout(() => {
      onOpenChange(false);
      setSuccess(false);
    }, 2000);
  };
  
  const handleError = (errorMessage: string) => {
    console.error("Erreur lors de la création du rendez-vous:", errorMessage);
    setError(errorMessage);
    setSuccess(false);
    toast.error("Erreur: " + errorMessage);
  };
  
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
    contacts,
    contactId: formContactId,
    setContactId: setFormContactId,
    isSubmitting,
    handleSubmit: formSubmit,
    defaultFreelancer,
    isLoadingFreelancer,
    APPOINTMENT_TITLE_OPTIONS
  } = useAppointmentForm(
    undefined, 
    handleSuccess, 
    contactId,
    autoAssign
  );

  // Réinitialiser le formulaire lorsque la boîte de dialogue s'ouvre
  useEffect(() => {
    if (open) {
      setTitleOption(initialType || 'consultation-initiale');
      setDescription('');
      setDate(new Date());
      setTime('10:00');
      setDuration(30);
      setCustomTitle('');
      setSuccess(false);
      setError(null);
      // Définir explicitement l'ID du contact
      setFormContactId(contactId);
    }
  }, [open, initialType, contactId, setTitleOption, setDescription, setDate, setTime, setDuration, setCustomTitle, setFormContactId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formContactId) {
      handleError("ID de contact manquant");
      return;
    }
    
    console.log("ContactAppointmentDialog: Soumission du formulaire pour le contact:", formContactId);
    
    // Vérifier que tous les champs requis sont remplis
    if (!date || !time) {
      handleError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      // Passer l'ID du contact lors de la soumission
      await formSubmit(e, formContactId);
    } catch (error) {
      handleError(error instanceof Error ? error.message : "Erreur inconnue");
    }
  };

  const handleTitleOptionChange = (value: string) => {
    setTitleOption(value as AppointmentTitleOption);
  };

  const handleDurationChange = (value: string) => {
    setDuration(parseInt(value, 10));
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!isSubmitting) {
        onOpenChange(value);
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        {success ? (
          <ContactAppointmentSuccess contactName={contactName} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5" />
                Planifier un rendez-vous
              </DialogTitle>
              <DialogDescription>
                Planifier un rendez-vous avec {contactName}
              </DialogDescription>
            </DialogHeader>
            
            <ContactAppointmentForm 
              titleOption={titleOption}
              onTitleOptionChange={handleTitleOptionChange}
              customTitle={customTitle}
              onCustomTitleChange={(e) => setCustomTitle(e.target.value)}
              description={description}
              onDescriptionChange={(e) => setDescription(e.target.value)}
              date={date}
              onDateChange={setDate}
              time={time}
              onTimeChange={(e) => setTime(e.target.value)}
              duration={duration.toString()}
              onDurationChange={handleDurationChange}
              onSubmit={handleFormSubmit}
              onCancel={() => onOpenChange(false)}
              isSubmitting={isSubmitting}
              error={error}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactAppointmentDialog;
