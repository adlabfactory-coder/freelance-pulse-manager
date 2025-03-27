
import { supabase } from "@/lib/supabase-client";
import { Service, ServiceType } from "@/types/service";

export const fetchServices = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    // Normalisation des données pour correspondre au type Service
    return data.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      price: Number(service.price),
      type: service.type as ServiceType,
      is_active: service.is_active,
      created_at: service.created_at,
      updated_at: service.updated_at,
      serviceId: service.id // Assurer la compatibilité entre id et serviceId
    }));
  } catch (error) {
    console.error('Unexpected error fetching services:', error);
    return [];
  }
};

export const fetchServiceById = async (id: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      return null;
    }
    
    if (!data) return null;
    
    // Normalisation des données
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      type: data.type as ServiceType,
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
      serviceId: data.id // Assurer la compatibilité entre id et serviceId
    };
  } catch (error) {
    console.error(`Unexpected error fetching service with ID ${id}:`, error);
    return null;
  }
};

export const updateService = async (id: string, serviceData: Partial<Service>): Promise<boolean> => {
  try {
    // S'assurer que les champs avec des noms différents sont correctement mappés
    const updateData = {
      ...serviceData,
      is_active: serviceData.is_active !== undefined ? serviceData.is_active : true
    };
    
    const { error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error(`Error updating service with ID ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error updating service with ID ${id}:`, error);
    return false;
  }
};

export const createService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean, id?: string }> => {
  try {
    // S'assurer que les champs avec des noms différents sont correctement mappés
    const insertData = {
      ...serviceData,
      is_active: serviceData.is_active !== undefined ? serviceData.is_active : true
    };
    
    const { data, error } = await supabase
      .from('services')
      .insert(insertData)
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating service:', error);
      return { success: false };
    }
    
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Unexpected error creating service:', error);
    return { success: false };
  }
};

export const deleteService = async (id: string): Promise<boolean> => {
  try {
    // Utiliser une suppression logique en mettant à jour is_active à false
    const { error } = await supabase
      .from('services')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting service with ID ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting service with ID ${id}:`, error);
    return false;
  }
};
