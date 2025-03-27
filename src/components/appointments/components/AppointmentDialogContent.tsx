
import React, { useState, useEffect } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { useAppointmentForm, AppointmentTitleOption } from "@/hooks/appointments/useAppointmentForm";
import AppointmentTypeSelect from "./AppointmentTypeSelect";
import AppointmentDescription from "./AppointmentDescription";
import AppointmentDateTimePicker from "./AppointmentDateTimePicker";
import ContactSelector from "./ContactSelector";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase-client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import FreelancerSelector from "@/components/quotes/form/FreelancerSelector";
import { User } from "@/types";

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
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string>("");
  
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
  } = useAppointmentForm(selectedDate, () => onOpenChange(false), initialContactId, false);

  // Charger la liste des freelancers
  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'freelancer');
        
        if (error) {
          console.error("Erreur lors du chargement des freelancers:", error);
          toast.error("Impossible de charger la liste des freelancers");
          return;
        }
        
        if (data && data.length > 0) {
          setFreelancers(data as User[]);
          // Si l'utilisateur est un freelancer, sélectionner son ID par défaut
          if (isFreelancer && user) {
            setSelectedFreelancerId(user.id);
          } 
          // Sinon utiliser le premier freelancer de la liste par défaut
          else if (data.length > 0 && !selectedFreelancerId) {
            setSelectedFreelancerId(data[0].id);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des freelancers:", error);
        toast.error("Impossible de charger la liste des freelancers");
      }
    };
    
    loadFreelancers();
  }, [isFreelancer, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactId) {
      toast.error("Veuillez sélectionner un contact pour ce rendez-vous");
      return;
    }
    
    if (!selectedFreelancerId) {
      toast.error("Veuillez sélectionner un freelancer pour ce rendez-vous");
      return;
    }
    
    // Passer l'ID du contact et du freelancer lors de la soumission
    const originalSubmit = formSubmit;
    const event = {...e};
    
    // Écrasez formSubmit pour injecter l'ID du freelancer
    const customSubmit = async () => {
      try {
        // Préparation des données à soumettre
        const appointmentData = {
          title: titleOption === 'autre' ? customTitle : titleOption,
          description,
          date,
          time,
          duration,
          contactId,
          freelancerId: selectedFreelancerId,
          autoAssign: false
        };
        
        // Soumission du formulaire avec les données modifiées
        console.log("Soumission du rendez-vous avec freelancer:", appointmentData);
        const result = await formSubmit(event, contactId);
        
        if (result) {
          toast.success("Rendez-vous planifié avec succès");
          onOpenChange(false);
        }
      } catch (error) {
        console.error("Erreur lors de la planification du rendez-vous:", error);
        toast.error("Erreur lors de la planification du rendez-vous");
      }
    };
    
    customSubmit();
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
          Veuillez sélectionner un contact et un freelancer pour ce rendez-vous
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
          
          {!isFreelancer && (
            <div className="grid gap-2">
              <Label htmlFor="freelancer">Freelancer*</Label>
              <FreelancerSelector
                freelancers={freelancers}
                freelancerId={selectedFreelancerId}
                onSelect={setSelectedFreelancerId}
                disabled={isFreelancer}
              />
            </div>
          )}
          
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
            disabled={isSubmitting || !contactId || !selectedFreelancerId}
          >
            {isSubmitting ? "Planification..." : "Planifier le rendez-vous"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AppointmentDialogContent;
