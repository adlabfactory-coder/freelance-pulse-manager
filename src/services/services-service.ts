
import { supabase } from "@/lib/supabase-client";
import { Service, ServiceType } from "@/types/service";
import { toast } from "sonner";

// Normaliser les données de service reçues de la base de données
const normalizeService = (serviceData: any): Service => {
  return {
    id: serviceData.id,
    name: serviceData.name,
    description: serviceData.description || "",
    price: Number(serviceData.price),
    type: serviceData.type || ServiceType.SERVICE,
    isActive: serviceData.is_active !== undefined ? serviceData.is_active : true,
    is_active: serviceData.is_active !== undefined ? serviceData.is_active : true, // Garder les deux formats pour compatibilité
    created_at: serviceData.created_at,
    updated_at: serviceData.updated_at
  };
};

// Récupérer tous les services
export const fetchServices = async (onlyActive = true): Promise<Service[]> => {
  try {
    let query = supabase.from('services').select('*');
    
    if (onlyActive) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur lors de la récupération des services:', error);
      throw error;
    }
    
    return (data || []).map(normalizeService);
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    toast.error("Erreur lors de la récupération des services");
    return [];
  }
};

// Récupérer un service par son ID
export const fetchServiceById = async (id: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du service ${id}:`, error);
      return null;
    }
    
    return normalizeService(data);
  } catch (error) {
    console.error(`Erreur lors de la récupération du service ${id}:`, error);
    toast.error("Erreur lors de la récupération du service");
    return null;
  }
};

// Créer un nouveau service
export const createService = async (serviceData: Omit<Service, 'id'>): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert({
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.price,
        type: serviceData.type,
        is_active: serviceData.isActive !== undefined ? serviceData.isActive : true
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du service:', error);
      toast.error("Erreur lors de la création du service");
      return null;
    }
    
    toast.success('Service créé avec succès');
    return normalizeService(data);
  } catch (error) {
    console.error('Erreur lors de la création du service:', error);
    toast.error("Erreur lors de la création du service");
    return null;
  }
};

// Mettre à jour un service existant
export const updateService = async (id: string, serviceData: Partial<Service>): Promise<Service | null> => {
  try {
    // Préparer les données pour la mise à jour en s'assurant d'utiliser is_active
    const updateData: any = {};
    if (serviceData.name !== undefined) updateData.name = serviceData.name;
    if (serviceData.description !== undefined) updateData.description = serviceData.description;
    if (serviceData.price !== undefined) updateData.price = serviceData.price;
    if (serviceData.type !== undefined) updateData.type = serviceData.type;
    if (serviceData.isActive !== undefined) updateData.is_active = serviceData.isActive;
    
    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erreur lors de la mise à jour du service ${id}:`, error);
      toast.error("Erreur lors de la mise à jour du service");
      return null;
    }
    
    toast.success('Service mis à jour avec succès');
    return normalizeService(data);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du service ${id}:`, error);
    toast.error("Erreur lors de la mise à jour du service");
    return null;
  }
};

// Supprimer un service
export const deleteService = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression du service ${id}:`, error);
      toast.error("Erreur lors de la suppression du service");
      return false;
    }
    
    toast.success('Service supprimé avec succès');
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du service ${id}:`, error);
    toast.error("Erreur lors de la suppression du service");
    return false;
  }
};
