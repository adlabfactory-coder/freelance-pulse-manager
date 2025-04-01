
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
import { InfoCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormValues>;
  contactId?: string; // Pour exclure le contact actuel lors de l'édition
}

const ContactFormFields: React.FC<ContactFormFieldsProps> = ({ form, contactId }) => {
  const [emailChecking, setEmailChecking] = React.useState(false);
  const [phoneChecking, setPhoneChecking] = React.useState(false);
  const [emailDuplicateInfo, setEmailDuplicateInfo] = React.useState<{name?: string, email?: string} | null>(null);
  const [phoneDuplicateInfo, setPhoneDuplicateInfo] = React.useState<{name?: string, phone?: string} | null>(null);
  
  // Récupérer les valeurs actuelles des champs
  const watchEmail = form.watch('email');
  const watchPhone = form.watch('phone');
  
  // Débouncer les valeurs pour éviter trop d'appels API
  const debouncedEmail = useDebounce(watchEmail, 500);
  const debouncedPhone = useDebounce(watchPhone, 500);
  
  // Vérifier l'email lorsqu'il change
  React.useEffect(() => {
    if (!debouncedEmail || debouncedEmail.trim() === '') {
      setEmailDuplicateInfo(null);
      return;
    }
    
    const checkEmailDuplicate = async () => {
      setEmailChecking(true);
      try {
        const result = await contactCreateUpdateService.checkContactDuplicate(debouncedEmail, undefined, contactId);
        if (result.isDuplicate && result.field === 'email') {
          form.setError('email', {
            type: 'manual',
            message: 'Cette adresse email est déjà utilisée par un autre contact.'
          });
          
          if (result.existingContact) {
            setEmailDuplicateInfo({
              name: result.existingContact.name,
              email: result.existingContact.email
            });
          }
        } else {
          // Effacer l'erreur si elle existe et que l'email est maintenant valide
          form.clearErrors('email');
          setEmailDuplicateInfo(null);
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
    if (!debouncedPhone || debouncedPhone.trim() === '') {
      setPhoneDuplicateInfo(null);
      return;
    }
    
    const checkPhoneDuplicate = async () => {
      setPhoneChecking(true);
      try {
        // Utiliser une adresse email factice pour la vérification du téléphone uniquement
        const result = await contactCreateUpdateService.checkContactDuplicate('dummy@example.com', debouncedPhone, contactId);
        if (result.isDuplicate && result.field === 'phone') {
          form.setError('phone', {
            type: 'manual',
            message: 'Ce numéro de téléphone est déjà utilisé par un autre contact.'
          });
          
          if (result.existingContact) {
            setPhoneDuplicateInfo({
              name: result.existingContact.name,
              phone: result.existingContact.phone
            });
          }
        } else {
          // Effacer l'erreur si elle existe et que le téléphone est maintenant valide
          form.clearErrors('phone');
          setPhoneDuplicateInfo(null);
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
              <div className="relative w-full">
                <Input 
                  type="email" 
                  placeholder="Email" 
                  {...field} 
                  className={emailChecking ? "border-orange-300 bg-orange-50" : 
                            emailDuplicateInfo ? "border-red-300 bg-red-50" : ""}
                />
                {emailDuplicateInfo && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoCircle 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" 
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Email déjà utilisé par: {emailDuplicateInfo.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
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
              <div className="relative w-full">
                <Input 
                  placeholder="Téléphone" 
                  {...field} 
                  className={phoneChecking ? "border-orange-300 bg-orange-50" : 
                            phoneDuplicateInfo ? "border-red-300 bg-red-50" : ""}
                />
                {phoneDuplicateInfo && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoCircle 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" 
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Téléphone déjà utilisé par: {phoneDuplicateInfo.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
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
