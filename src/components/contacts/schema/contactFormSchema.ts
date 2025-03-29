
import { z } from "zod";
import { ContactStatus } from "@/types/database/enums";

export const contactSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  phone: z.string().optional(),
  company: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.string().default("lead").optional(),
  assignedTo: z.string().optional().nullable(),
  folder: z.string().default("general").optional()
});

export type ContactFormValues = z.infer<typeof contactSchema>;
