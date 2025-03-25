
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { Contact, ContactInsert, ContactUpdate } from './types';
import { ContactStatus } from '@/types';

export const contactCrudService = {
  async getContacts() {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts:', error);
      toast.error("Erreur", {
        description: "Impossible de récupérer les contacts",
      });
      return [];
    }
  },
  
  async getContactById(id: string) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du contact ${id}:`, error);
      toast.error("Erreur", {
        description: "Impossible de récupérer le contact",
      });
      return null;
    }
  },
  
  async createContact(contact: ContactInsert) {
    try {
      const now = new Date().toISOString();
      const newContact = {
        ...contact,
        status: contact.status || 'lead', // Par défaut, le statut est "lead"
        createdAt: now,
        updatedAt: now,
      };
      
      const { data, error } = await supabase
        .from('contacts')
        .insert(newContact)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Contact créé", {
        description: "Le contact a été créé avec succès",
      });
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du contact:', error);
      toast.error("Erreur", {
        description: "Impossible de créer le contact",
      });
      return null;
    }
  },
  
  async updateContact(id: string, contact: ContactUpdate) {
    try {
      const updatedContact = {
        ...contact,
        updatedAt: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('contacts')
        .update(updatedContact)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Contact mis à jour", {
        description: "Le contact a été mis à jour avec succès",
      });
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du contact ${id}:`, error);
      toast.error("Erreur", {
        description: "Impossible de mettre à jour le contact",
      });
      return null;
    }
  },
  
  async updateContactStatus(id: string, status: ContactStatus) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({
          status,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Statut mis à jour", {
        description: `Le contact est maintenant en statut "${status}"`,
      });
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut du contact ${id}:`, error);
      toast.error("Erreur", {
        description: "Impossible de mettre à jour le statut du contact",
      });
      return null;
    }
  },
  
  async deleteContact(id: string) {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Contact supprimé", {
        description: "Le contact a été supprimé avec succès",
      });
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du contact ${id}:`, error);
      toast.error("Erreur", {
        description: "Impossible de supprimer le contact",
      });
      return false;
    }
  }
};
