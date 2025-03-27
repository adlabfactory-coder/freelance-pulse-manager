
// Export all necessary update functions for appointments
import { supabase } from "@/lib/supabase-client";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { toast } from "sonner";

// Update appointment status
export const updateAppointmentStatus = async (
  appointmentId: string,
  newStatus: AppointmentStatus
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status: newStatus, updatedAt: new Date().toISOString() })
      .eq("id", appointmentId)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Impossible de mettre à jour le statut du rendez-vous");
      return false;
    }

    const statusLabels: Record<AppointmentStatus, string> = {
      [AppointmentStatus.SCHEDULED]: "planifié",
      [AppointmentStatus.COMPLETED]: "terminé",
      [AppointmentStatus.CANCELLED]: "annulé",
      [AppointmentStatus.PENDING]: "en attente",
      [AppointmentStatus.RESCHEDULED]: "reporté",
      [AppointmentStatus.NO_SHOW]: "absent"
    };

    toast.success(`Rendez-vous ${statusLabels[newStatus] || newStatus}`);
    return true;
  } catch (error) {
    console.error("Unexpected error updating appointment status:", error);
    toast.error("Une erreur est survenue");
    return false;
  }
};

// Update entire appointment
export const updateAppointment = async (
  appointmentId: string,
  appointmentData: Partial<Omit<Appointment, "id" | "createdAt" | "updatedAt">>
): Promise<Appointment | null> => {
  try {
    // Always set updatedAt to now
    const updateData = {
      ...appointmentData,
      updatedAt: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", appointmentId)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating appointment:", error);
      toast.error("Impossible de mettre à jour le rendez-vous");
      return null;
    }

    toast.success("Rendez-vous mis à jour avec succès");
    return data as Appointment;
  } catch (error) {
    console.error("Unexpected error updating appointment:", error);
    toast.error("Une erreur est survenue");
    return null;
  }
};
