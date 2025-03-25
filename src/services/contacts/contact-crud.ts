// Importation des types nécessaires pour gérer les contacts
import { supabase } from '@/lib/supabase';
import { Contact, NewContact, ContactUpdate } from './types';
import { toast } from '@/components/ui/use-toast';
import { ContactStatus } from '@/types/database/enums';

/**
 * Récupère la liste des contacts depuis Supabase
 */
export const getContacts = async (): Promise<Contact[]> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des contacts:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    return [];
  }
};

/**
 * Ajoute un nouveau contact dans Supabase
 */
export const addContact = async (contactData: NewContact): Promise<Contact | null> => {
  try {
    // Assurez-vous que le statut est du type ContactStatus
    const contact = {
      ...contactData,
      status: (contactData.status || 'lead') as ContactStatus
    };
    
    const { data, error } = await supabase
      .from('contacts')
      .insert(contact)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'ajout du contact:', error);
      throw error;
    }
    
    toast({
      title: "Contact ajouté",
      description: `${contact.name} a été ajouté avec succès.`,
    });
    
    return data;
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout du contact:', error);
    
    toast({
      variant: "destructive",
      title: "Erreur",
      description: `Impossible d'ajouter le contact: ${error.message}`,
    });
    
    return null;
  }
};

/**
 * Récupère un contact spécifique par son ID
 */
export const getContactById = async (contactId: string): Promise<Contact | null> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du contact ${contactId}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du contact ${contactId}:`, error);
    return null;
  }
};

/**
 * Supprime un contact par son ID
 */
export const deleteContact = async (contactId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId);
    
    if (error) {
      console.error(`Erreur lors de la suppression du contact ${contactId}:`, error);
      throw error;
    }
    
    toast({
      title: "Contact supprimé",
      description: "Le contact a été supprimé avec succès.",
    });
    
    return true;
  } catch (error: any) {
    console.error(`Erreur lors de la suppression du contact ${contactId}:`, error);
    
    toast({
      variant: "destructive",
      title: "Erreur",
      description: `Impossible de supprimer le contact: ${error.message}`,
    });
    
    return false;
  }
};

/**
 * Met à jour les informations d'un contact
 */
export const updateContact = async (contactId: string, contactData: ContactUpdate): Promise<Contact | null> => {
  try {
    // Assurez-vous que le statut est du type ContactStatus si présent
    const contact = {
      ...contactData,
      ...(contactData.status && { status: contactData.status as ContactStatus })
    };
    
    const { data, error } = await supabase
      .from('contacts')
      .update(contact)
      .eq('id', contactId)
      .select()
      .single();
    
    if (error) {
      console.error(`Erreur lors de la mise à jour du contact ${contactId}:`, error);
      throw error;
    }
    
    toast({
      title: "Contact mis à jour",
      description: "Les informations du contact ont été mises à jour avec succès.",
    });
    
    return data;
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour du contact ${contactId}:`, error);
    
    toast({
      variant: "destructive",
      title: "Erreur",
      description: `Impossible de mettre à jour le contact: ${error.message}`,
    });
    
    return null;
  }
};

/**
 * Lie un plan d'abonnement à un contact
 */
export const linkSubscriptionPlan = async (contactId: string, subscriptionPlanId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contacts')
      .update({ subscription_plan_id: subscriptionPlanId })
      .eq('id', contactId);
    
    if (error) {
      console.error(`Erreur lors de la liaison du plan d'abonnement au contact ${contactId}:`, error);
      throw error;
    }
    
    toast({
      title: "Plan d'abonnement lié",
      description: "Le plan d'abonnement a été lié avec succès au contact.",
    });
    
    return true;
  } catch (error: any) {
    console.error(`Erreur lors de la liaison du plan d'abonnement au contact ${contactId}:`, error);
    
    toast({
      variant: "destructive",
      title: "Erreur",
      description: `Impossible de lier le plan d'abonnement au contact: ${error.message}`,
    });
    
    return false;
  }
};
