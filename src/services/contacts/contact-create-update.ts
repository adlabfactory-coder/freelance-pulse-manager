
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
      
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError || !authData.session) {
        console.warn("Problème d'authentification:", authError?.message || "Session expirée");
        toast.error("Session expirée", { description: "Veuillez vous reconnecter pour continuer." });
        throw new Error("Session d'authentification invalide");
      }
      
      const assignedTo = contactData.assignedTo;
      const folder = contactData.folder || 'general';
      
      // Normaliser l'email avant insertion
      const normalizedEmail = contactData.email.toLowerCase().trim();
      
      console.log("Création du contact avec les données:", {
        ...contactData,
        email: normalizedEmail,
        assignedTo
      });
      
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
        } else if (error.message.includes('row-level security') || error.code === 'PGRST301') {
          toast.error("Erreur de permission", {
            description: "Vous n'avez pas les droits nécessaires pour créer un contact. Vérifiez que votre session est active."
          });
          console.error("Erreur RLS lors de la création du contact:", error);
        } else {
          toast.error("Erreur lors de la création du contact", { description: error.message });
        }
        
        console.error("Erreur lors de la création du contact:", error);
        throw error;
      }

      // Si l'assignation est à un freelance, créer également l'entrée dans freelancer_contacts
      if (assignedTo && data) {
        try {
          // Fix: Remplacer on_conflict par une approche en deux étapes
          // Vérifier si l'association existe déjà
          const { data: existingLink } = await supabase
            .from('freelancer_contacts')
            .select('*')
            .eq('freelancer_id', assignedTo)
            .eq('contact_id', data.id)
            .maybeSingle();
            
          // N'insérer que si l'association n'existe pas déjà
          if (!existingLink) {
            const { error: linkError } = await supabase
              .from('freelancer_contacts')
              .insert({
                freelancer_id: assignedTo,
                contact_id: data.id
              });
            
            if (linkError) {
              console.warn("Erreur lors de la liaison freelancer-contact:", linkError);
              
              if (linkError.message.includes('row-level security')) {
                toast.warning("La liaison freelancer-contact n'a pas pu être établie en raison de restrictions de sécurité");
              } else {
                console.warn("Détails de l'erreur:", linkError);
              }
              
              // Ne pas faire échouer toute la création à cause de cette erreur
            } else {
              console.log("Liaison freelancer-contact créée avec succès");
            }
          } else {
            console.log("Liaison freelancer-contact existe déjà, pas besoin de la créer");
          }
        } catch (linkErr) {
          console.warn("Exception lors de la liaison freelancer-contact:", linkErr);
        }
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
      // Vérifier que la session est valide
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer."
        });
        return false;
      }
      
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
      if (contactData.status !== undefined) updateData.status = contactData.status;
      if (contactData.folder !== undefined) updateData.folder = contactData.folder;
      
      // Gérer spécifiquement l'assignation à un freelance
      if (contactData.assignedTo !== undefined) {
        const newAssignedTo = contactData.assignedTo;
        updateData.assignedTo = newAssignedTo;
        
        // Si un nouveau freelance est assigné, mettre à jour également la table freelancer_contacts
        if (newAssignedTo) {
          try {
            // Fix: Remplacer la partie on_conflict par une approche en deux étapes
            // Vérifier si l'association existe déjà
            const { data: existingLink } = await supabase
              .from('freelancer_contacts')
              .select('*')
              .eq('freelancer_id', newAssignedTo)
              .eq('contact_id', id)
              .maybeSingle();
              
            // N'insérer que si l'association n'existe pas déjà
            if (!existingLink) {
              const { error: insertError } = await supabase
                .from('freelancer_contacts')
                .insert({
                  freelancer_id: newAssignedTo,
                  contact_id: id
                });

              if (insertError) {
                console.warn("Erreur lors de la création de la relation freelancer-contact:", insertError);
              } else {
                console.log("Relation freelancer-contact créée avec succès");
              }
            } else {
              console.log("Relation freelancer-contact existe déjà, pas besoin de la créer");
            }
          } catch (relErr) {
            console.warn("Exception lors de la mise à jour des relations freelancer-contact:", relErr);
            // Ne pas faire échouer la mise à jour du contact pour ça
          }
        }
      }
      
      // Mettre à jour le contact
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
