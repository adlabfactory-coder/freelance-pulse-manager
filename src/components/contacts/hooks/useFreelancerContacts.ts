
import { useState, useEffect } from "react";
import { Contact } from "@/types";
import { contactService } from "@/services/contact-service";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";

export function useFreelancerContacts(initialContacts?: Contact[], initialLoading?: boolean) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts || []);
  const [loading, setLoading] = useState<boolean>(initialLoading || true);

  // Load contacts if not provided as props
  useEffect(() => {
    if (initialContacts) {
      setContacts(initialContacts);
      setLoading(initialLoading || false);
    } else if (user?.id) {
      const loadContacts = async () => {
        try {
          setLoading(true);
          const result = await contactService.getContactsByFreelancer(user.id);
          setContacts(result || []);
        } catch (error) {
          console.error("Erreur lors du chargement des contacts:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger vos contacts."
          });
        } finally {
          setLoading(false);
        }
      };
      
      loadContacts();
      
      // Set up real-time listener
      const channel = supabase
        .channel('public:contacts')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'contacts', filter: `assignedTo=eq.${user.id}` }, 
          () => loadContacts()
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [initialContacts, initialLoading, user?.id, toast]);

  return { contacts, loading };
}
