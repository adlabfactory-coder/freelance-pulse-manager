
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
  const [checkingCompleted, setCheckingCompleted] = useState(true);
  
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
      setCheckingCompleted(false);
      
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
        setCheckingCompleted(true);
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
      setCheckingCompleted(false);
      
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
        setCheckingCompleted(true);
      }
    };
    
    checkPhoneDuplicate();
  }, [debouncedPhone, form, contactId]);

  // Vérifier si les deux champs actuellement ont des erreurs
  const hasDuplicateErrors = !!emailDuplicateInfo || !!phoneDuplicateInfo;
  
  // Fonction pour vérifier à la demande (par exemple avant soumission)
  const validateUniqueness = async (): Promise<boolean> => {
    // Si les champs sont vides, pas besoin de vérifier
    if ((!watchEmail || watchEmail.trim() === '') && (!watchPhone || watchPhone.trim() === '')) {
      return true;
    }
    
    setCheckingCompleted(false);
    let isValid = true;
    
    // Vérifier l'email
    if (watchEmail && watchEmail.trim() !== '') {
      setEmailChecking(true);
      try {
        const result = await contactCreateUpdateService.checkContactDuplicate(watchEmail, undefined, contactId);
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
          
          isValid = false;
        }
      } catch (error) {
        console.error("Erreur lors de la validation de l'unicité de l'email:", error);
      } finally {
        setEmailChecking(false);
      }
    }
    
    // Vérifier le téléphone
    if (watchPhone && watchPhone.trim() !== '') {
      setPhoneChecking(true);
      try {
        const result = await contactCreateUpdateService.checkContactDuplicate('dummy@example.com', watchPhone, contactId);
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
          
          isValid = false;
        }
      } catch (error) {
        console.error("Erreur lors de la validation de l'unicité du téléphone:", error);
      } finally {
        setPhoneChecking(false);
      }
    }
    
    setCheckingCompleted(true);
    return isValid;
  };

  return {
    emailChecking,
    phoneChecking,
    emailDuplicateInfo,
    phoneDuplicateInfo,
    hasDuplicateErrors,
    checkingCompleted,
    validateUniqueness
  };
};

export default useContactDuplicateCheck;
