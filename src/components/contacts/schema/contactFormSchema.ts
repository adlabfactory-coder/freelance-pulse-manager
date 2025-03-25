
import { z } from "zod";
import { ContactStatus } from "@/types/database/enums";

export const contactSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Merci de saisir une adresse email valide.",
  }),
  phone: z.string().min(1, {
    message: "Le numéro de téléphone est obligatoire."
  }),
  company: z.string().optional(),
  position: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["lead", "prospect", "negotiation", "signed", "lost"]).default("lead"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
