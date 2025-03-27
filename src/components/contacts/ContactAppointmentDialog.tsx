
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { useAppointmentForm, AppointmentTitleOption } from "@/hooks/appointments/useAppointmentForm";
import AppointmentTypeSelect from "@/components/appointments/components/AppointmentTypeSelect";
import AppointmentDescription from "@/components/appointments/components/AppointmentDescription";
import AppointmentDateTimePicker from "@/components/appointments/components/AppointmentDateTimePicker";
import { toast } from "sonner";

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
  
  const handleSuccess = () => {
    console.log("Rendez-vous créé avec succès pour", contactName);
    setSuccess(true);
    
    // Annoncer l'événement pour que les autres composants puissent réagir
    window.dispatchEvent(new CustomEvent('appointment-created'));
    
    // Fermer automatiquement après un délai
    setTimeout(() => {
      onOpenChange(false);
      setSuccess(false);
    }, 2000);
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
    folder,
    setFolder,
    isSubmitting,
    handleSubmit: formSubmit,
    defaultFreelancer,
    isLoadingFreelancer
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
    }
  }, [open, initialType, setTitleOption, setDescription, setDate, setTime, setDuration, setCustomTitle]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactId) {
      toast.error("ID de contact manquant");
      return;
    }
    
    console.log("ContactAppointmentDialog: Soumission du formulaire pour le contact:", contactId);
    
    // Vérifier que tous les champs requis sont remplis
    if (!date || !time) {
      toast.error("Veuillez remplir tous les champs obligatoires");
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
    <Dialog open={open} onOpenChange={(value) => {
      if (!isSubmitting) {
        onOpenChange(value);
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        {success ? (
          <div className="py-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CalendarClock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Rendez-vous planifié</h3>
              <p className="text-sm text-muted-foreground">
                Un rendez-vous a été planifié avec {contactName}.
              </p>
            </div>
          </div>
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
            
            <form onSubmit={handleFormSubmit}>
              <div className="grid gap-4 py-4">
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
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isLoadingFreelancer}
                >
                  {isSubmitting ? "Planification..." : "Planifier le rendez-vous"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactAppointmentDialog;
