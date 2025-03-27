
import { supabase } from '@/lib/supabase-client';
import { Service, ServiceType } from '@/types/service';

/**
 * Fetch all services
 */
export const fetchServices = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return data.map(formatServiceFromDb);
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

/**
 * Fetch a service by ID
 */
export const fetchServiceById = async (id: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return formatServiceFromDb(data);
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    return null;
  }
};

/**
 * Create a new service
 */
export const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean, id?: string }> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select('id')
      .single();
    
    if (error) throw error;
    
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error creating service:', error);
    return { success: false };
  }
};

/**
 * Update an existing service
 */
export const updateService = async (id: string, updates: Partial<Service>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error updating service with ID ${id}:`, error);
    return false;
  }
};

/**
 * Delete a service
 */
export const deleteService = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting service with ID ${id}:`, error);
    return false;
  }
};

/**
 * Format a service from the database
 */
const formatServiceFromDb = (data: any): Service => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    type: data.type as ServiceType,
    is_active: data.is_active,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
