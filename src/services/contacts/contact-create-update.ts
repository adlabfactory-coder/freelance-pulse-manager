
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
  async checkContactDuplicate(email: string, phone?: string, excludeContactId?: string): Promise<{isDuplicate: boolean; field?: string; value?: string; existingContact?: any}> {
    try {
      console.log(`Vérification des doublons - Email: ${email}, Téléphone: ${phone || 'non fourni'}, Contact à exclure: ${excludeContactId || 'aucun'}`);
      
      // Construire la requête de base
      let query = supabase
        .from('contacts')
        .select('id, email, phone, name')
        .is('deleted_at', null);
      
      // Si on vérifie lors d'une mise à jour, exclure l'ID du contact actuel
      if (excludeContactId) {
        query = query.neq('id', excludeContactId);
      }
      
      // Normaliser l'email (convertir en minuscules pour la comparaison)
      const normalizedEmail = email.toLowerCase().trim();
      
      // Vérifier d'abord l'email car c'est le plus important
      const { data: emailData, error: emailError } = await query
        .ilike('email', normalizedEmail)
        .single();
      
      if (emailError && emailError.code !== 'PGRST116') {
        console.error("Erreur lors de la vérification d'email dupliqué:", emailError);
      }
      
      if (emailData) {
        console.log(`Contact en doublon trouvé par email: ${emailData.name} (${emailData.email})`);
        return { isDuplicate: true, field: 'email', value: email, existingContact: emailData };
      }
      
      // Ensuite, vérifier le téléphone si fourni et non-vide
      if (phone && phone.trim() !== '') {
        // Normaliser le téléphone (supprimer les espaces, tirets, etc.)
        const normalizedPhone = phone.replace(/[\s\-\(\)\.]/g, '').trim();
        
        if (normalizedPhone) {
          const { data: phoneData, error: phoneError } = await query
            .or(`phone.ilike.%${normalizedPhone}%,phone.ilike.%${phone}%`)
            .single();
          
          if (phoneError && phoneError.code !== 'PGRST116') {
            console.error("Erreur lors de la vérification de téléphone dupliqué:", phoneError);
          }
          
          if (phoneData) {
            console.log(`Contact en doublon trouvé par téléphone: ${phoneData.name} (${phoneData.phone})`);
            return { isDuplicate: true, field: 'phone', value: phone, existingContact: phoneData };
          }
        }
      }
      
      // Si on arrive ici, aucun doublon n'a été trouvé
      console.log("Aucun doublon trouvé");
      return { isDuplicate: false };
    } catch (error) {
      console.error("Erreur lors de la vérification de contact dupliqué:", error);
      return { isDuplicate: false }; // En cas d'erreur, on permet l'opération mais on la journalise
    }
  },

  async createContact(contactData: ContactFormInput): Promise<Contact | null> {
    try {
      // Vérifier si un contact avec le même email ou téléphone existe déjà
      const duplicateCheck = await this.checkContactDuplicate(contactData.email, contactData.phone);
      
      if (duplicateCheck.isDuplicate) {
        const fieldName = duplicateCheck.field === 'email' ? 'cette adresse email' : 'ce numéro de téléphone';
        const existingName = duplicateCheck.existingContact?.name || 'Un contact';
        const message = `${existingName} avec ${fieldName} existe déjà.`;
        
        toast.error("Contact en doublon détecté", { description: message });
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
      
      // Normaliser l'email avant insertion
      const normalizedEmail = contactData.email.toLowerCase().trim();
      
      // Insérer dans la table contacts
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          name: contactData.name,
          email: normalizedEmail,
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
        .select('*')
        .single();

      if (error) {
        // Gestion spécifique pour les erreurs de contrainte d'unicité
        if (error.code === '23505') { // Code PostgreSQL pour violation de contrainte unique
          let errorMessage = "Ce contact semble déjà exister dans la base de données.";
          
          if (error.message.includes('email')) {
            errorMessage = "Un contact avec cette adresse email existe déjà.";
          } else if (error.message.includes('phone')) {
            errorMessage = "Un contact avec ce numéro de téléphone existe déjà.";
          }
          
          toast.error("Doublon détecté", { description: errorMessage });
        } else {
          toast.error("Erreur lors de la création du contact", { description: error.message });
        }
        
        console.error("Erreur lors de la création du contact:", error);
        throw error;
      }

      toast.success("Contact créé avec succès", { 
        description: `${contactData.name} a été ajouté à votre liste de contacts` 
      });
      
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
            const fieldName = duplicateCheck.field === 'email' ? 'cette adresse email' : 'ce numéro de téléphone';
            const existingName = duplicateCheck.existingContact?.name || 'Un contact';
            const message = `${existingName} avec ${fieldName} existe déjà.`;
            
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
      if (contactData.email !== undefined) updateData.email = contactData.email.toLowerCase().trim();
      if (contactData.phone !== undefined) updateData.phone = contactData.phone;
      if (contactData.company !== undefined) updateData.company = contactData.company;
      if (contactData.position !== undefined) updateData.position = contactData.position;
      if (contactData.address !== undefined) updateData.address = contactData.address;
      if (contactData.notes !== undefined) updateData.notes = contactData.notes;
      if (contactData.assignedTo !== undefined) updateData.assignedTo = contactData.assignedTo;
      if (contactData.status !== undefined) updateData.status = contactData.status;
      if (contactData.folder !== undefined) updateData.folder = contactData.folder;
      
      // Utiliser une transaction pour garantir l'atomicité de l'opération
      const { error } = await supabase
        .from("contacts")
        .update(updateData)
        .eq("id", id);

      if (error) {
        // Gestion spécifique pour les erreurs de contrainte d'unicité
        if (error.code === '23505') { // Code PostgreSQL pour violation de contrainte unique
          let errorMessage = "Ce contact semble déjà exister dans la base de données.";
          
          if (error.message.includes('email')) {
            errorMessage = "Un contact avec cette adresse email existe déjà.";
          } else if (error.message.includes('phone')) {
            errorMessage = "Un contact avec ce numéro de téléphone existe déjà.";
          }
          
          toast.error("Doublon détecté", { description: errorMessage });
          return false;
        }
        
        console.error("Erreur lors de la mise à jour du contact:", error);
        toast.error("Erreur lors de la mise à jour du contact", {
          description: error.message
        });
        
        throw error;
      }

      toast.success("Contact mis à jour avec succès");
      return true;
    } catch (error: any) {
      console.error("Error in updateContact:", error);
      return false;
    }
  }
};

export const { createContact, addContact, updateContact } = contactCreateUpdateService;
