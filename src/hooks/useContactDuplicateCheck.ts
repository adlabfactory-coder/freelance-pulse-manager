
import { useState, useEffect } from 'react';
import { UseFormReturn } from "react-hook-form";
import { contactCreateUpdateService } from "@/services/contacts/contact-create-update";
import { useDebounce } from "@/hooks/use-debounce";
import { ContactFormValues } from '@/components/contacts/schema/contactFormSchema';

interface DuplicateInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export const useContactDuplicateCheck = (
  form: UseFormReturn<ContactFormValues>,
  contactId?: string
) => {
  const [emailChecking, setEmailChecking] = useState(false);
  const [phoneChecking, setPhoneChecking] = useState(false);
  const [emailDuplicateInfo, setEmailDuplicateInfo] = useState<DuplicateInfo | null>(null);
  const [phoneDuplicateInfo, setPhoneDuplicateInfo] = useState<DuplicateInfo | null>(null);
  
  // Récupérer les valeurs actuelles des champs
  const watchEmail = form.watch('email');
  const watchPhone = form.watch('phone');
  
  // Débouncer les valeurs pour éviter trop d'appels API
  const debouncedEmail = useDebounce(watchEmail, 500);
  const debouncedPhone = useDebounce(watchPhone, 500);

  // Vérifier l'email lorsqu'il change
  useEffect(() => {
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
  useEffect(() => {
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

  return {
    emailChecking,
    phoneChecking,
    emailDuplicateInfo,
    phoneDuplicateInfo
  };
};

export default useContactDuplicateCheck;
