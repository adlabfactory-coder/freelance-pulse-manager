
import { useState, useEffect, useCallback } from "react";
import { Contact } from "@/services/contacts/types";
import { ContactStatus } from "@/types/database/enums";
import { contactService } from "@/services/contacts";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";

export function useContactStatusListeners(contacts: Contact[]) {
  const updateContactStatus = useCallback(async (contactId: string, newStatus: ContactStatus) => {
    try {
      await contactService.updateContact(contactId, { status: newStatus });
      
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
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur", {
        description: "Impossible de mettre à jour le statut du contact"
      });
      return false;
    }
  }, []);

  // Écouteur d'événements pour les rendez-vous validés
  useEffect(() => {
    console.log("Initialisation de l'écouteur de rendez-vous...");
    
    const appointmentsChannel = supabase
      .channel('appointments-status-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'appointments',
          filter: 'status=eq.confirmed'
        }, 
        (payload) => {
          console.log("Événement de mise à jour de rendez-vous détecté:", payload);
          
          if (payload.new && payload.old && 
              payload.old.status === 'pending' && 
              payload.new.status === 'confirmed') {
            
            const contactId = payload.new.contactId;
            console.log("Contact ID détecté:", contactId);
            
            const contact = contacts.find(c => c.id === contactId);
            
            if (contact) {
              console.log("Contact trouvé:", contact);
              // Mettre à jour le statut seulement si le contact est un lead
              if (contact.status === 'lead') {
                console.log("Mise à jour du statut du contact de lead à prospect");
                updateContactStatus(contactId, 'prospect');
              }
            } else {
              console.log("Contact non trouvé dans la liste locale");
            }
          }
        }
      )
      .subscribe((status) => {
        console.log("Statut d'abonnement à l'écouteur de rendez-vous:", status);
      });
      
    // Écouteur d'événements pour les devis créés
    const quotesChannel = supabase
      .channel('quotes-created')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'quotes'
        }, 
        (payload) => {
          console.log("Événement de création de devis détecté:", payload);
          
          if (payload.new) {
            const contactId = payload.new.contactId;
            const contact = contacts.find(c => c.id === contactId);
            
            if (contact) {
              console.log("Contact trouvé pour le devis:", contact);
              if (contact.status === 'lead' || contact.status === 'prospect') {
                console.log("Mise à jour du statut du contact vers négociation");
                updateContactStatus(contactId, 'negotiation');
              }
            } else {
              console.log("Contact non trouvé pour le devis créé");
            }
          }
        }
      )
      .subscribe((status) => {
        console.log("Statut d'abonnement à l'écouteur de devis créés:", status);
      });
    
    // Écouteur d'événements pour les devis validés/payés
    const quotesUpdateChannel = supabase
      .channel('quotes-accepted')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'quotes',
          filter: 'status=eq.accepted'
        }, 
        (payload) => {
          console.log("Événement de mise à jour de devis détecté:", payload);
          
          if (payload.new && payload.old && 
              payload.old.status !== 'accepted' && 
              payload.new.status === 'accepted') {
            
            const contactId = payload.new.contactId;
            const contact = contacts.find(c => c.id === contactId);
            
            if (contact) {
              console.log("Contact trouvé pour le devis accepté:", contact);
              if (contact.status === 'negotiation') {
                console.log("Mise à jour du statut du contact vers signé");
                updateContactStatus(contactId, 'signed');
              }
            } else {
              console.log("Contact non trouvé pour le devis accepté");
            }
          }
        }
      )
      .subscribe((status) => {
        console.log("Statut d'abonnement à l'écouteur de devis acceptés:", status);
      });
      
    return () => {
      console.log("Nettoyage des écouteurs...");
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(quotesUpdateChannel);
    };
  }, [contacts, updateContactStatus]);

  return { updateContactStatus };
}
