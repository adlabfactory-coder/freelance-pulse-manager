
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SubscriptionInterval } from '@/types/subscription';

const SubscriptionPlanFormFields = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom du plan</FormLabel>
            <FormControl>
              <Input placeholder="Nom du plan" {...field} />
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
            <FormLabel>Code du plan</FormLabel>
            <FormControl>
              <Input placeholder="Code du plan (ex: basic, premium)" {...field} />
            </FormControl>
            <FormDescription>
              Un identifiant unique pour ce plan (utilisé en interne)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Description du plan d'abonnement" 
                {...field} 
                value={field.value || ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex flex-col md:flex-row gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Prix (€)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  {...field} 
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      field.onChange(0);
                    } else {
                      field.onChange(parseFloat(value));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="interval"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Intervalle</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un intervalle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={SubscriptionInterval.MONTHLY}>Mensuel</SelectItem>
                  <SelectItem value={SubscriptionInterval.QUARTERLY}>Trimestriel</SelectItem>
                  <SelectItem value={SubscriptionInterval.BIANNUAL}>Semestriel</SelectItem>
                  <SelectItem value={SubscriptionInterval.ANNUAL}>Annuel</SelectItem>
                  <SelectItem value={SubscriptionInterval.YEARLY}>Annuel (alt.)</SelectItem>
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
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Plan actif</FormLabel>
              <FormDescription>
                Ce plan sera visible et disponible pour les clients
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default SubscriptionPlanFormFields;
