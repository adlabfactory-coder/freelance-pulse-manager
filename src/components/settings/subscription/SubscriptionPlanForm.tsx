
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { SubscriptionInterval } from '@/types/subscription';
import { createSubscriptionPlan, updateSubscriptionPlan } from '@/services/subscriptions';
import { PlanFormValues, planFormSchema, SubscriptionPlanFormProps } from './types';
import SubscriptionPlanFormFields from './SubscriptionPlanFormFields';
import SubscriptionPlanFeatures from './SubscriptionPlanFeatures';
import FormActions from './FormActions';

const SubscriptionPlanForm: React.FC<SubscriptionPlanFormProps> = ({ plan, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [features, setFeatures] = useState<string[]>(
    plan?.features 
      ? (Array.isArray(plan.features) 
        ? plan.features 
        : (plan.features.features || [])) 
      : []
  );

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: plan?.name || '',
      code: plan?.code || '',
      description: plan?.description || '',
      price: plan?.price || 0,
      interval: plan?.interval || SubscriptionInterval.MONTHLY,
      isActive: plan?.isActive !== undefined ? plan.isActive : true,
      features: features
    }
  });

  const handleFeaturesChange = (updatedFeatures: string[]) => {
    setFeatures(updatedFeatures);
    form.setValue('features', updatedFeatures);
  };

  const onSubmit = async (data: PlanFormValues) => {
    setIsSubmitting(true);
    try {
      if (plan) {
        // Mise à jour d'un plan existant
        const success = await updateSubscriptionPlan(plan.id, {
          name: data.name,
          code: data.code,
          description: data.description || '',
          price: data.price,
          interval: data.interval as SubscriptionInterval,
          isActive: data.isActive,
          features: features
        });
        
        if (success) {
          toast.success('Plan d\'abonnement mis à jour avec succès');
          onSuccess();
        } else {
          toast.error('Échec de la mise à jour du plan');
        }
      } else {
        // Création d'un nouveau plan
        const result = await createSubscriptionPlan({
          name: data.name,
          code: data.code,
          description: data.description || '',
          price: data.price,
          interval: data.interval as SubscriptionInterval,
          isActive: data.isActive,
          features: features
        });
        
        if (result.success) {
          toast.success('Plan d\'abonnement créé avec succès');
          onSuccess();
        } else {
          toast.error(`Échec de la création du plan: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Une erreur est survenue lors de l\'enregistrement du plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 border rounded-md">
      <h3 className="text-lg font-medium">
        {plan ? 'Modifier le plan d\'abonnement' : 'Ajouter un plan d\'abonnement'}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SubscriptionPlanFormFields form={form} />
          
          <SubscriptionPlanFeatures 
            features={features} 
            onFeaturesChange={handleFeaturesChange} 
          />
          
          <FormActions 
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            isEditing={!!plan}
          />
        </form>
      </Form>
    </div>
  );
};

export default SubscriptionPlanForm;
