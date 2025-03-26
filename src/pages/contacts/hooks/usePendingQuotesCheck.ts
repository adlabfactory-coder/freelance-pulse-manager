
import { useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";

export function usePendingQuotesCheck(isAccountManager: boolean, isAdmin: boolean) {
  useEffect(() => {
    // Seulement pour les chargés de compte et admins
    if (!isAccountManager && !isAdmin) return;
    
    const checkPendingQuotes = async () => {
      try {
        // Obtenir la date d'il y a une semaine
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        // Récupérer les devis en attente créés il y a plus d'une semaine
        const { data, error } = await supabase
          .from('quotes')
          .select('*, contacts(name)')
          .eq('status', 'sent')
          .lt('createdAt', oneWeekAgo.toISOString());
        
        if (error) throw error;
        
        // Notification pour chaque devis en attente
        if (data && data.length > 0) {
          data.forEach(quote => {
            const contactName = quote.contacts?.name || 'Client';
            toast.warning("Devis en attente", {
              description: `Le devis pour ${contactName} est en attente depuis plus d'une semaine.`,
              duration: 10000,
              action: {
                label: "Voir",
                onClick: () => window.location.href = `/quotes/${quote.id}`
              }
            });
          });
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des devis en attente:", error);
      }
    };
    
    // Vérifier au chargement de la page
    checkPendingQuotes();
    
    // Vérifier périodiquement (toutes les 24h)
    const interval = setInterval(checkPendingQuotes, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAccountManager, isAdmin]);
}
