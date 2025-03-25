
import { supabase } from "@/lib/supabase-client";
import { toast } from "@/components/ui/use-toast";

export interface Service {
  id: string;
  name: string;
  description: string | null;
  type: 'service' | 'pack';
  price: number;
  is_active: boolean;
}

export const fetchServices = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error("Erreur lors de la récupération des services:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les services. Veuillez réessayer plus tard.",
      });
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des services:", error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur est survenue lors de la récupération des services.",
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
      console.error("Erreur lors de la récupération du service:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du service:", error);
    return null;
  }
};
