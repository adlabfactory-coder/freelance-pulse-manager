
import { z } from 'zod';
import { SubscriptionInterval, SubscriptionPlan } from '@/types/subscription';

export const planFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  code: z.string().min(1, 'Le code est requis'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Le prix doit être positif'),
  interval: z.enum([SubscriptionInterval.MONTHLY, SubscriptionInterval.QUARTERLY, 
                   SubscriptionInterval.BIANNUAL, SubscriptionInterval.ANNUAL, 
                   SubscriptionInterval.YEARLY, SubscriptionInterval.CUSTOM]),
  isActive: z.boolean().default(true),
  features: z.array(z.string()).optional()
});

export type PlanFormValues = z.infer<typeof planFormSchema>;

export interface SubscriptionPlanFormProps {
  plan?: SubscriptionPlan | null;
  onSuccess: () => void;
  onCancel: () => void;
}
