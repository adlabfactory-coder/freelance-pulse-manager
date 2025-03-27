
import { useState, useEffect, useCallback } from 'react';
import { Quote, QuoteStatus } from '@/types/quote';
import { fetchQuoteById } from '@/services/quote-service';
import { fetchUserById } from '@/services/user-service';
import { contactService } from '@/services/contact-service';
import { toast } from 'sonner';

export function useQuoteDetails(quoteId: string) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactName, setContactName] = useState<string>('');
  const [freelancerName, setFreelancerName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const loadQuote = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const quoteData = await fetchQuoteById(quoteId);
      if (!quoteData) {
        setError('Devis introuvable');
        return;
      }
      
      setQuote(quoteData);
      
      // Charger les informations du contact
      try {
        const contact = await contactService.getContactById(quoteData.contactId);
        if (contact) {
          setContactName(contact.name);
        }
      } catch (contactError) {
        console.error('Erreur lors du chargement du contact:', contactError);
        // Ne pas bloquer le chargement si le contact n'est pas trouvé
      }
      
      // Charger les informations du commercial
      try {
        const freelancer = await fetchUserById(quoteData.freelancerId);
        if (freelancer) {
          setFreelancerName(freelancer.name);
        }
      } catch (freelancerError) {
        console.error('Erreur lors du chargement du commercial:', freelancerError);
        // Ne pas bloquer le chargement si le commercial n'est pas trouvé
      }
      
    } catch (err) {
      console.error('Erreur lors du chargement du devis:', err);
      setError('Erreur lors du chargement des données du devis');
      toast.error('Erreur lors du chargement des données du devis');
    } finally {
      setLoading(false);
    }
  }, [quoteId]);

  useEffect(() => {
    if (quoteId) {
      loadQuote();
    }
  }, [quoteId, loadQuote]);

  const updateQuoteStatus = useCallback((newStatus: QuoteStatus) => {
    if (quote) {
      setQuote({
        ...quote,
        status: newStatus
      });
    }
  }, [quote]);

  return {
    quote,
    loading,
    error,
    contactName,
    freelancerName,
    loadQuote,
    updateQuoteStatus
  };
}
