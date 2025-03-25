
import { supabase } from '@/lib/supabase';
import { Service, ServiceType } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Ensure we're using the correct type
const ensureServiceType = (type: string): ServiceType => {
  if (type === 'service' || type === 'pack') {
    return type;
  }
  return 'service'; // Default fallback
};

export const fetchServices = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching services:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load services. Please try again.",
      });
      return [];
    }

    // Transform and type-cast the data properly
    return data.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description || '',
      type: ensureServiceType(service.type),
      price: service.price,
      is_active: service.is_active || true,
      created_at: new Date(service.created_at || Date.now()),
      updated_at: new Date(service.updated_at || Date.now())
    }));
  } catch (error) {
    console.error('Unexpected error fetching services:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
    });
    return [];
  }
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching service:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      type: ensureServiceType(data.type),
      price: data.price,
      is_active: data.is_active || true,
      created_at: new Date(data.created_at || Date.now()),
      updated_at: new Date(data.updated_at || Date.now())
    };
  } catch (error) {
    console.error('Error in getServiceById:', error);
    return null;
  }
};

export const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service | null> => {
  try {
    // Map our Service type to the database schema
    const dbService = {
      name: service.name,
      description: service.description,
      type: service.type,
      price: service.price,
      is_active: service.is_active,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('services')
      .insert([dbService])
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create service. Please try again.",
      });
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      type: ensureServiceType(data.type),
      price: data.price,
      is_active: data.is_active || true,
      created_at: new Date(data.created_at || Date.now()),
      updated_at: new Date(data.updated_at || Date.now())
    };
  } catch (error) {
    console.error('Error in createService:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
    });
    return null;
  }
};

// Export the Service type to make it available for importing
export type { Service, ServiceType };
