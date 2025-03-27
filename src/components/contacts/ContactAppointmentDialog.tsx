
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { createAppointment } from "@/services/appointments/create";
import { appointmentFormSchema, AppointmentFormValues } from "@/hooks/appointments/useAppointmentForm";
import FolderSelect from "../appointments/components/FolderSelect";
import { AppointmentStatus } from "@/types/appointment";

// Définir les types manquants
interface CreateAppointmentInput {
  title: string;
  description?: string;
  date: string;
  duration: number;
  contactId: string;
  freelancerId: string;
  location?: string;
  notes?: string;
  status: AppointmentStatus;
  folder?: string;
}

// Types de rendez-vous prédéfinis
const APPOINTMENT_TYPES = [
  {
    id: "consultation-initiale",
    title: "Consultation Initiale",
    description: "Premier rendez-vous pour discuter des besoins du client",
    duration: 60,
  },
  {
    id: "suivi-projet",
    title: "Suivi de Projet",
    description: "Point d'étape sur l'avancement du projet",
    duration: 45,
  },
  {
    id: "presentation-devis",
    title: "Présentation de Devis",
    description: "Présentation et discussion du devis proposé",
    duration: 30,
  },
];

interface ContactAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  initialType?: string;
  autoAssign?: boolean; // Ajout du prop autoAssign
}

const ContactAppointmentDialog: React.FC<ContactAppointmentDialogProps> = ({
  open,
  onOpenChange,
  contactId,
  contactName,
  initialType,
  autoAssign = false, // Valeur par défaut à false
}) => {
  const { user } = useAuth();
  
  // Trouver le type initial de rendez-vous s'il est fourni
  const initialAppointmentType = initialType 
    ? APPOINTMENT_TYPES.find(type => type.id === initialType) 
    : undefined;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      title: initialAppointmentType?.title || "",
      description: initialAppointmentType?.description || "",
      date: new Date().toISOString(),
      duration: initialAppointmentType?.duration || 60,
      contactId: contactId,
      freelancerId: user?.id || "",
      status: autoAssign ? "pending" : "scheduled", // Utiliser un statut différent si auto-assigné
      folder: "general" // Valeur par défaut pour le dossier
    },
  });

  // Appliquer un type de rendez-vous prédéfini
  const applyAppointmentType = (typeId: string) => {
    const appointmentType = APPOINTMENT_TYPES.find(type => type.id === typeId);
    if (appointmentType) {
      setValue("title", appointmentType.title);
      setValue("description", appointmentType.description);
      setValue("duration", appointmentType.duration);
    }
  };

  // Gérer la soumission du formulaire
  const onSubmit = async (data: AppointmentFormValues) => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer un rendez-vous");
      return;
    }

    try {
      // S'assurer que les champs requis sont présents
      const appointmentData: CreateAppointmentInput = {
        title: data.title,
        description: data.description,
        date: data.date,
        duration: data.duration,
        contactId: data.contactId,
        freelancerId: data.freelancerId || user.id,
        location: data.location,
        notes: data.notes,
        status: data.status as AppointmentStatus,
        folder: data.folder
      };

      const result = await createAppointment(appointmentData);

      if (result) {
        toast.success("Rendez-vous créé avec succès");
        reset();
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`);
    }
  };

  // Réinitialiser le formulaire à la fermeture
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Planifier un rendez-vous</DialogTitle>
          <DialogDescription>
            Planifier un rendez-vous avec {contactName}
            {autoAssign && " (Assignation automatique à un freelancer)"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {/* Types de rendez-vous prédéfinis */}
          <div className="space-y-2">
            <Label>Type de rendez-vous</Label>
            <div className="flex flex-wrap gap-2">
              {APPOINTMENT_TYPES.map((type) => (
                <Button
                  key={type.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyAppointmentType(type.id)}
                >
                  {type.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Titre du rendez-vous */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              placeholder="Titre du rendez-vous"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description du rendez-vous"
              {...register("description")}
              rows={3}
            />
          </div>

          {/* Date et heure */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date.toISOString());
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            {/* Durée */}
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Controller
                control={control}
                name="duration"
                render={({ field }) => (
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    step="15"
                    value={field.value}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                )}
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration.message}</p>
              )}
            </div>
          </div>

          {/* Lieu */}
          <div className="space-y-2">
            <Label htmlFor="location">Lieu (optionnel)</Label>
            <Input
              id="location"
              placeholder="En ligne, bureau, etc."
              {...register("location")}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Informations supplémentaires"
              {...register("notes")}
              rows={2}
            />
          </div>

          {/* Dossier */}
          <Controller
            control={control}
            name="folder"
            render={({ field }) => (
              <FolderSelect 
                value={field.value}
                onChange={field.onChange}
                label="Dossier"
                description="Classer ce rendez-vous dans un dossier spécifique"
              />
            )}
          />

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer le rendez-vous"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactAppointmentDialog;
