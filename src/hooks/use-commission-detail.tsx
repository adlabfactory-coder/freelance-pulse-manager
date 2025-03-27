
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useSupabase } from './use-supabase';
import { CommissionTier, CommissionStatus, CommissionTierValues } from '@/types/commissions';

// Define the CommissionDetail interface
export interface CommissionDetail {
  id: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  tier: CommissionTier; 
  periodStart: Date;
  periodEnd: Date;
  status: CommissionStatus; 
  paidDate?: Date;
  paymentRequested: boolean;
  payment_requested: boolean; // Added for compatibility with Commission interface
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

        // Convert string tier to CommissionTier enum and status to CommissionStatus
        const processedData = {
          ...data,
          tier: mapTierStringToEnum(data.tier), // Convert the tier string to enum
          status: mapStatusStringToEnum(data.status), // Convert the status string to enum
          periodStart: new Date(data.periodStart),
          periodEnd: new Date(data.periodEnd),
          createdAt: new Date(data.createdAt),
          paidDate: data.paidDate ? new Date(data.paidDate) : undefined,
          freelancerName: data.freelancer?.name || "Non assigné",
          paymentRequested: !!data.payment_requested,
          payment_requested: !!data.payment_requested // Keep both for compatibility
        };

        setCommission(processedData);
      } catch (err) {
        console.error('Error in commission detail fetch:', err);
        setError('Une erreur est survenue lors de la récupération des détails');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCommissionDetail();
  }, [commissionId, supabase.supabaseClient]);

  // Function to map string tier values to CommissionTier enum
  const mapTierStringToEnum = (tierString: string): CommissionTier => {
    switch (tierString.toLowerCase()) {
      case 'bronze':
        return CommissionTierValues.BRONZE;
      case 'silver':
        return CommissionTierValues.SILVER;
      case 'gold':
        return CommissionTierValues.GOLD;
      case 'platinum':
        return CommissionTierValues.PLATINUM;
      default:
        console.warn(`Unknown tier value: ${tierString}, defaulting to BRONZE`);
        return CommissionTierValues.BRONZE;
    }
  };

  // Function to map string status values to CommissionStatus enum
  const mapStatusStringToEnum = (statusString: string): CommissionStatus => {
    switch (statusString.toLowerCase()) {
      case 'paid':
        return 'paid';
      case 'rejected':
        return 'rejected' as CommissionStatus;
      case 'processing':
        return 'processing';
      case 'cancelled':
        return 'cancelled';
      case 'pending':
      default:
        return 'pending';
    }
  };

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
