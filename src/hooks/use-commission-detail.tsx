
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useSupabase } from './use-supabase';

export function useCommissionDetail(commissionId: string) {
  const { supabaseClient } = useSupabase();
  const [commission, setCommission] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommissionDetail() {
      if (!commissionId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch the commission details
        const { data, error } = await supabaseClient
          .from('commissions')
          .select(`
            *,
            freelancer:freelancerId(id, name, email),
            quote:quoteId(id, totalAmount, contactId, status),
            subscription:subscriptionId(id, name, price, interval)
          `)
          .eq('id', commissionId)
          .single();

        if (error) {
          console.error('Error fetching commission:', error);
          setError('Impossible de récupérer les détails de la commission');
          return;
        }

        if (!data) {
          setError('Commission non trouvée');
          return;
        }

        // Fetch contact details if the commission is linked to a quote
        if (data.quote && data.quote.contactId) {
          const { data: contactData, error: contactError } = await supabaseClient
            .from('contacts')
            .select('id, name, email, company')
            .eq('id', data.quote.contactId)
            .single();

          if (!contactError && contactData) {
            data.contact = contactData;
          }
        }

        setCommission(data);
      } catch (err) {
        console.error('Error in commission detail fetch:', err);
        setError('Une erreur est survenue lors de la récupération des détails');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCommissionDetail();
  }, [commissionId, supabaseClient]);

  // Function to mark commission as paid
  const markAsPaid = async () => {
    if (!commission) return;

    try {
      const { error } = await supabaseClient
        .from('commissions')
        .update({ 
          status: 'paid',
          paidDate: new Date().toISOString()
        })
        .eq('id', commissionId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de marquer la commission comme payée"
        });
        return false;
      }

      // Update local state
      setCommission({
        ...commission,
        status: 'paid',
        paidDate: new Date().toISOString()
      });

      toast({
        title: "Commission payée",
        description: "La commission a été marquée comme payée avec succès"
      });
      return true;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement de la commission"
      });
      return false;
    }
  };

  // Function to request payment
  const requestPayment = async () => {
    if (!commission) return;

    try {
      const { error } = await supabaseClient
        .from('commissions')
        .update({ payment_requested: true })
        .eq('id', commissionId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de demander le paiement"
        });
        return false;
      }

      // Update local state
      setCommission({
        ...commission,
        payment_requested: true
      });

      toast({
        title: "Demande envoyée",
        description: "La demande de paiement a été enregistrée avec succès"
      });
      return true;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la demande de paiement"
      });
      return false;
    }
  };

  return {
    commission,
    isLoading,
    error,
    markAsPaid,
    requestPayment
  };
}
