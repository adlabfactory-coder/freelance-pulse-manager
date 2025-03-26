
import React, { useState, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarPlus, Clock } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";
import { fr } from "date-fns/locale";
import { AppointmentStatus } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import appointmentService from "@/services/appointments";

const APPOINTMENT_TITLE_OPTIONS = [
  { value: "consultation-initiale", label: "Consultation initiale" },
  { value: "negociation-devis", label: "Négociation devis" },
  { value: "relance-paiement", label: "Relance de paiement" },
  { value: "autre", label: "Autre (personnalisé)" }
];

interface AddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({
  open,
  onOpenChange,
  selectedDate
}) => {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [titleOption, setTitleOption] = useState("consultation-initiale");
  const [customTitle, setCustomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(selectedDate || new Date());
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState("60");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const title = titleOption === "autre" ? customTitle : 
      APPOINTMENT_TITLE_OPTIONS.find(option => option.value === titleOption)?.label || "";
    
    if (!date || !title) {
      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Créer le format de date pour la base de données
      const dateTimeString = format(date, "yyyy-MM-dd") + "T" + time;
      const appointmentDateTime = new Date(dateTimeString);
      
      // Dans une application réelle, nous utiliserions appointmentService.createAppointment() 
      // Créer un rendez-vous
      const appointmentData = {
        title,
        description,
        date: appointmentDateTime.toISOString(),
        duration: parseInt(duration),
        status: AppointmentStatus.SCHEDULED,
        freelancerId: user?.id || '',
        contactId: '00000000-0000-0000-0000-000000000000', // À remplacer par un vrai ID
        location: null,
        notes: null
      };
      
      // Appel du service avec les données préparées
      const result = await appointmentService.createAppointment(appointmentData);
      
      if (!result) {
        throw new Error("Erreur lors de la création du rendez-vous");
      }
      
      // Message de succès
      toast({
        title: "Rendez-vous planifié",
        description: `${title} planifié le ${format(appointmentDateTime, "dd/MM/yyyy à HH:mm", { locale: fr })}`,
      });
      
      // Réinitialiser le formulaire et fermer la boîte de dialogue
      setTitleOption("consultation-initiale");
      setCustomTitle("");
      setDescription("");
      setTime("09:00");
      setDuration("60");
      onOpenChange(false);
      
      // Attendre un court instant avant de déclencher un événement personnalisé
      // pour rafraîchir les notifications
      setTimeout(() => {
        const event = new CustomEvent('appointment-created');
        window.dispatchEvent(event);
      }, 500);
      
    } catch (error) {
      console.error("Erreur lors de la planification du rendez-vous:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la planification du rendez-vous.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" />
            Nouveau rendez-vous
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="titleOption">Type de rendez-vous*</Label>
              <Select
                value={titleOption}
                onValueChange={setTitleOption}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type de rendez-vous" />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_TITLE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {titleOption === "autre" && (
                <div className="mt-2">
                  <Label htmlFor="customTitle">Titre personnalisé*</Label>
                  <Input
                    id="customTitle"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Entrez un titre personnalisé"
                    required={titleOption === "autre"}
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Détails du rendez-vous..."
                className="resize-none h-20"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date*</Label>
                <div className="border rounded-md p-2 max-w-full overflow-auto">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
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
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (minutes)*</Label>
                  <Select 
                    defaultValue={duration}
                    onValueChange={setDuration}
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
    </Dialog>
  );
};

export default AddAppointmentDialog;
