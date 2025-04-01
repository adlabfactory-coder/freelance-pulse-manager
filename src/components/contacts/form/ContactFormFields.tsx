
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactFormValues } from "../schema/contactFormSchema";
import { contactCreateUpdateService } from "@/services/contacts/contact-create-update";
import { useDebounce } from "@/hooks/use-debounce";

interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormValues>;
  contactId?: string; // Pour exclure le contact actuel lors de l'édition
}

const ContactFormFields: React.FC<ContactFormFieldsProps> = ({ form, contactId }) => {
  const [emailChecking, setEmailChecking] = React.useState(false);
  const [phoneChecking, setPhoneChecking] = React.useState(false);
  
  // Récupérer les valeurs actuelles des champs
  const watchEmail = form.watch('email');
  const watchPhone = form.watch('phone');
  
  // Débouncer les valeurs pour éviter trop d'appels API
  const debouncedEmail = useDebounce(watchEmail, 500);
  const debouncedPhone = useDebounce(watchPhone, 500);
  
  // Vérifier l'email lorsqu'il change
  React.useEffect(() => {
    if (!debouncedEmail || debouncedEmail.trim() === '') return;
    
    const checkEmailDuplicate = async () => {
      setEmailChecking(true);
      try {
        const result = await contactCreateUpdateService.checkContactDuplicate(debouncedEmail, undefined, contactId);
        if (result.isDuplicate) {
          form.setError('email', {
            type: 'manual',
            message: 'Cette adresse email est déjà utilisée par un autre contact.'
          });
        } else {
          // Effacer l'erreur si elle existe et que l'email est maintenant valide
          form.clearErrors('email');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'unicité de l'email:", error);
      } finally {
        setEmailChecking(false);
      }
    };
    
    checkEmailDuplicate();
  }, [debouncedEmail, form, contactId]);
  
  // Vérifier le téléphone lorsqu'il change
  React.useEffect(() => {
    if (!debouncedPhone || debouncedPhone.trim() === '') return;
    
    const checkPhoneDuplicate = async () => {
      setPhoneChecking(true);
      try {
        const result = await contactCreateUpdateService.checkContactDuplicate('dummy@example.com', debouncedPhone, contactId);
        if (result.isDuplicate) {
          form.setError('phone', {
            type: 'manual',
            message: 'Ce numéro de téléphone est déjà utilisé par un autre contact.'
          });
        } else {
          // Effacer l'erreur si elle existe et que le téléphone est maintenant valide
          form.clearErrors('phone');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'unicité du téléphone:", error);
      } finally {
        setPhoneChecking(false);
      }
    };
    
    checkPhoneDuplicate();
  }, [debouncedPhone, form, contactId]);

  return (
    <>
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
              <Input 
                type="email" 
                placeholder="Email" 
                {...field} 
                className={emailChecking ? "border-orange-300 bg-orange-50" : ""}
              />
            </FormControl>
            {emailChecking && (
              <p className="text-xs text-orange-500">Vérification en cours...</p>
            )}
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
              <Input 
                placeholder="Téléphone" 
                {...field} 
                className={phoneChecking ? "border-orange-300 bg-orange-50" : ""}
              />
            </FormControl>
            {phoneChecking && (
              <p className="text-xs text-orange-500">Vérification en cours...</p>
            )}
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
    </>
  );
};

export default ContactFormFields;
