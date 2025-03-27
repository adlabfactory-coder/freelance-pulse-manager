
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { createAppointment } from '@/services/appointments/create';

export const appointmentFormSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  date: z.string().min(1, 'La date est requise'),
  duration: z.number().min(1, 'La durée est requise'),
  contactId: z.string().min(1, 'Le contact est requis'),
  freelancerId: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().default('pending'),
  folder: z.string().default('general')
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormInput {
  title: string;
  description?: string;
  date: string;
  duration: number;
  contactId: string;
  freelancerId?: string;
  location?: string;
  notes?: string;
  status: AppointmentStatus;
  folder: string;
}

export const useAppointmentForm = (
  onSuccess?: (data?: Appointment) => void,
  initialData?: Partial<AppointmentFormValues>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      date: initialData?.date || new Date().toISOString(),
      duration: initialData?.duration || 60,
      contactId: initialData?.contactId || '',
      freelancerId: initialData?.freelancerId || (user ? user.id : ''),
      location: initialData?.location || '',
      notes: initialData?.notes || '',
      status: initialData?.status || 'pending',
      folder: initialData?.folder || 'general'
    }
  });

  const handleSubmit = async (values: AppointmentFormValues) => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer un rendez-vous');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // S'assurer que toutes les données requises sont présentes
      const appointmentInput = {
        title: values.title,
        description: values.description,
        date: values.date,
        duration: values.duration,
        contact_id: values.contactId, // Conversion de contactId à contact_id pour correspondre à AppointmentCreateData
        freelancer_id: values.freelancerId || user.id, // Conversion de freelancerId à freelancer_id
        location: values.location,
        notes: values.notes,
        status: values.status as AppointmentStatus,
        folder: values.folder || 'general',
        current_user_id: user.id
      };
      
      console.log("Préparation données rendez-vous:", appointmentInput);
      
      const result = await createAppointment(appointmentInput);
      
      if (result) {
        toast.success('Rendez-vous créé avec succès');
        form.reset();
        
        if (onSuccess) {
          onSuccess(result);
        }
      }
    } catch (error: any) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      toast.error(`Erreur: ${error.message || 'Une erreur est survenue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(handleSubmit)
  };
};
