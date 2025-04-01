
import { supabase } from "@/lib/supabase-client";
import { ContactStatus } from "@/types/database/enums";
import { toast } from "sonner";
import { Contact } from "./types";

export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  notes?: string;
  status: ContactStatus;
  assignedTo?: string;
  folder?: string;
}

export const contactCreateUpdateService = {
  async checkContactDuplicate(email: string, phone?: string, excludeContactId?: string): Promise<{isDuplicate: boolean; field?: string; value?: string}> {
    try {
      // Construire la requête de base
      let query = supabase
        .from('contacts')
        .select('id, email, phone')
        .is('deleted_at', null);
      
      // Si on vérifie lors d'une mise à jour, exclure l'ID du contact actuel
      if (excludeContactId) {
        query = query.neq('id', excludeContactId);
      }
      
      // Vérifier d'abord l'email car c'est le plus important
      const { data: emailData, error: emailError } = await query
        .eq('email', email)
        .single();
      
      if (emailError && emailError.code !== 'PGRST116') {
        console.error("Erreur lors de la vérification d'email dupliqué:", emailError);
      }
      
      if (emailData) {
        return { isDuplicate: true, field: 'email', value: email };
      }
      
      // Ensuite, vérifier le téléphone si fourni
      if (phone && phone.trim() !== '') {
        const { data: phoneData, error: phoneError } = await query
          .eq('phone', phone)
          .single();
        
        if (phoneError && phoneError.code !== 'PGRST116') {
          console.error("Erreur lors de la vérification de téléphone dupliqué:", phoneError);
        }
        
        if (phoneData) {
          return { isDuplicate: true, field: 'phone', value: phone };
        }
      }
      
      // Si on arrive ici, aucun doublon n'a été trouvé
      return { isDuplicate: false };
    } catch (error) {
      console.error("Erreur lors de la vérification de contact dupliqué:", error);
      return { isDuplicate: false }; // En cas d'erreur, on permet l'opération
    }
  },

  async createContact(contactData: ContactFormInput): Promise<Contact | null> {
    try {
      // Vérifier si un contact avec le même email ou téléphone existe déjà
      const duplicateCheck = await this.checkContactDuplicate(contactData.email, contactData.phone);
      
      if (duplicateCheck.isDuplicate) {
        const message = `Un contact avec ${duplicateCheck.field === 'email' ? 'cette adresse email' : 'ce numéro de téléphone'} existe déjà.`;
        toast.error("Doublon détecté", { description: message });
        throw new Error(message);
      }
      
      const now = new Date().toISOString();
      
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.warn("Problème d'authentification (mode démo):", authError.message);
        // En mode démo, continuer malgré l'erreur d'authentification
      }
      
      const assignedTo = contactData.assignedTo;
      const folder = contactData.folder || 'general';
      
      // Insérer directement dans la table contacts au lieu d'utiliser la fonction RPC
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || null,
          company: contactData.company || null,
          position: contactData.position || null,
          address: contactData.address || null,
          notes: contactData.notes || null,
          assignedTo: assignedTo,
          status: contactData.status || 'lead',
          createdAt: now,
          updatedAt: now,
          folder: folder
        })
        .select('*')  // Sélectionner tous les champs pour retourner le contact complet
        .single();

      if (error) {
        // Gestion spécifique pour les erreurs de contrainte d'unicité
        if (error.code === '23505') { // Code PostgreSQL pour violation de contrainte unique
          if (error.message.includes('email')) {
            toast.error("Doublon détecté", { 
              description: "Un contact avec cette adresse email existe déjà." 
            });
          } else if (error.message.includes('phone')) {
            toast.error("Doublon détecté", { 
              description: "Un contact avec ce numéro de téléphone existe déjà." 
            });
          } else {
            toast.error("Doublon détecté", { 
              description: "Ce contact semble déjà exister dans la base de données." 
            });
          }
        } else {
          toast.error("Erreur lors de la création du contact", { 
            description: error.message 
          });
        }
        console.error("Erreur lors de la création du contact:", error);
        throw error;
      }

      return data as Contact;
    } catch (error: any) {
      console.error("Error in createContact:", error);
      throw error;
    }
  },

  async addContact(contactData: ContactFormInput): Promise<Contact | null> {
    return this.createContact(contactData);
  },

  async updateContact(id: string, contactData: Partial<ContactFormInput>): Promise<boolean> {
    try {
      // Vérifier les doublons seulement si l'email ou le téléphone sont modifiés
      if (contactData.email !== undefined || contactData.phone !== undefined) {
        // Récupérer d'abord les données actuelles du contact
        const { data: existingContact } = await supabase
          .from("contacts")
          .select("email, phone")
          .eq("id", id)
          .single();
        
        if (existingContact) {
          const emailToCheck = contactData.email || existingContact.email;
          const phoneToCheck = contactData.phone !== undefined ? contactData.phone : existingContact.phone;
          
          // Vérifier les doublons, en excluant le contact actuel
          const duplicateCheck = await this.checkContactDuplicate(emailToCheck, phoneToCheck, id);
          
          if (duplicateCheck.isDuplicate) {
            const message = `Un contact avec ${duplicateCheck.field === 'email' ? 'cette adresse email' : 'ce numéro de téléphone'} existe déjà.`;
            toast.error("Doublon détecté", { description: message });
            throw new Error(message);
          }
        }
      }
      
      const now = new Date().toISOString();
      
      const updateData: any = {
        updatedAt: now
      };
      
      // Ajouter uniquement les champs définis
      if (contactData.name !== undefined) updateData.name = contactData.name;
      if (contactData.email !== undefined) updateData.email = contactData.email;
      if (contactData.phone !== undefined) updateData.phone = contactData.phone;
      if (contactData.company !== undefined) updateData.company = contactData.company;
      if (contactData.position !== undefined) updateData.position = contactData.position;
      if (contactData.address !== undefined) updateData.address = contactData.address;
      if (contactData.notes !== undefined) updateData.notes = contactData.notes;
      if (contactData.assignedTo !== undefined) updateData.assignedTo = contactData.assignedTo;
      if (contactData.status !== undefined) updateData.status = contactData.status;
      if (contactData.folder !== undefined) updateData.folder = contactData.folder;
      
      const { error } = await supabase
        .from("contacts")
        .update(updateData)
        .eq("id", id);

      if (error) {
        // Gestion spécifique pour les erreurs de contrainte d'unicité
        if (error.code === '23505') { // Code PostgreSQL pour violation de contrainte unique
          if (error.message.includes('email')) {
            toast.error("Doublon détecté", { 
              description: "Un contact avec cette adresse email existe déjà." 
            });
          } else if (error.message.includes('phone')) {
            toast.error("Doublon détecté", { 
              description: "Un contact avec ce numéro de téléphone existe déjà." 
            });
          } else {
            toast.error("Doublon détecté", { 
              description: "Ce contact semble déjà exister dans la base de données." 
            });
          }
          return false;
        }
        console.error("Erreur lors de la mise à jour du contact:", error);
        toast.error("Erreur lors de la mise à jour du contact", {
          description: error.message
        });
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error("Error in updateContact:", error);
      toast.error("Erreur lors de la mise à jour du contact: " + error.message);
      return false;
    }
  }
};

export const { createContact, addContact, updateContact } = contactCreateUpdateService;
