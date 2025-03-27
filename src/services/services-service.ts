
import { supabase } from "@/lib/supabase";
import { Service, ServiceType } from "@/types/service";

export const fetchServices = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Erreur lors de la récupération des services:', error);
      return [];
    }

    return data.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description || '',
      type: service.type as ServiceType,
      price: service.price,
      is_active: service.is_active,
      isActive: service.is_active // Add isActive property for components expecting it
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    return [];
  }
};

export const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean, serviceId?: string }> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert({
        name: service.name,
        description: service.description,
        type: service.type,
        price: service.price,
        is_active: service.is_active !== undefined ? service.is_active : service.isActive
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du service:', error);
      return { success: false };
    }
    
    return { success: true, serviceId: data.id };
  } catch (error) {
    console.error('Erreur lors de la création du service:', error);
    return { success: false };
  }
};

export const updateService = async (id: string, service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('services')
      .update({
        name: service.name,
        description: service.description,
        type: service.type,
        price: service.price,
        is_active: service.is_active !== undefined ? service.is_active : service.isActive
      })
      .eq('id', id);
    
    if (error) {
      console.error('Erreur lors de la mise à jour du service:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error);
    return false;
  }
};

export const deleteService = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('services')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) {
      console.error('Erreur lors de la suppression du service:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du service:', error);
    return false;
  }
};
