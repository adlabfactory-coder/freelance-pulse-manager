
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Trash } from 'lucide-react';
import { SubscriptionInterval, SubscriptionPlan } from '@/types/subscription';
import { createSubscriptionPlan, updateSubscriptionPlan } from '@/services/subscriptions';
import { toast } from 'sonner';

interface SubscriptionPlanFormProps {
  plan?: SubscriptionPlan | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const planFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  code: z.string().min(1, 'Le code est requis'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Le prix doit être positif'),
  interval: z.enum(['monthly', 'quarterly', 'biannual', 'annual', 'yearly', 'custom']),
  isActive: z.boolean().default(true),
  features: z.array(z.string()).optional()
});

type PlanFormValues = z.infer<typeof planFormSchema>;

const SubscriptionPlanForm: React.FC<SubscriptionPlanFormProps> = ({ plan, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [features, setFeatures] = useState<string[]>(
    plan?.features 
      ? (Array.isArray(plan.features) 
        ? plan.features 
        : (plan.features.features || [])) 
      : []
  );
  const [newFeature, setNewFeature] = useState('');

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: plan?.name || '',
      code: plan?.code || '',
      description: plan?.description || '',
      price: plan?.price || 0,
      interval: plan?.interval || 'monthly',
      isActive: plan?.isActive !== undefined ? plan.isActive : true,
      features: features
    }
  });

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature]);
      form.setValue('features', [...features, newFeature]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
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
          interval: data.interval,
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
          interval: data.interval,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du plan*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Plan Basique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: BASIC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description du plan d'abonnement" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix (MAD)*</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervalle*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un intervalle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="quarterly">Trimestriel</SelectItem>
                      <SelectItem value="biannual">Semestriel</SelectItem>
                      <SelectItem value="annual">Annuel</SelectItem>
                      <SelectItem value="yearly">Annuel</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Actif</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Indique si le plan est actuellement disponible pour les clients
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-4">
            <div>
              <FormLabel>Fonctionnalités</FormLabel>
              <div className="flex mt-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Ajouter une fonctionnalité"
                  className="flex-1"
                />
                <Button type="button" onClick={addFeature} className="ml-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{feature}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {features.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucune fonctionnalité ajoutée pour l'instant.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                plan ? 'Mettre à jour' : 'Créer le plan'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SubscriptionPlanForm;
