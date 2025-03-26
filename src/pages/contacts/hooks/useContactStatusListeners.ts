
import { useState, useEffect, useCallback } from "react";
import { Contact } from "@/services/contacts/types";
import { ContactStatus } from "@/types/database/enums";
import { contactService } from "@/services/contacts";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";

export function useContactStatusListeners(contacts: Contact[]) {
  const updateContactStatus = useCallback(async (contactId: string, newStatus: ContactStatus) => {
    try {
      const result = await contactService.updateContact(contactId, { status: newStatus });
      if (result) {
        // Message de confirmation basé sur le statut
        let statusMessage = "";
        switch (newStatus) {
          case "prospect":
            statusMessage = "Le contact est maintenant un prospect suite à un rendez-vous validé.";
            break;
          case "negotiation":
            statusMessage = "Le contact est maintenant en négociation suite à la génération d'un devis.";
            break;
          case "signed":
            statusMessage = "Le contact est maintenant au statut signé suite à la validation du paiement.";
            break;
          case "lost":
            statusMessage = "Le contact a été marqué comme perdu.";
            break;
          default:
            statusMessage = `Le statut du contact a été mis à jour: ${newStatus}`;
        }
        
        toast.success("Statut mis à jour", {
          description: statusMessage
        });
        
        return true;
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur", {
        description: "Impossible de mettre à jour le statut du contact"
      });
    }
    return false;
  }, []);

  // Écouteur d'événements pour les rendez-vous validés
  useEffect(() => {
    const appointmentsChannel = supabase
      .channel('public:appointments')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'appointments'
        }, 
        (payload) => {
          // Si le statut du rendez-vous est validé, mettre à jour le contact en prospect
          if (payload.new && payload.new.status === 'confirmed') {
            const contactId = payload.new.contactId;
            const contact = contacts.find(c => c.id === contactId);
            
            if (contact && contact.status === 'lead') {
              updateContactStatus(contactId, 'prospect');
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(appointmentsChannel);
    };
  }, [contacts, updateContactStatus]);
  
  // Écouteur d'événements pour les devis créés
  useEffect(() => {
    const quotesChannel = supabase
      .channel('public:quotes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'quotes'
        }, 
        (payload) => {
          // Quand un devis est créé, mettre à jour le contact en négociation
          if (payload.new) {
            const contactId = payload.new.contactId;
            const contact = contacts.find(c => c.id === contactId);
            
            if (contact && (contact.status === 'lead' || contact.status === 'prospect')) {
              updateContactStatus(contactId, 'negotiation');
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(quotesChannel);
    };
  }, [contacts, updateContactStatus]);
  
  // Écouteur d'événements pour les devis validés/payés
  useEffect(() => {
    const quotesUpdateChannel = supabase
      .channel('public:quotes:updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'quotes'
        }, 
        (payload) => {
          // Quand un devis est marqué comme accepté/payé, mettre à jour le contact en signé
          if (payload.new && payload.new.status === 'accepted') {
            const contactId = payload.new.contactId;
            const contact = contacts.find(c => c.id === contactId);
            
            if (contact && contact.status === 'negotiation') {
              updateContactStatus(contactId, 'signed');
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(quotesUpdateChannel);
    };
  }, [contacts, updateContactStatus]);

  return { updateContactStatus };
}
