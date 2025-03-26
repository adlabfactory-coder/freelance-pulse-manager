
// Fonctions de validation pour les rendez-vous
export const validateAppointmentDate = (date: string | Date): boolean => {
  const appointmentDate = new Date(date);
  return !isNaN(appointmentDate.getTime());
};

export const validateAppointmentFields = (
  title: string,
  date: string | Date,
  duration: number
): { valid: boolean; message?: string } => {
  if (!title || title.trim() === '') {
    return { valid: false, message: "Le titre du rendez-vous est requis" };
  }

  if (!validateAppointmentDate(date)) {
    return { valid: false, message: "La date du rendez-vous est invalide" };
  }

  if (!duration || duration <= 0) {
    return { valid: false, message: "La durée du rendez-vous doit être positive" };
  }

  return { valid: true };
};
