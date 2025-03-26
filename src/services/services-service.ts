
import { supabase } from '@/lib/supabase';
import { Service, ServiceType } from '@/types';

export const fetchServices = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
    
    // Convert database fields to match our Service interface
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      type: item.type as ServiceType,
      price: item.price,
      isActive: item.is_active,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error('Unexpected error fetching services:', error);
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
        is_active: service.isActive
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating service:', error);
      return { success: false };
    }
    
    return { success: true, serviceId: data.id };
  } catch (error) {
    console.error('Unexpected error creating service:', error);
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
        is_active: service.isActive
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating service:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating service:', error);
    return false;
  }
};

export const deleteService = async (id: string): Promise<boolean> => {
  try {
    // Using soft delete by setting is_active to false
    const { error } = await supabase
      .from('services')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting service:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error deleting service:', error);
    return false;
  }
};
