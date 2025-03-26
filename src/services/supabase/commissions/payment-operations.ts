
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';

/**
 * Demande le paiement d'une commission
 * Seul un freelancer peut demander le paiement de sa propre commission
 */
export async function requestPayment(
  supabase: SupabaseClient<Database>,
  commissionId: string, 
  userId: string, 
  userRole: UserRole
): Promise<boolean> {
  try {
    // Vérifier si l'utilisateur a le droit de demander un paiement
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.FREELANCER) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'êtes pas autorisé à demander un versement",
      });
      return false;
    }
    
    // Vérifier si la commission appartient au freelancer connecté
    if (userRole === UserRole.FREELANCER) {
      const { data: commission, error: commissionError } = await supabase
        .from("commissions")
        .select("freelancerId")
        .eq("id", commissionId)
        .single();
      
      if (commissionError) {
        console.error("Erreur lors de la vérification de la commission:", commissionError);
        throw new Error("Impossible de vérifier les détails de la commission");
      }
      
      // Vérifier que le freelancer est bien le propriétaire
      if (commission.freelancerId !== userId) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'êtes pas autorisé à demander le versement de cette commission",
        });
        return false;
      }
    }
    
    const { error } = await supabase
      .from("commissions")
      .update({ payment_requested: true })
      .eq("id", commissionId);

    if (error) {
      throw error;
    }
    
    toast({
      title: "Demande envoyée",
      description: "Votre demande de versement a été envoyée avec succès",
    });
    return true;
  } catch (error: any) {
    console.error("Erreur lors de la demande de versement:", error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: error.message || "Une erreur est survenue lors de l'envoi de votre demande",
    });
    return false;
  }
}

/**
 * Valide le paiement d'une commission
 * Seul un administrateur peut effectuer cette action
 */
export async function approvePayment(
  supabase: SupabaseClient<Database>,
  commissionId: string, 
  userRole: UserRole
): Promise<boolean> {
  try {
    // Vérifier si l'utilisateur a le droit d'approuver un paiement
    if (userRole !== UserRole.ADMIN) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seul un administrateur peut valider les versements",
      });
      return false;
    }
    
    const { error } = await supabase
      .from("commissions")
      .update({ 
        status: 'paid',
        paidDate: new Date().toISOString()
      })
      .eq("id", commissionId);

    if (error) {
      throw error;
    }
    
    toast({
      title: "Paiement validé",
      description: "Le versement a été marqué comme effectué",
    });
    return true;
  } catch (error: any) {
    console.error("Erreur lors de la validation du paiement:", error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: error.message || "Une erreur est survenue lors de la validation du paiement",
    });
    return false;
  }
}
