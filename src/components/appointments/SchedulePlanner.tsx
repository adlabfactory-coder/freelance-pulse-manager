
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useSupabase } from "@/hooks/use-supabase";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const APPOINTMENT_TITLE_OPTIONS = [
  { value: "consultation-initiale", label: "Consultation initiale" },
  { value: "negociation-devis", label: "Négociation devis" },
  { value: "relance-paiement", label: "Relance de paiement" },
  { value: "autre", label: "Autre (personnalisé)" }
];

const SchedulePlanner: React.FC = () => {
  const supabase = useSupabase();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [titleOption, setTitleOption] = useState("consultation-initiale");
  const [customTitle, setCustomTitle] = useState("");
  const [appointmentDescription, setAppointmentDescription] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("09:00");
  const [appointmentDuration, setAppointmentDuration] = useState("60");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const title = titleOption === "autre" ? customTitle : 
      APPOINTMENT_TITLE_OPTIONS.find(option => option.value === titleOption)?.label || "";
    
    if (!selectedDate || !title) {
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
      const dateTimeString = format(selectedDate, "yyyy-MM-dd") + "T" + appointmentTime;
      const appointmentDateTime = new Date(dateTimeString);
      
      // Simuler l'enregistrement pour la démo
      // For demo, just show a success message
      toast({
        title: "Rendez-vous planifié",
        description: `${title} planifié le ${format(appointmentDateTime, "dd/MM/yyyy à HH:mm", { locale: fr })}`,
      });
      
      // Réinitialiser le formulaire
      setTitleOption("consultation-initiale");
      setCustomTitle("");
      setAppointmentDescription("");
      setAppointmentTime("09:00");
      setAppointmentDuration("60");
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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Planifier un rendez-vous</CardTitle>
        <CardDescription>
          Créez et gérez vos rendez-vous directement dans l'application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
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
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={appointmentDescription}
                    onChange={(e) => setAppointmentDescription(e.target.value)}
                    placeholder="Détails du rendez-vous..."
                    className="resize-none h-20"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">Heure *</Label>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="time"
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée (minutes) *</Label>
                    <Select 
                      defaultValue={appointmentDuration}
                      onValueChange={setAppointmentDuration}
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
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Planification..." : "Planifier le rendez-vous"}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="border rounded-md p-4"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchedulePlanner;
