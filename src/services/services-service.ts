import { supabase } from '@/lib/supabase';
import { Service, ServiceType } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Type guard for ServiceType
const isValidServiceType = (type: string): type is ServiceType => {
  return ['service', 'pack'].includes(type as ServiceType);
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

    return data.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description || '',
      price: service.price,
      type: isValidServiceType(service.type) ? service.type : 'service', // Ensure valid enum
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

export const fetchServiceById = async (id: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching service:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load service details. Please try again.",
      });
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: data.price,
      type: isValidServiceType(data.type) ? data.type : 'service', // Ensure valid enum
      is_active: data.is_active || true,
      created_at: new Date(data.created_at || Date.now()),
      updated_at: new Date(data.updated_at || Date.now())
    };
  } catch (error) {
    console.error('Unexpected error fetching service:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
    });
    return null;
  }
};

export const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert({
        name: service.name,
        description: service.description,
        price: service.price,
        type: service.type,
        is_active: service.is_active,
        created_at: new Date(),
        updated_at: new Date(),
      })
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

    toast({
      title: "Service Created",
      description: `${service.name} has been added to your services.`,
    });

    return data as Service;
  } catch (error) {
    console.error('Unexpected error creating service:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
    });
    return null;
  }
};

export const updateService = async (id: string, service: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update({
        name: service.name,
        description: service.description,
        price: service.price,
        type: service.type,
        is_active: service.is_active,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service. Please try again.",
      });
      return null;
    }

    toast({
      title: "Service Updated",
      description: `${service.name} has been updated.`,
    });

    return data as Service;
  } catch (error) {
    console.error('Unexpected error updating service:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
    });
    return null;
  }
};

export const deleteService = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service. Please try again.",
      });
      return false;
    }

    toast({
      title: "Service Deleted",
      description: "Service has been deleted.",
    });

    return true;
  } catch (error) {
    console.error('Unexpected error deleting service:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
    });
    return false;
  }
};
