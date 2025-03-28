
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SubscriptionInterval } from "@/types/subscription";
import { UseFormReturn } from 'react-hook-form';
import { PlanFormValues } from './types';

interface SubscriptionPlanFormFieldsProps {
  form: UseFormReturn<PlanFormValues>;
}

const SubscriptionPlanFormFields: React.FC<SubscriptionPlanFormFieldsProps> = ({ form }) => {
  return (
    <>
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
                  <SelectItem value={SubscriptionInterval.MONTHLY}>Mensuel</SelectItem>
                  <SelectItem value={SubscriptionInterval.QUARTERLY}>Trimestriel</SelectItem>
                  <SelectItem value={SubscriptionInterval.BIANNUAL}>Semestriel</SelectItem>
                  <SelectItem value={SubscriptionInterval.ANNUAL}>Annuel</SelectItem>
                  <SelectItem value={SubscriptionInterval.YEARLY}>Annuel</SelectItem>
                  <SelectItem value={SubscriptionInterval.CUSTOM}>Personnalisé</SelectItem>
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
    </>
  );
};

export default SubscriptionPlanFormFields;
