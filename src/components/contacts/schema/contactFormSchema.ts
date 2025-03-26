
import { z } from "zod";
import { ContactStatus } from "@/types/database/enums";

// Schéma de validation pour le formulaire de contact
export const contactSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["lead", "prospect", "negotiation", "signed", "lost"]),
  notes: z.string().optional(),
  // Ajout de assignedTo au schéma
  assignedTo: z.string()
});

// Type pour les valeurs du formulaire
export type ContactFormValues = z.infer<typeof contactSchema>;
