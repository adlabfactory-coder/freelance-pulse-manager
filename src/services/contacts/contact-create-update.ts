
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { ContactFormValues } from "@/components/contacts/schema/contactFormSchema";
import { v4 as uuidv4 } from 'uuid';

// Ajouter un nouveau contact
export const addContact = async (data: ContactFormValues): Promise<string> => {
  console.log("Insertion d'un nouveau contact avec les données:", data);
  
  if (!data.assignedTo) {
    console.error("AssignedTo est obligatoire pour les règles RLS");
    throw new Error("Erreur: L'attribution du contact est obligatoire");
  }

  // Vérifier que assignedTo est un UUID valide
  try {
    // Validation pour vérifier que l'ID ressemble à un UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(data.assignedTo)) {
      console.error("L'ID assignedTo n'est pas un UUID valide:", data.assignedTo);
      throw new Error("Erreur: L'identifiant d'utilisateur n'est pas valide");
    }

    // Vérifier la session actuelle pour confirmer l'authentification
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      console.error("Erreur de session:", sessionError || "Aucune session active");
      throw new Error("Erreur: Vous devez être connecté pour effectuer cette action");
    }
    
    console.log("Session utilisateur active:", sessionData.session.user.id);
    console.log("Contact assigné à:", data.assignedTo);
    
    // S'assurer que l'utilisateur assigne le contact à lui-même (pour RLS)
    if (sessionData.session.user.id !== data.assignedTo) {
      console.warn("Réattribution du contact à l'utilisateur actuel pour RLS");
      data.assignedTo = sessionData.session.user.id;
    }

    const { data: newContact, error } = await supabase
      .from('contacts')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        position: data.position || null,
        address: data.address || null,
        status: data.status,
        notes: data.notes || null,
        assignedTo: data.assignedTo
      }])
      .select('id')
      .single();

    if (error) {
      console.error("Erreur Supabase lors de l'insertion:", error);
      throw error;
    }

    if (!newContact) {
      throw new Error("Aucune donnée retournée après l'insertion");
    }

    return newContact.id;
  } catch (error: any) {
    console.error("Erreur lors de l'ajout du contact:", error);
    throw error;
  }
};

// Mettre à jour un contact existant
export const updateContact = async (id: string, data: ContactFormValues): Promise<void> => {
  console.log("Mise à jour du contact avec ID:", id, "et données:", data);
  
  if (!data.assignedTo) {
    console.error("AssignedTo est obligatoire pour les règles RLS");
    throw new Error("Erreur: L'attribution du contact est obligatoire");
  }

  // Vérifier que assignedTo est un UUID valide
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(data.assignedTo)) {
    console.error("L'ID assignedTo n'est pas un UUID valide:", data.assignedTo);
    throw new Error("Erreur: L'identifiant d'utilisateur n'est pas valide");
  }

  try {
    // Vérifier la session actuelle pour confirmer l'authentification
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      console.error("Erreur de session:", sessionError || "Aucune session active");
      throw new Error("Erreur: Vous devez être connecté pour effectuer cette action");
    }
    
    console.log("Session utilisateur active:", sessionData.session.user.id);
    
    // S'assurer que l'utilisateur assigne le contact à lui-même (pour RLS)
    if (sessionData.session.user.id !== data.assignedTo) {
      console.warn("Réattribution du contact à l'utilisateur actuel pour RLS");
      data.assignedTo = sessionData.session.user.id;
    }

    const { error } = await supabase
      .from('contacts')
      .update({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        position: data.position || null,
        address: data.address || null,
        status: data.status,
        notes: data.notes || null,
        assignedTo: data.assignedTo,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error("Erreur Supabase lors de la mise à jour:", error);
      throw error;
    }
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du contact:", error);
    throw error;
  }
};

// Export du service pour l'intégration
export const contactCreateUpdateService = {
  createContact: addContact,
  updateContact,
  addContact
};
