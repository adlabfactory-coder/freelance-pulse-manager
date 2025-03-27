
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "./schema/contactFormSchema";
import { Loader2 } from "lucide-react";
import ContactStatusSelector from "./ContactStatusSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase-client";
import { User } from "@/types";
import { useAuth } from "@/hooks/use-auth";

interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  submitLabel?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  form,
  isSubmitting,
  onSubmit,
  onCancel,
  isEditing = false,
  submitLabel = "Soumettre"
}) => {
  const { user } = useAuth();
  const isFreelancer = user?.role === 'freelancer';
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [isLoadingFreelancers, setIsLoadingFreelancers] = useState(false);

  // Charger la liste des freelancers
  useEffect(() => {
    const loadFreelancers = async () => {
      setIsLoadingFreelancers(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'freelancer');
        
        if (error) {
          console.error("Erreur lors du chargement des freelancers:", error);
          return;
        }
        
        if (data) {
          setFreelancers(data as User[]);
          
          // Si c'est un nouveau contact et que l'utilisateur est freelancer, on pré-sélectionne son ID
          if (!isEditing && isFreelancer && user) {
            form.setValue('assignedTo', user.id);
          }
          // Si c'est un nouveau contact et qu'on n'a pas d'assignation, on prend le premier freelancer
          else if (!isEditing && !form.getValues('assignedTo') && data.length > 0) {
            form.setValue('assignedTo', data[0].id);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des freelancers:", error);
      } finally {
        setIsLoadingFreelancers(false);
      }
    };
    
    loadFreelancers();
  }, [isFreelancer, user, isEditing, form]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom*</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du contact" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="Téléphone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="Entreprise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poste</FormLabel>
                  <FormControl>
                    <Input placeholder="Poste occupé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="Adresse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigné à*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={isFreelancer} // Désactiver si l'utilisateur est un freelancer
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un freelancer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {freelancers.map(freelancer => (
                      <SelectItem key={freelancer.id} value={freelancer.id}>
                        {freelancer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <ContactStatusSelector
                    value={field.value}
                    onChange={field.onChange}
                    currentStatus={field.value}
                    onStatusChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notes additionnelles..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                En cours...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
