import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useSupabase } from './use-supabase';

// Define the CommissionDetail interface
export interface CommissionDetail {
  id: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  tier: string;
  periodStart: Date;
  periodEnd: Date;
  status: string;
  paidDate?: Date;
  paymentRequested: boolean;
  contact?: {
    id: string;
    name: string;
    email: string;
    company?: string;
  };
  quote?: {
    id: string;
    totalAmount: number;
    status: string;
  };
  subscription?: {
    id: string;
    name: string;
    price: number;
    interval: string;
  };
  createdAt: Date;
}

export function useCommissionDetail(commissionId: string | undefined) {
  const supabase = useSupabase();
  const [commission, setCommission] = useState<CommissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestingPayment, setRequestingPayment] = useState(false);

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
        const { data, error } = await supabase.supabaseClient
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
          const { data: contactData, error: contactError } = await supabase.supabaseClient
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
  }, [commissionId, supabase.supabaseClient]);

  // Function to mark commission as paid
  const markAsPaid = async () => {
    if (!commission) return false;

    try {
      const { error } = await supabase.supabaseClient
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
        paidDate: new Date()
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
    if (!commission) return false;
    
    setRequestingPayment(true);

    try {
      const { error } = await supabase.supabaseClient
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
        paymentRequested: true
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
    } finally {
      setRequestingPayment(false);
    }
  };

  return {
    commission,
    isLoading,
    error,
    markAsPaid,
    requestPayment,
    requestingPayment
  };
}
