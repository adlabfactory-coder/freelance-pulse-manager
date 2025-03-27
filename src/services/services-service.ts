
import { supabase } from "@/lib/supabase-client";
import { Service } from "@/types/service";

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
      type: service.type,
      is_active: service.is_active,
      created_at: service.created_at,
      updated_at: service.updated_at
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
      type: data.type,
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error(`Unexpected error fetching service with ID ${id}:`, error);
    return null;
  }
};
